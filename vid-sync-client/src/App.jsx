window.global ||= window;

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
let seekCycle = 0;
let connected = false;


function App() {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlParam = searchParams.get("r");
    const [videoURL, setVideoURL] = useState("");
    const [playVid, setPlayVid] = useState(true);
    const [otherRoomMembers, setORMs] = useState("");
    const [messages, setMessages] = useState([]);
    const [sock, setSock] = useState('Sock');
    const [seekTime, setSeekTime] = useState(0);
    // The below is a function which when called force updates the state. IDK how it works. Don't touch it.
    const [userName, setUname] = useState("Name");
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);


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
                socket.on('CHAT-C', (args) => setMessages([...messages, args]));
                return () => { socket.off('CHT-C'); };
            }
        },[socket,messages]
    );

    useEffect( 
        () => {
            console.log("Play/Pause useEffect");
            if (connected) {
                socket.on('VC-C', (args) => {    
                    if (args.type === "play")
                        setPlayVid(true);
                    else if (args.type === "pause")
                        setPlayVid(false); 
                });
                return () => { socket.off('VC-C'); };
            }
        },[socket,playVid]
    );

    useEffect( 
        () => {
            console.log("New members useEffect");
            if (connected) {
                socket.on('MEMS-C', (args) => {setORMs([...otherRoomMembers, args])});
                return () => { socket.off('MEMS-C'); };
            }
        },[socket,otherRoomMembers]
    );

    useEffect( 
        () => {
            console.log("New seektime useEffect");
            if (connected && type === "sub") {
                socket.on('PGT-C', (args) => {setSeekTime(Math.floor(args.time));})
                return () => { socket.off('PGT-C'); };
            }
        },[socket,seekTime]
    );

    useEffect( 
        () => {
            console.log("Setting Socket useEffect");
            if (connected)
                setSock(socket);
        },[socket, sock, connected]
    );

    useEffect( 
        () => {
            console.log("Setting uName useEffect");
            if (connected)
                setUname(uName);
        },[socket, userName]
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
            // localStorage.setItem('userName', uName); // Store uName only when client runs in prod. Don't use this for dev or testing
            room = args.roomID;
            copyURL += room;
            console.log(uName," connected to room ", room, " as ", type);
            forceUpdate();
        });
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
                // localStorage.setItem('userName', uName); // Store uName only when client runs in prod. Don't use this for dev or testing
                type = "sub";
                console.log(uName," connected to room ", room, " as ", type);
                connected = true;
                listenPubChange(socket);
                forceUpdate();
            }
        });
    }

    const listenPubChange = (socket) => {
        socket.on('PUBCH-C', (args) => {type = "pub"});
    }

    function onProgress(event) {
        if (type === "sub") {
            if (seekCycle === 0) {
                const currTime = Math.floor(event.playedSeconds);
                if (Math.abs(currTime-seekTime) > 1)
                    vidControl.seekTo(seekTime);
                seekCycle = 6;
            }
            seekCycle--;
        }
        else if (type === "pub" && connected)
            socket.emit('PGT-S', {time:event.playedSeconds});      
    }

    function playPause(event) {
        if (typeof event != "undefined" && event.type === "pause") {
            socket.emit('VC-S', { type: "pause" });
        } else {
            socket.emit('VC-S', { type: "play"});
        }
    }

    function handleChangeURL(event)  { setVideoURL(global.URL.createObjectURL(event.target.files[0])); }
    function ref(p) { vidControl = p; }
    function copyURLf() { navigator.clipboard.writeText(copyURL); }

    return (
        <>
            <ConnectionSideMenu name={userName} socket={sock} messages={messages} con={connectPublisher} r={room} chURL={handleChangeURL} copyURL={copyURLf} displayMembers={otherRoomMembers}/>

            <div className={"vidWrapper"}>
                <div className={"vidContainer"}>
                    <div>
                        <ReactPlayer ref={ref} url={videoURL} playing={playVid} className="react-player" controls width="100%" height="100%" onProgress={onProgress} onPause={playPause} onPlay={playPause}/>
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default App;
