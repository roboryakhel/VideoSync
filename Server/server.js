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
const roomsToUsers = new InMemoryDatabase();    // Map of rooms to usernames: roomID --> [uName1, uName2, ...]
const usersToRooms = new InMemoryDatabase();    // Map of users to rooms: socket.id --> roomID

// client connects
io.on("connection", (socket) => {
  if (socket.handshake.headers.type === "pub") {
    let roomID = genRoomID();
    let username = usernames[0];    // All publishers will be names "BigHoss"
    
    roomsToUsers.set(roomID, username);
    socket.emit(mainRoom, {
      username: username,
      roomID: roomID,
    });
    goToRoom(socket, roomID, username);
    console.log("Socket: ",socket.id," connected to this server as PUB and has name: ", username," and roomID: ",roomID);
  } else {
    let room = socket.handshake.headers.roomid;
    if (!roomsToUsers.has(room) || roomSize(room) > 6) {
        console.log("Room does not exist or is full");
        socket.emit(room, "Room does not exist or is full");
    } else if (roomsToUsers.has(room) && roomSize(room) < 6){
        socket.join(room);
        let username = genUsername(room);
        roomsToUsers.set(room, roomsToUsers.get(room)+","+username); // get the array, slice is with comma delimit and reconstrust a new one. 
        socket.emit(room, {
          username: username,
        });
        usersToRooms.set(socket.id, room);
        console.log("Socket: ",socket.id," connected to this server as SUB and has name: ", username, " and roomID: ", room,);
      }
   }

  console.log(roomsToUsers);
  console.log(usersToRooms);

  socket.on("onProgress", (message) => {  
    io.to(usersToRooms.get(socket.id)).emit('VTL', message);
    console.log (message);
  });

  socket.on("disconnect", () => {
    let room = usersToRooms.get(socket.id);

    for (const u of usersToRooms.keys()) {
      if (usersToRooms.get(u) === room  && u != socket.id) {
        console.log(u + " will be the new pub");
        socket.broadcast.to(u).emit( 'Admin', {type:"pub",msg:"you are the new pub!"} );
        break;
      }
    }
    usersToRooms.delete(socket.id);
    console.log(socket.id +" disconnected");
    console.log(usersToRooms);
  });
});

const goToRoom = (socket, roomID, username) => {
  socket.join(roomID);
  socket.emit(roomID, {
    text: "Success",
  });
  usersToRooms.set(socket.id, roomID);
}

const genUsername = (room) => {
  let uL = roomsToUsers.get(room);

  for (const name of usernames) {
    if (!uL.includes(name))
      return name;
  }
};

const genRoomID = () => {
  let roomID = Date.now().toString(36) + Math.random().toString(36);
  return roomID;
};


const roomSize = (room) => {
  return roomsToUsers.get(room).split(",").length
}


server.listen(process.env.PORT || 8080, () => console.log("Server is running"));
