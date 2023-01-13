const http = require('http');
const { SocketAddress } = require('net');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server,{
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["type", "roomID"],
    credentials: true
  }
});

const usernames = ["bob", "alice", "sam", "john"];      // Server has list of usernames that it uses to randomly assign to clients
const mainRoom = "Main";            // All clients initally connect to main room

let rooms = [];                     // List of rooms that the server has
const users = new Map();

// client connects
io.on("connection", socket => {
  if (socket.handshake.headers.type === "pub") {
    // this is for publishers
    // client gets his username, and roomid
    let roomID = genRoomID();
    let username = genUsername();
    socket.emit(mainRoom, {
      username: username,
      roomID: roomID
    });
    gotoroom(socket, roomID, username);
    console.log("Socket: ",socket.id, " connected to this server",'\n',"has name: ",username, " and roomID: ",roomID,'\n'); 
  } 
  else {
    let r = socket.handshake.headers.roomid;
    if (!rooms.includes(r)) {
      console.log("Bad connection attempt. Disconnecting...");
      socket.emit(r,"Room does not exist");
    } else {
      socket.join(r);
      let username = genUsername();
      socket.emit(r, {
        username: username
      }); 
      users.set(socket.id, r);
      console.log("Socket: ",socket.id, " connected to this server",'\n',"has name: ",username, " and roomID: ",r,'\n'); 
    }
  }

  socket.on("onProgress", (message) => {
    const uID = socket.id;
  
    io.to(users.get(uID)).emit('VTL', message);
    console.log (message);
  });

  socket.on("disconnect", () => {
    console.log(socket.id +" disconnected");
    users.delete(socket.id);
    // const user = removeUser(socketio.id);
  
    // if (user) {
    //   io.to(user.room).emit('message', {
    //     user: 'adminX',
    //     text: `${user.name.toUpperCase()} has left.`
    //   });
    //   io.to(user.room).emit('roomData', {
    //     room: user.room,
    //     users: getUsersInRoom(user.room)
    //   });
    // }
  });

  console.log(users);
});


const gotoroom = (socket, roomID, username) => {
  socket.join(roomID);
  socket.emit(roomID,{
    text: "Success"
  });
  users.set(socket.id, roomID);
}

// TODO: make this generate unique name
const genUsername = () => {
  return usernames[Math.floor(Math.random() * usernames.length)];
}
// TODO: make this generate unique id
const genRoomID = () => {
  let roomID = Date.now().toString(36) + Math.random().toString(36);
  rooms.push(roomID);
  return roomID;
}

server.listen(process.env.PORT || 8080, () =>
  console.log('Server is running')
);