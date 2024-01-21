window.global ||= window;
import React, { useState, useEffect } from "react";
import "@fontsource/concert-one"; 
import { ConnectionSideMenu } from "./Components/ConnectionSideMenu";
import { LandingPage } from "./Components/LandingPage";
import VideoPlayerManager from "./Components/VideoPlayer";
import { socket } from "./Components/Socket";
import "./App.css";

function App() {
  const [videoURL, setVideoURL] = useState("");
  const [type, setType] = useState("pub");

  useEffect(() => {
    console.log("Video URL CH UE: " + videoURL);
  }, [videoURL]);
  useEffect(() => {
    console.log("Type UE: " + type);
  }, [type]);

  function handleType(t) {
    setType(t);
  }
  function handleLocalURL(url) {
    setVideoURL(global.URL.createObjectURL(url.target.files[0]));
    const URL = url.target.files[0].name;
    socket.emit("OLVID-S", { url: URL });
  }

  function handleRemoteURL(url) {
    const p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) {
      setVideoURL(url);
      socket.emit("OLVID-S", { url: url });
    } else {
      // trigger alert for below
      console.log("Invalid remote url: " + url);
    }
  }

  const vidURLListener = () => {
    socket.on("OLVID-C", (args) => {
      const p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      if (args.url.match(p)) {
        setVideoURL(args.url);
      } else {
        // trigger alert for below
        console.log(
          "This is the local url or filename you need to select: " + args.url
        );
      }
    });
  };

  const listenPubChange = (socket) => {
    socket.on("PUBCH-C", (args) => {
      handleType("pub");
    });
  };

  const newRoomMemsListener = () => {
    socket.on("MEMS-C", (args) => {
      console.log("new member joined: " + args);
      socket.emit("OLVID-S", { url: videoURL });
    });
  };

  return (
    <>
      <LandingPage />
      <ConnectionSideMenu
        localURL={handleLocalURL}
        remoteURL={handleRemoteURL}
        handleType={handleType}
        vURLListener={vidURLListener}
        newMemListener={newRoomMemsListener}
        pubCListener={listenPubChange}
      />
      <VideoPlayerManager type={type} url={videoURL} />
    </>
  );
}

export default App;
