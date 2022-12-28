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
//cconst io = socketio(server);
const usernames = ["bob", "alice", "sam", "john"];      // Server has list of usernames that it uses to randomly assign to clients
const mainRoom = "Main";            // All clients initally connect to main room

let rooms = [];                     // List of rooms that the server has

// client connects
io.on("connection", socket => {
  // client joins the main room
  if (socket.handshake.headers.type == "pub") {
    socket.join(mainRoom);

    // this is for publishers
    // client gets his username, and roomid
    let roomID = genRoomID();
    let username = genUsername();
    socket.emit(mainRoom, {
      username: username,
      type: "pub",
      roomID: roomID
    });
    gotoroom(socket, roomID, username);
    console.log("Socket: ",socket.id, " connected to this server",'\n',"has name: ",username, " and roomID: ",roomID,'\n'); 
  } else {
    let r = socket.handshake.headers.roomid;
    socket.join(r);
    let username = genUsername();
    socket.emit(r, {
      username: username,
      type: "sub",
      roomID: r
    }); 
    console.log("Socket: ",socket.id, " connected to this server",'\n',"has name: ",username, " and roomID: ",r,'\n'); 
  }
});


function gotoroom(socket, roomID, username) {
  socket.join(roomID);
  socket.emit(roomID,{
    text: "Success"
  });
}

// socketio.on('sendMessage', (message, callback) => {
//   const user = getUser(socketio.id);

//   io.to(user.room).emit('message', { user: user.name, text: message });

//   callback();
// });

// socketio.on('disconnect', () => {
//   const user = removeUser(socketio.id);

//   if (user) {
//     io.to(user.room).emit('message', {
//       user: 'adminX',
//       text: `${user.name.toUpperCase()} has left.`
//     });
//     io.to(user.room).emit('roomData', {
//       room: user.room,
//       users: getUsersInRoom(user.room)
//     });
//   }
// });

server.listen(process.env.PORT || 8080, () =>
  console.log('Server is running')
);


const genUsername = () => {
  return usernames[Math.floor(Math.random() * usernames.length)];
}

const genRoomID = () => {
  let roomID = Math.random().toString(10).slice(2);
  rooms.push(roomID);
  return roomID;
}