const http = require("http");
const { SocketAddress } = require("net");
const express = require("express");
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

const usernames = [
  "Watcher1",
  "Watcher2",
  "Watcher3",
  "Watcher4",
  "Watcher5",
  "Watcher6",
]; // Server has list of usernames that it uses to randomly assign to clients
const mainRoom = "Main"; // All clients initally connect to main room

let rooms = []; // List of rooms that the server has
const users = new Map();
const room = new Map();

// client connects
io.on("connection", (socket) => {
  if (socket.handshake.headers.type === "pub") {
    // this is for publishers
    // client gets his username, and roomid
    let roomID = genRoomID();
    let username = genUsername();
    if (!room[user]) {
      room[user] = [];
    room[user].push(username);
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
    if (room.get().length !== usernames.length) {
      if (!rooms.includes(r)) {
        console.log("Bad connection attempt. Disconnecting...");
        socket.emit(r, "Room does not exist");
      } else {
        socket.join(r);
        let username = genUsername();
        socket.emit(r, {
          username: username,
        });
        users.set(socket.id, r);
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
  } else {
    console.log(
      "Socket: ",
      socket.id,
      " is full",
      "\n"
    );

  }
}

  socket.on("onProgress", (message) => {
    const uID = socket.id;

    io.to(users.get(uID)).emit("VTL", message);
    console.log(message);
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
    users.delete(socket.id);
  });

  console.log(users);
});

const goToRoom = (socket, roomID, username) => {
  socket.join(roomID);
  socket.emit(roomID, {
    text: "Success",
  });
  users.set(socket.id, roomID);
};

const genUsername = () => {
  // usernames[Math.floor(Math.random() * usernames.length)];
  return usernames[room.get().length];
};

const genRoomID = () => {
  let roomID = Date.now().toString(36) + Math.random().toString(36);
  rooms.push(roomID);
  return roomID;
};

server.listen(process.env.PORT || 8080, () => console.log("Server is running"));
