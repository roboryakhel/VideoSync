import { resolve } from "path-browserify";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// const wsServerURL = "https://watchparty.herokuapp.com";
// const baseClientURL = "https://watch-partyso.netlify.app/?r=";
//Dev server
const wsServerURL = "http://localhost:8080";
const baseClientURL = "http://127.0.0.1:4200/?r=";

let roomID = "";
let uName = "";
let type = "pub";

export async function getSocketDataAndActivate() {
  await new Promise ((resolve) => {
    socket.on("CONN-STATUS", async (args) => {
      if (args.code === 0) {
        if (type === "pub") {
          await new Promise((resolve) => {
            socket.on("Main", (args) => {
              localStorage.setItem("pubID", args.pubID);
              roomID = args.roomID;
              uName = args.username;
              resolve(args);
            });
          });
        } else if (type === "sub"){
          await new Promise((resolve) => {
            socket.on(roomID, (args) => {
              localStorage.setItem("subID", args.subID);
              uName = args.username;
              resolve(args);
            });
          });
        }
        localStorage.setItem("userName", uName); // Store uName only when client runs in prod. Don't use this for dev or testing
        // activateListeners();
      } else if (args.code == 1) {
        raiseAlert("Could not connect to server. Try again.");
        return 0;
      }
      resolve(args);
    });
  })
  // socket.off("CONN_STATUS");
  // socket.off("Main")
  return {
    name: uName,
    roomID: roomID
  };
}

export const setSocketRID = (rID) => {
  roomID = rID;
};

export const setSockType = (t) => {
  type = t;
};

function getType() {
  return type;
}
function getRoomID() {
  return roomID;
}

export function setSocket(s) {
  socket = s;
}

export let socket = io(wsServerURL, {
  autoConnect: false,
  extraHeaders: {
    type: getType(),
    roomID: getRoomID(),
    uid: (localStorage.getItem(type + "ID") === null) ? "0" : localStorage.getItem(type + "ID")
  },
});

