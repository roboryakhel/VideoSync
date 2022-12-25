import { io } from "socket.io-client";

const URL = "ws://localhost:3000";

let type ="";                           // pub or sub
let username = "";                      // Server will give client randomly generated user name
let roomID = "";                        // Servier will give a n digit identifier for your room
let flag = process.argv[2];             // For testing. Pre UI. Specify if this client is pub or sub



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



// Below is to use the client for testing
// 
if (flag === "p") {
        connectPublisher();
}
else if (flag === "s" && (process.argv[3])) {
        connectSubscriber(process.argv[3]);
}
else 
        console.log("Error with running the command",'\n',
        "Usage:",'\n',
        "for pub run as $ node client.js p",'\n',
        "for sub run as $ node client.js s 0000000000");
