import { io } from "socket.io-client";

const URL = "ws://localhost:3000";

let type = ""                           // pub or sub
let username = "";
let roomID = "";

const socket = io(URL);

// Connect to Main room and get username, and roomID
socket.on("Main", (args) => {
        console.log(args);
        username = args.username
        roomID = args.roomID;
        type = args.type;
        here();
});

const connectListenner = (pubRoomID) => {
        socket.on(pubRoomID, (args) => {
                console.log(args);
                username = args.username
                roomID = args.roomID;
                type = args.type;
        })
}



// Connect to client room and send init msg
function here() {
        socket.on(roomID, (args) => {
                console.log(args);
        });
}

