import React, {useState} from 'react';
import {Container, Wrapper, RoomIDInp, ConnectBtn, Name, Type, RoomMembers, PickMovie} from './HomeElements';
import { io } from "socket.io-client";

const URL = "ws://localhost:8080";
let socket = "";

let type ="";                           // pub or sub
let username = "";                      // Server will give client randomly generated user name
let roomID = "";                        // Servier will give a n digit identifier for your room

export const Home = () => {
    const [uname, setUname] = useState("");
    const [room, setRoomID] = useState("0");

    const handleInput = (event) => {
        roomID = event.target.value;
        //console.log(roomIDisValid());
    }

    const roomIDisValid = () => {
        return (roomID !== "") && (roomID.length === 16) && (!isNaN(roomID));
    }

    const connect = () => {
        if (roomIDisValid()) 
            connectSubscriber(roomID);
        else  {
            console.log("Room ID invlid or No RoomID. Connecting is room host...");
            connectPublisher();
        } 
    }
    // Friend sends pubRoomID via msg and this client get put in that room.
    const connectSubscriber = (pubRoomID) => {
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
                username = args.username
                roomID = args.roomID;
                type = args.type;
                console.log(username," connected to room ", roomID, " as ", type);
            }
        });
    }
    
    // Connect to Main room and get username, and roomID, then go to my own room
    const connectPublisher = () => {
        socket = io(URL, {
            withCredentials: true,
            extraHeaders: {
                "type": "pub"
            }
        });
        console.log(socket.id, " connecting to Main room in server")
        socket.on("Main", (args) => {
            username = args.username
            roomID = args.roomID;
            type = args.type;
            console.log(username," connected to Main room ", roomID, " as ", type);
            putPubinTheirRoom(socket);
        });        
        setUname(username);
        setRoomID(roomID);
    }

    // Connect to client room and send init msg
    const putPubinTheirRoom = (socket) => {
        socket.on(roomID, (args) => {
            if (args.text === "Success")
                console.log("You are now in room: ", roomID, ", ", username);
        });
    }

    const sendTestMsg = () => {
        socket.emit('Video Time', {
            time: "34:12:00"
          });

          socket.on('VTL', (args) => {
            console.log(args);
          });
    }


    return (
        <>
            <Wrapper>
                <Container>
                    <RoomIDInp type="text" onChange={handleInput}></RoomIDInp>
                    <ConnectBtn onClick={connect}>Connect</ConnectBtn>
                    <Name>Name: {uname} </Name>
                    <Type>RoomID: {room} </Type>
                    <ConnectBtn onClick={sendTestMsg}>Send</ConnectBtn>
                    <RoomMembers></RoomMembers>
                    <PickMovie></PickMovie>
                </Container>
            </Wrapper>
        </>
    );
}