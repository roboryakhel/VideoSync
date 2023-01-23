import React, {useState, useEffect} from 'react';
import { useSearchParams} from "react-router-dom";
import ReactPlayer from 'react-player';
import { io } from "socket.io-client";
import { ConnectionSideMenu } from './Components/ConnectionSideMenu';
import './App.css';

const wsServerURL = "ws://localhost:8080";
const baseClientURL = "http://localhost:3000/?r=";
let copyURL = baseClientURL;
let socket = "";
let type = "pub";
let uName = "";
let room = "";
let vidControll = "";
let seekTime = 0;
let seekCycle = 0;

function App() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [videoURL, setVideoURL] = useState("");
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
        []
    );

    // Friend sends pubRoomID via msg and this client get put in that room.
    function connectSubscriber(pubRoomID) {
        console.log("connecting subscriber");
        socket = io(wsServerURL, {
            extraHeaders: {
            type: "sub",
            roomID: pubRoomID
            }
        });
        socket.on(pubRoomID, (args) => {
            if (args === "Room does not exist") {
                console.log("Could not connect to servers");
                disconnect();             
            }
            else {
                uName = args.username;
                type = "sub";
                console.log(uName," connected to room ", room, " as ", type);
                socket.on("VTL", (args) => {
                    seekTime = Math.floor(args.time);
                    console.log(seekTime);
                });
                socket.on("Admin", (args) => {
                    console.log(args);
                    if(args.type === "pub")
                        type = "pub";
                });
            }
        });
    }

    // Connect to server and get username, and roomID, then go to my own room
    const connectPublisher = () => {
        socket = io(wsServerURL, {
            extraHeaders: {
                type: type
            }
        });
        socket.on("Main", (args) => {
            uName = args.username;
            room = args.roomID;
            copyURL += room;
            console.log(uName," connected to room ", room, " as ", type);
        });
     
    }

    const disconnect = () => {
        console.log(socket.connected + " Disconnecting");
        if (socket.connected) {
            socket.on("disconnect", () => {
                console.log("Disconnected");
            }); 
        }
    }

    function onProgress(event) {
        if (type === "sub" && seekCycle === 0) {
            const currTime = Math.floor(event.playedSeconds);
            if (Math.abs(currTime-seekTime) > 1)
                vidControll.seekTo(seekTime);
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

    function handleChangeURL(event)  { setVideoURL(global.URL.createObjectURL(event.target.files[0])); }
    function ref(p) { vidControll = p; }
    function copyURLf() { navigator.clipboard.writeText(copyURL); }

    return (
    <>
        <ConnectionSideMenu con={connectPublisher}  disc={disconnect} r={room} chURL={handleChangeURL} copyURL={copyURLf} />

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