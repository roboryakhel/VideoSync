import React from 'react';
import {Container, Wrapper, RoomIDInp, ConnectBtn, Name, Type, RoomMembers, PickMovie} from './HomeElements';
import { io } from "socket.io-client";

const URL = "ws://localhost:3001";

let type ="";                           // pub or sub
let username = "";                      // Server will give client randomly generated user name
let roomID = "";                        // Servier will give a n digit identifier for your room


// Connect to Main room and get username, and roomID, then go to my own room
const connectPublisher = () =>{
        const socket = io(URL, {
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
}

// Friend sends pubRoomID via msg and this client get put in that room.
const connectSubscriber = (pubRoomID) => {
        const socket = io(URL, {
                extraHeaders: {
                  type: "sub",
                  roomID: pubRoomID
                }
              });
        socket.on(pubRoomID, (args) => {
                console.log(args);
                username = args.username
                roomID = args.roomID;
                type = args.type;
                console.log(username," connected to room ", roomID, " as ", type);
        });
}



// Connect to client room and send init msg
function putPubinTheirRoom(socket) {
        socket.on(roomID, (args) => {
                if (args.text == "Success")
                        console.log("You are now in room: ", roomID, ", ", username);
        });
}



export function Home() {
  return (
   <>
    <Wrapper>
        <Container>
            <RoomIDInp></RoomIDInp>
            <ConnectBtn>Connect</ConnectBtn>
            <Name>Name:</Name>
            <Type>Type:</Type>
            <RoomMembers></RoomMembers>
            <PickMovie></PickMovie>
        </Container>
    </Wrapper>
   </>
  );
};
