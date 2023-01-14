import React, {useState} from 'react';
import './App.css';
import { io } from "socket.io-client";
import { ConnectionSideMenu } from './Components/ConnectionSideMenu';
import { VideoPlayer } from './Components/VideoPlayer';
import ReactPlayer from 'react-player';


const URL = "ws://localhost:8080";

let emit = false;
let pr ="";
let seekCycle = 0;

function App() {
  const [uName, setUname] = useState("");
  const [room, setRoomID] = useState("0");
  const [socket, setSocket] = useState(false);
  const [type, setType] = useState("");
  const [seekTime, setSeekTime] = useState(0);
  const [videoURL, setVideoURL] = useState("");

  function connect(t) {
      if (t === "sub") {
        connectSubscriber(room)
      }
      else {
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
              console.log(args);
              setUname(args.username);
              setRoomID(args.roomID);
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
      socket.on("Main", (args) => {
        setUname(args.username);
        setRoomID(args.roomID);
        console.log(uName," connected to room ", room, " as ", type);
      });
      setType("pub");
      setSocket(socket);

  }

  // TODO: fix this function
  function handleInput(event) {
    setRoomID(event.target.value);
  }

  function onProgress(event) {
      if (type === "sub" && seekCycle === 0) {
        const currTime = event.playedSeconds;
        if (Math.abs(Math.floor(currTime)-seekTime) > 1)
            pr.seekTo(Math.floor(seekTime));
          seekCycle = 5;
      } else {
          if (socket && type == "pub") {
              socket.emit("onProgress", {time:event.playedSeconds});
              console.log("emmitted new time " + event.playedSeconds);
          } else {
              console.log("Socket not connected. Progress not emitted.");
          }
      }
      if (type === "sub")
          seekCycle--;
  }

    function handleChangeURL(event)  {
    setVideoURL(global.URL.createObjectURL(event.target.files[0]));
    console.log(videoURL);
    }

    function ref(p) {
        pr = p;
    }

  return (
   <>
    <ConnectionSideMenu con={connect} han={handleInput} r={room} chURL={handleChangeURL}/>
    {/* <VideoPlayer ref={ref} url={videoURL} onProgress={onProgress}/> */}

    <div className={"vidWrapper"}>
        <div className={"vidContainer"}>
            <div>
                <ReactPlayer ref={ref} url={videoURL}  className="react-player" playing controls width="100%" height="100%" onProgress={onProgress} />                  
            </div>
        </div>
    </div>
   </>
  );
}

export default App;
