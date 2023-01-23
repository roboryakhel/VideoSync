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

let usernames = ["bigfootisreal", "SaintBroseph", "FrostedCupcake", "kim_chi", "Babushka", "ashley_said_what"]; // Server has list of usernames that it uses to randomly assign to clients
const mainRoom = "Main"; // All clients initally connect to main room
const roomToUsers = new InMemoryDatabase();
const usersToRooms = new InMemoryDatabase();

// client connects
io.on("connection", (socket) => {
  if (socket.handshake.headers.type === "pub") {
    // this is for publishers
    // client gets his username, and roomid
    let roomID = genRoomID();
    let username = genUsername();
    
    roomToUser.set(roomID, new Array().fill(username);
    socket.emit(mainRoom, {
      username: username,
      roomID: roomID,
    });
    goToRoom(socket, roomID, username);
    console.log(
      "Socket: ",
      socket.id,
      " connected to this server",
      "\n",
      "has name: ",
      username,
      " and roomID: ",
      roomID,
      "\n"
    );
  } else {
    let r = socket.handshake.headers.roomid;
    if (!roomToUser.contains(r) && roomToUser.get(r).length() > usernames.length) {
        console.log("Bad connection attempt. Disconnecting...");
        socket.emit(r, "Room does not exist or is full");
        console.log("Room is full", "\n");
    } else {
        socket.join(r);
        let username = genUsername(r);
        roomToUser.set(r, roomToUser.get(r).append(username))
        socket.emit(r, {
          username: username,
        });
        usersToRooms.set(socket.id, r);
        console.log(
          "Socket: ",
          socket.id,
          " connected to this server",
          "\n",
          "has name: ",
          username,
          " and roomID: ",
          r,
          "\n"
        );
      }
   }

  console.log(roomsToUsers);
  console.log(usersToRooms);

  socket.on("onProgress", (message) => {  
    io.to(users.get(socket.id)).emit('VTL', message);
    console.log (message);
  });

  socket.on("disconnect", () => {
    console.log(socket.id +" disconnected");
    let room = usersToRooms.get(socket.id);

    for (const u of usersToRooms.keys()) {
      if (usersToRooms.get(u) === room  && u != socket.id) {
        console.log(u + " will be the new pub");
        socket.broadcast.to(u).emit( 'Admin', {type:"pub",msg:"you are the new pub!"} );
        break;
      }
    }
    usersToRooms.delete(socket.id);
  });

  console.log(usersToRooms);
});

const goToRoom = (socket, roomID, username) => {
  socket.join(roomID);
  socket.emit(roomID, {
    text: "Success",
  });
  usersToRooms.set(socket.id, roomID);
}


// Fix this.
const genUsername = (room) => {
  let uL = roomToUsers.get(room);
  while (room[username]) {
    username = usernames[Math.floor(Math.random() * usernames.length)];
  }
  return username;
};

const genRoomID = () => {
  let roomID = Date.now().toString(36) + Math.random().toString(36);
  rooms.push(roomID);
  return roomID;
};

server.listen(process.env.PORT || 8080, () => console.log("Server is running"));
