import { io } from "socket.io-client";

const URL = "ws://localhost:3000";

let type = ""                           // pub or sub
let username = "";
let roomID = "";

const socket = io(URL);

let flag = process.argv[2];

if (flag == "p") {
        // Connect to Main room and get username, and roomID
        const connectPublisher = () =>{
                socket.on("Main", (args) => {
                        console.log(args);
                        username = args.username
                        roomID = args.roomID;
                        type = args.type;
                        putPubinTheirRoom();
                });
        }
}
else if (flag == "s") {
        // Friend sends pubRoomID via msg
        const connectListenner = (pubRoomID) => {
                socket.on(pubRoomID, (args) => {
                        console.log(args);
                        username = args.username
                        roomID = args.roomID;
                        type = args.type;
                })
        }
}
else 
        console.log("exit");




// Connect to client room and send init msg
function putPubinTheirRoom() {
        socket.on(roomID, (args) => {
                console.log(args);
        });
}

