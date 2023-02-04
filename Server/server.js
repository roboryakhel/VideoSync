const http = require('http');
const { SocketAddress } = require('net');
const express = require('express');
const { InMemoryDatabase } = require('in-memory-database')
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["type", "roomID"],
    credentials: true,
  },
});

let usernames = ["BigHoss","bigfootisreal", "SaintBroseph", "FrostedCupcake", "kim_chi", "Babushka"];
const mainRoom = "Main";
const roomsToUsers = new InMemoryDatabase();    // Map of rooms to usernames: roomID --> "sid:uname1, ... ,sid:uname2"
const usersToRooms = new InMemoryDatabase();    // Map of users to rooms: socket.id --> roomID
const socketToType = new InMemoryDatabase();    // Map of socketID to user Type: socket.id --> "pub"/"sub"

// client connects
io.on("connection", (socket) => {
  console.log("==================== On Connection ====================");
  if (socket.handshake.headers.type === "pub") {
    let roomID = genRoomID();
    let username = usernames[0];
    
    // if a pub is trying to connect but it already exists in the server then delete the previous details.
    roomsToUsers.set(roomID, socket.id+":"+username);
    socketToType.set(socket.id, "pub");
    socket.emit(mainRoom, {
      username: username,
      roomID: roomID,
    });
    socket.join(roomID);
    socket.emit(roomID, {
      text: "Success",
    });
    usersToRooms.set(socket.id, roomID);    
    console.log("Socket: "+socket.id+" connected to this server as PUB and has name: "+username+" and roomID: "+roomID);
  } else {
    let room = socket.handshake.headers.roomid;
    if (!roomsToUsers.has(room) || roomSize(room) >= 6) {
        console.log("Room does not exist or is full");
        socket.emit(room, "Room does not exist or is full");
    } else if (roomsToUsers.has(room) && roomSize(room) < 6){
        let username = genUsername(room);
        socket.join(room);
        roomsToUsers.set(room, roomsToUsers.get(room)+","+socket.id+":"+username);
        socketToType.set(socket.id, "sub");
        socket.emit(room, {
          username: username,
        });
        usersToRooms.set(socket.id, room);
        io.to(room).emit("CH1", {type:"new user", msg: roomsToUsers.get(room)});
        console.log("Socket: "+socket.id+" connected to this server as SUB and has name: "+username+" and roomID: "+room);
      }
   }

  console.log(roomsToUsers);
  console.log(usersToRooms);

  socket.on("CH0", (message) => {  
    io.to(usersToRooms.get(socket.id)).emit("CH1", message);
    console.log (message);
  });

  socket.on("disconnect", () => {
    let room = usersToRooms.get(socket.id);

    if (roomSize(room) < 2)            // If there is only 1 person in the room and they are leaving
      roomsToUsers.delete(room);
    else {
      // If pub is leaving
       if (socketToType.get(socket.id) == "pub") {
          for (const u of usersToRooms.keys()) {
            if (usersToRooms.get(u) === room  && u != socket.id) {
              console.log(u + " will be the new pub");
              socket.broadcast.to(u).emit( 'Admin', {type:"pub",msg:"you are the new pub!"} );
              break;
            }
          }
        }
      console.log("about to delete from this list: " + roomsToUsers.get(room));
      removeUserFromRoom(room, socket.id);
      io.to(room).emit("CH1", {type:"usersupdate", msg: roomsToUsers.get(room)});
    }
    usersToRooms.delete(socket.id);
    console.log(roomsToUsers);
    console.log(usersToRooms);
  });
});


const removeUserFromRoom = (room, sid) => {
  roomsToUsers.set(room, roomsToUsers.get(room).toString().split(",").filter(e => !e.includes(sid)));
}

const genUsername = (room) => {
  let uL = roomsToUsers.get(room);

  for (const name of usernames) {
    if (!uL.includes(name))
      return name;
  }
};

const genRoomID = () => { return Date.now().toString(36) + Math.random().toString(36); };

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

server.listen(process.env.PORT || 8080, () => console.log("Server is running"));