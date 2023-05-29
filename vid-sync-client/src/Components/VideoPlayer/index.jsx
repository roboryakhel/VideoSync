import React, { useState, useRef, useEffect } from "react";
import { socket } from "../Socket";
import ReactPlayer from "react-player";

let vidControl = "";
let seekCycle = 0;
let listening = false;
let seekTime = 0;

const VideoPlayerManager = (props) => {
  const [playVid, setPlayVid] = useState(false);
  // const [seekTime, setSeekTime] = useState(0);

  useEffect(() => {
    console.log("Play/Pause UE: " + playVid);
  }, [playVid]);
  // useEffect(() => {
  //   console.log("SeekTime UE: " + seekTime);
  // }, [seekTime]);

  const seekListener = () => {
    listening = true;
    console.log("Client is listening to seek times");
    if (props.type === "sub") {
      socket.on("PGT-C", (args) => {
        // setSeekTime(Math.round(args.time));
        seekTime = Math.round(args.time);
        console.log(seekTime);
      });
    }
  };

  const playPauseListener = () => {
    socket.on("VC-C", (args) => {
      if (args.type === "play") {
        setPlayVid(true);
      } else if (args.type === "pause") {
        setPlayVid(false);
      }
    });
  };

  function handleOnProgress(event) {
    if (props.type === "sub") {
      if (!listening) {
        seekListener();
        playPauseListener();
      }
      if (seekCycle === 0) {
        const currTime = Math.floor(event.playedSeconds);
        if (Math.abs(currTime - seekTime) > 1) vidControl.seekTo(seekTime);
        seekCycle = 6;
      }
      seekCycle--;
    } else if (props.type === "pub") {
      socket.emit("PGT-S", { time: event.playedSeconds });
    }
    // console.log(event + " emitted");
  }

  function handleOnPlay(event) {
    socket.emit("VC-S", { type: "play" });
    setPlayVid(true);
  }

  function handleOnPause(event) {
    socket.emit("VC-S", { type: "pause" });
    setPlayVid(false);
  }

  const ref = (p) => {
    vidControl = p;
  };

  return (
    <>
      <div className={"vidWrapper"}>
        <div className={"vidContainer"}>
          <ReactPlayer
            ref={ref}
            url={props.url}
            playing={playVid}
            className="react-player"
            controls
            width="100%"
            height="100%"
            onPause={handleOnPause}
            onPlay={handleOnPlay}
            onProgress={handleOnProgress}
          />
        </div>
      </div>
    </>
  );
};

export default VideoPlayerManager;
