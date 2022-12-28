import React, {useState} from 'react';
import {Container, Wrapper, RoomIDInp, ConnectBtn, Name, Type, RoomMembers, PickMovie} from './HomeElements';
import { io } from "socket.io-client";

const URL = "ws://localhost:8080";

let type ="";                           // pub or sub
let username = "";                      // Server will give client randomly generated user name
let roomID = "";                        // Servier will give a n digit identifier for your room

// class Client extends React.Component {

//     constructor() {
//         super();
//         this.state = {type: "pub", username: "", roomID: ""};
//     }



    // Friend sends pubRoomID via msg and this client get put in that room.
  const  connectSubscriber = (pubRoomID) => {
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
 function   putPubinTheirRoom(socket) {
            socket.on(roomID, (args) => {
                    if (args.text === "Success")
                            console.log("You are now in room: ", roomID, ", ", username);
            });
    }

    export const Home = () => {
        const [uname, setUname] = useState("");
        const [room, setRoomID] = useState("0");

        // Connect to Main room and get username, and roomID, then go to my own room
        const connectPublisher = () => {
            const socket = io(URL, {
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

        return (
            <>
             <Wrapper>
                 <Container>
                     <RoomIDInp></RoomIDInp>
                     <ConnectBtn onClick={connectPublisher}>Connect</ConnectBtn>
                     <Name>Name: {uname} </Name>
                     <Type>RoomID: {room} </Type>
                     <RoomMembers></RoomMembers>
                     <PickMovie></PickMovie>
                 </Container>
             </Wrapper>
            </>
           );
    }
//}

