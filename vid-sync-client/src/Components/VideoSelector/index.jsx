import React, { useState, useRef } from "react";
import { SelVidIcon } from "../ConnectionSideMenu/elements";
import { FaFileVideo, FaPlay } from "react-icons/fa";

export const VideoSelector = (props) => {
  const inputFile = useRef(null);

  const [videoLink, setVideoLink] = useState("");

  function selectLocalVideo() {
    inputFile.current.click();
  }

  return (
    <>
      <SelVidIcon>
        <FaFileVideo
          style={{ color: "#00FFF6" }}
          onClick={() => {
            selectLocalVideo();
          }}
        ></FaFileVideo>
      </SelVidIcon>
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        onChange={(e) => props.handleLocalURL(e)}
      />
      <div className={"break"}></div>
      <div className={"video-link-wrapper"}>
        <input
          className={"remote-vl-input"}
          type="text"
          // id="message"
          // name="message"
          value={videoLink}
          placeholder="Paste video link here..."
          onChange={(e) => setVideoLink(e.target.value)}
        ></input>
        <div
          className="video-link-play"
          onClick={() => {
            props.handleRemoteURL(videoLink);
          }}
        >
          <FaPlay style={{ padding: "0px 10px 0px 30px", color: "#fff" }} />
        </div>
      </div>
    </>
  );
};
