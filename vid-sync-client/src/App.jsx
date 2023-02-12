import React, {useState, useEffect} from 'react';
import { useSearchParams} from "react-router-dom";
import ReactPlayer from 'react-player';
import { io } from "socket.io-client";
import { ConnectionSideMenu } from './Components/ConnectionSideMenu';
import './App.css';

const wsServerURL = "ws://localhost:8080";
const baseClientURL = "http://127.0.0.1:4200/?r=";
let copyURL = baseClientURL;
let socket = {};
let type = "pub";
let uName = "";
let room = "";
let vidControl = "";
let seekTime = 0;
let seekCycle = 0;
let connected = false;

function App() {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlParam = searchParams.get("r");
    // const [videoURL, setVideoURL] = useState("");
    // const [playVid, setPlayVid] = useState(true);
    // const [otherRoomMembers, setORMs] = useState("");
    const [messages, setMessages] = useState([]);
    const [sock, setSock] = useState('');


    useEffect(
        () => {
            if (urlParam && urlParam.length > 10) {
                room = urlParam
                connectSubscriber(urlParam);
                console.log(room);
            }
        },
        []
    );

    useEffect( 
        () => {
            console.log("MSG useEffect");
            if (connected) {
                console.log("socket is connected");
                socket.on("CH1", (args) => setMessages([...messages, args]));
                    // else if (args.type === "seekTime")
                    //     seekTime = Math.floor(args.time);
                    // else if (args.type === "play")
                    //     setPlayVid(true);
                    // else if (args.type === "pause")
                    //     setPlayVid(false); 
                    // else if (args.type === "usersupdate")
                    //     setORMs(args.msg); 
                    // else if (args.type === "pub") 
                    //     type = "pub";

                return () => { socket.off("CH1"); };
            }
        },[socket,messages]
    );

    const connectPublisher = () => {
        console.log("connecting Pub");
        socket = io(wsServerURL, {
            extraHeaders: {
                type: type
            }
        });
        connected = true;
        socket.on("Main", (args) => {
            uName = args.username;
            room = args.roomID;
            copyURL += room;
            console.log(uName," connected to room ", room, " as ", type);
        });
        setSock(socket);
    }

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
            }
            else {
                uName = args.username;
                type = "sub";
                console.log(uName," connected to room ", room, " as ", type);
                connected = true;
                setSock(socket);
            }
        });
    }

    // const startListeningForEvents = (socket) => {
    //     socket.on("CH1", (args) => {
    //         console.log(args.type);
    //         if (args.type === "seekTime")
    //             seekTime = Math.floor(args.time);
    //         else if (args.type === "play")
    //             setPlayVid(true);
    //         else if (args.type === "pause")
    //             setPlayVid(false); 
    //         else if (args.type === "usersupdate")
    //             setORMs(args.msg); 
    //         else if (args.type === "pub") 
    //             type = "pub";                        
    //     });
    // }

    function onProgress(event) {
        if (type === "sub") {
            seekCycle--;
            if (seekCycle === 0) {
                const currTime = Math.floor(event.playedSeconds);
                if (Math.abs(currTime-seekTime) > 1)
                    vidControl.seekTo(seekTime);
                seekCycle = 5;
            }
        }
        else if (type === "pub" && socket.connected)
            socket.emit("CH0", {type:"seekTime",time:event.playedSeconds});      
    }

    function playPause(event) {
        if (typeof event != "undefined" && event.type === "pause") {
            console.log("pause event emitted");
            socket.emit("CH0", { type: "pause" });
            setPlayVid(false);
        } else {
            console.log("play event emitted");
            socket.emit("CH0", { type: "play"});
            setPlayVid(true);
        }
    }

    function handleChangeURL(event)  { setVideoURL(global.URL.createObjectURL(event.target.files[0])); }
    function ref(p) { vidControl = p; }
    function copyURLf() { navigator.clipboard.writeText(copyURL); }

    return (
        <>
            <ConnectionSideMenu socket={sock} messages={messages} con={connectPublisher} r={room} chURL={handleChangeURL} copyURL={copyURLf}/>

            <div className={"vidWrapper"}>
                <div className={"vidContainer"}>
                    <div>
                        {/* <ReactPlayer ref={ref} url={videoURL} playing={playVid} className="react-player" controls width="100%" height="100%" onProgress={onProgress} onPause={playPause} onPlay={playPause}/> */}
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default App;
