import React, {useState, useEffect} from 'react';
import { useSearchParams} from "react-router-dom";
import ReactPlayer from 'react-player';
import { io } from "socket.io-client";
import { ConnectionSideMenu } from './Components/ConnectionSideMenu';
import './App.css';

const URL = "ws://localhost:8080";

let socket = "";
let type = "pub";
let pr = "";
let seekTime = 0;

let seekCycle = 0;

function App() {
    const [searchParams, setSearchParams] = useSearchParams()
    // const [uName, setUname] = useState("");
    let uName = "";
    // const [room, setRoomID] = useState("No Room");
    let room = "";
    // const [socket, setSocket] = useState(false);
    // const [type, setType] = useState("");
    // const [seekTime, setSeekTime] = useState(0);
    const [videoURL, setVideoURL] = useState("");
    let copyURL = "";
    const urlParam = searchParams.get("r")

    useEffect(
        () => {
            // If URL param is valid then connect subscriber.
            if (urlParam && urlParam.length > 10) {
                room = urlParam
                connectSubscriber(urlParam);
                console.log(room);
            }
        },
        [ ]
    );

    // Friend sends pubRoomID via msg and this client get put in that room.
    function connectSubscriber(pubRoomID) {
        console.log("connecting subscriber");
        socket = io(URL, {
            extraHeaders: {
            type: "sub",
            roomID: pubRoomID
            }
        });
        socket.on(pubRoomID, (args) => {
            if (args === "Room does not exist") {
                console.log("Could not connect to server. Room does not exist.");
                socket.on("disconnect", () => {
                    console.log("Disconnected");
                });              
            }
            else {
                console.log(args);
                uName = args.username;
                console.log(uName," connected to room ", room, " as ", type);
                type = "sub";
                socket.on('VTL', (args) => {
                    seekTime = Math.floor(args.time);
                    console.log(seekTime + " " + args.time);
                })
            }
        });
    }

    // Connect to server and get username, and roomID, then go to my own room
    const connectPublisher = () => {
        socket = io(URL, {
            extraHeaders: {
                type: type
            }
        });
        socket.on("Main", (args) => {
            uName = args.username;
            room = args.roomID;
            copyURL = "http://localhost:3000/?r="+room;
            console.log(uName," connected to room ", room, " as ", type);
        });
     
    }

    function onProgress(event) {
        if (type === "sub" && seekCycle === 0) {
            const currTime = event.playedSeconds;
            if (Math.abs(Math.floor(currTime)-seekTime) > 1)
                pr.seekTo(Math.floor(seekTime));
            seekCycle = 5;
        }
        else if (type === "pub" && socket.connected) {
            socket.emit("onProgress", {time:event.playedSeconds});
            console.log("emmitted new time " + event.playedSeconds);
        } 
        else
            console.log("Socket not connected. Progress not emitted.");
        
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

    function copyURLf() {
        navigator.clipboard.writeText(copyURL);

    }


  return (
   <>
    <ConnectionSideMenu con={connectPublisher}  r={room} chURL={handleChangeURL} copyURL={copyURLf} />

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