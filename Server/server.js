// const https = require('https');
const http = require('http');
const express = require('express');
const { InMemoryDatabase } = require('in-memory-database');
const app = express();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
// const sslServer = https.createServer({
//   key:fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//   cert:fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
// },
// app);
const sslServer = http.createServer(app);
const io = require("socket.io")(sslServer, {
  cors: {
    // origin: 'https://watch-partyso.netlify.app',
    origin: 'http://127.0.0.1:4200',
    methods: ["GET", "POST"],
    allowedHeaders: ["type", "roomID","uid"],
    credentials: true,
  },
});

let usernames = ["BigHoss","bigfootisreal", "SaintBroseph", "FrostedCupcake", "kim_chi", "Babushka"];
const mainRoom = "Main";
const roomsToUsers = new InMemoryDatabase();    // Map of rooms to usernames: roomID --> "sid:uname1, ... ,sid:uname2"
const usersToRooms = new InMemoryDatabase();    // Map of users to rooms: socket.id --> roomID
const socketToType = new InMemoryDatabase();    // Map of socketID to user Type: socket.id --> "pub"/"sub"
const activeSessions = new InMemoryDatabase();  // Map of userID and socketID. userID will represent the connection key. To enforce single socket per user.
const vidPlayingInRoom = new InMemoryDatabase(); // Map of roomID and video URL. roomID will be key and url will be value. 

// client connects
io.on("connection", (socket) => {
  console.log("==================== On Connection ====================");
  // console.log(socket.handshake.headers);
  if (socket.handshake.headers.type === "pub") {
    if (socket.handshake.headers.uid !== "0" && activeSessions.has(socket.handshake.headers.uid)) {
      socket.emit('CONN-STATUS', {code:1, msg:"Connection rejected because you have an active session."});
      console.log(socket.id+ "::"+socket.handshake.headers.uid+"Connection rejected because active session exists");
      console.log("Active Sessions : " + activeSessions);
      console.log("rooms to users map : "+roomsToUsers);
      console.log("users to rooms map : " + usersToRooms); 
    } else {
      socket.emit('CONN-STATUS', {code:0, msg:"success"});
      let roomID = genRID();
      let username = usernames[0];
      let userID = genUID();
      
      // if a pub is trying to connect but it already exists in the server then delete the previous details.
      roomsToUsers.set(roomID.toString(), socket.id+":"+username);
      socketToType.set(socket.id.toString(), "pub");
      socket.emit(mainRoom, {
        username: username,
        roomID: roomID,
        pubID: userID
      });
      socket.join(roomID);
      usersToRooms.set(socket.id.toString(), roomID); 
      activeSessions.set(userID.toString(),socket.id);   
      console.log("Socket: "+socket.id+" connected to this server as PUB and has name: "+username+" and roomID: "+roomID);
    }
  } else if (socket.handshake.headers.type === "sub"){
    let room = socket.handshake.headers.roomid;
    if (activeSessions.has(socket.handshake.headers.uid)) {
      socket.emit('CONN-STATUS', {code:1,msg:"Connection rejected because you have an active session."});
      console.log(socket.id+ "::"+socket.handshake.headers.uid+"Connection rejected because active session exists");
    } else if (!roomsToUsers.has(room) || roomSize(room) >= 6) {
        console.log("Room does not exist or is full");
        socket.emit('CONN-STATUS', {code:1,msg:"RDNE"});
    } else if (roomsToUsers.has(room) && roomSize(room) < 6){
        socket.emit('CONN-STATUS', {code:0, msg:"success"});
        let username = genUsername(room);
        let userID = genUID();
        socket.join(room);
        roomsToUsers.set(room, roomsToUsers.get(room)+","+socket.id+":"+username);
        socketToType.set(socket.id, "sub");
        socket.emit(room, {
          username: username,
          subID: userID,
          vUrl: (vidPlayingInRoom.get(room)) ? vidPlayingInRoom.get(room) : "0"
        });
        usersToRooms.set(socket.id, room);
        activeSessions.set(userID,socket.id);   
        io.to(room).emit('MEMS-C', {msg: getUsersInRoom(room)});
        console.log("Socket: "+socket.id+" connected to this server as SUB and has name: "+username+" and roomID: "+room);
      }
   }

  console.log(activeSessions);
  console.log(roomsToUsers);
  console.log(usersToRooms);

  socket.on('VC-S', (message) => {  
    io.to(usersToRooms.get(socket.id)).emit('VC-C', message);
    console.log (message);
  });

  socket.on('OLVID-S', (message) => {  
    io.to(usersToRooms.get(socket.id)).emit('OLVID-C', message);
    vidPlayingInRoom.set(usersToRooms.get(socket.id), message.url);
    // console.log (message);
  });

  socket.on('PGT-S', (message) => {  
    io.to(usersToRooms.get(socket.id)).emit('PGT-C', message);
    console.log (message);
  });

  socket.on('CHAT-S', (message) => {  
    io.to(usersToRooms.get(socket.id)).emit('CHAT-C', message);
    // console.log (message);
  });

  socket.on("disconnect", () => {
    let room = usersToRooms.get(socket.id.toString());

    if (roomSize(room) < 2)            // If there is only 1 person in the room and they are leaving
      roomsToUsers.delete(room);
    else {
      // If pub is leaving
       if (socketToType.get(socket.id) == "pub") {
          for (const u of usersToRooms.keys()) {
            if (usersToRooms.get(u) === room  && u != socket.id) {
              console.log(u + " will be the new pub");
              socket.broadcast.to(u).emit('PUBH-C', {type:"pub",msg:"you are the new pub!"} );
              break;
            }
          }
        }
      console.log("about to delete from this list: " + roomsToUsers.get(room));
      removeUserFromRoom(room, socket.id);
      io.to(room).emit('MEMS-C', {msg: getUsersInRoom(room)});
    }
    let delSession="";
    for (const a of activeSessions.keys()) {
      if (activeSessions.get(a) === socket.id)
        delSession = a;
    }
    activeSessions.delete(delSession);
    usersToRooms.delete(socket.id);
    console.log(roomsToUsers);
    console.log(usersToRooms);
  });
});

const removeUserFromRoom = (room, sid) => {
  roomsToUsers.set(room, roomsToUsers.get(room).toString().split(",").filter(e => !e.includes(sid)));
}

const genUsername = (room) => {
  let usersStr = roomsToUsers.get(room);

  for (const name of usernames) {
    if (!usersStr.includes(name))
      return name;
  }
};

function genRID() {
  const chatroomID = uuidv4();
  return chatroomID;
}
const genUID = () => { return "uid:"+Date.now().toString(36) + Math.random().toString(36); };

// The size is of the number of users in a room. 
// Counts the number of keys given a roomID.
const roomSize = (room) => {
  let size = 0;
  for (const u of usersToRooms.keys()) {
    if (usersToRooms.get(u) === room) {
      size++;
    }
  }
  return size;
}

const getUsersInRoom = ( room) => {
  let arr="";
  let ARR = roomsToUsers.get(room).toString().split(",");
  for (const u of ARR)
    arr += ","+u.split(":")[1];
  
  return arr;
}


sslServer.listen(process.env.PORT || 8080, () => console.log("Server is running"));