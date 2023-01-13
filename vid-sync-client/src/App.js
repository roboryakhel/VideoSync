import React, {useState} from 'react';
import './App.css';
import { io } from "socket.io-client";
import { ConnectionSideMenu } from './Components/ConnectionSideMenu';
import { VideoPlayer } from './Components/VideoPlayer';

const URL = "ws://localhost:8080";

let emit = false;
// let subroom = "aaaaaaa";
let pr ="";
let seekCycle = 0;

function App() {
  const [uName, setUname] = useState("");
  const [room, setRoomID] = useState("0");
  const [socket, setSocket] = useState(false);
  const [isRoomValid, setisRoomValid] = useState(false);
  const [type, setType] = useState("");
  const [seekTime, setSeekTime] = useState(0);

  function connect(t) {
      if (t === "sub") 
      connectSubscriber(room)
      else  {
        //   console.log("Room ID invlid or No RoomID. Connecting as host...");
          connectPublisher();
      } 
  }
  // Friend sends pubRoomID via msg and this client get put in that room.
  const connectSubscriber = (pubRoomID) => {
      console.log("connecting subscriber");
      const socket = io(URL, {
          extraHeaders: {
          type: "sub",
          roomID: pubRoomID
          }
      });
      setSocket(socket);
      socket.on(pubRoomID, (args) => {
          if (args === "Room does not exist") {
              console.log("Could not connect to server. Room does not exist.");
              socket.on("disconnect", () => {
                  console.log("Disconnected");
              });              
          }
          else {
            //   console.log(args);
              setUname(args.username);
            //   setRoomID(args.roomID);
              console.log(uName," connected to room ", room, " as ", type);
              setSocket(socket);
              setType("sub");
              socket.on('VTL', (args) => {
                setSeekTime(Math.floor(args.time));
                console.log(seekTime + " " + args.time);
            })
          }
      });
  }

  // Connect to server and get username, and roomID, then go to my own room
  const connectPublisher = () => {
      const socket = io(URL, {
          withCredentials: true,
          extraHeaders: {
              type: "pub"
          }
      });
      setSocket(socket);
      console.log(socket.id, " connecting to server");
      socket.on("Main", (args) => {
          setUname(args.username);
          setRoomID(args.roomID);
          console.log(uName," connected to room ", room, " as ", type);
          putPubinTheirRoom(socket);
      });
      setType("pub");
  }

  // Connect to client room and send init msg
  const putPubinTheirRoom = (socket) => {
      socket.on(room, (args) => {
          if (args.text === "Success")
              console.log("You are now in room: ", room, ", ", uName);
      });
  }

  // TODO: fix this function
  function handleInput(event) {
    setRoomID(event.target.value);
  }

  const onProgress = (event) => {
      if (type === "sub" && seekCycle === 0) {
          pr.seekTo(Math.floor(seekTime));
          seekCycle = 100;
      } else {
          if (socket && emit) {
              socket.emit("onProgress", {time:event.playedSeconds});
              console.log("emmitted new time " + event.playedSeconds);
          } else {
              console.log("Socket not connected. Progress not emitted.");
          }
      }
      if (type === "sub")
          seekCycle--;
  }

  return (
   <>
    <ConnectionSideMenu con={connect} han={handleInput} r={room}/>
    <VideoPlayer />
   </>
  );
}

export default App;
