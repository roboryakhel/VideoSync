const http = require('http');
const { SocketAddress } = require('net');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const usernames = ["bob", "alice", "sam", "john"];
const mainRoom = "Main";

let rooms = [];

// client connects
io.on("connection", socket => {
  // client joins the main room
  socket.join(mainRoom);

  if (true) { // this is for publishers
    // client gets his username, and roomid
    let roomID = genRoomID();
    let username = genUsername();
    socket.emit(mainRoom, {
      user: username,
      type: "pub",
      roomID: roomID
    });
    
  }
  console.log(socket.id);

});


function gotoroom(socket, roomID, username) {
  socket.join(roomID);
  socket.emit(roomID,{
    text: `Welcome to your room ${roomID}, ${username} `
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

server.listen(process.env.PORT || 3000, () =>
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