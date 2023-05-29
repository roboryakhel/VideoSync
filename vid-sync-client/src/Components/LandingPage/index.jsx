import { Icon } from "@mui/material";
import React from "react";
import logo from "../../Pictures/WP_LOGO_3.png";

export const LandingPage = (props) => {
  return (
    <>
      <div className="full">
        <div className="full-inner">
          {/* <video autoPlay loop muted src={video} type="video/mp4" className="bg-video"></video> */}

          <div className="LP-area">
            <ul className="circles">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>

          <div className="lp-inner">
            <div className="lp-intro">
              <div>
                {/* <p className="title">Watch Party!</p> */}
                <div className="logo-wrapper">
                  <img className="logo-img" src={logo} />
                </div>
                <p className="desc">
                  A Tool that Synchronizes Videos Playing on Your Device With
                  Videos Playing on Your Friends Device
                </p>
                {/* <p>Simply choose a video you and your friends want to watch and play the video without any manual coordination.<br/>
                                All party members can control the video (pause/play/ffwd etc) and all actions are synchronized!</p> */}
              </div>
            </div>
            {props.type === "sub" ? (
              <div className="lp-steps sub">
                <div className="inst-step step1">
                  <Icon className="material-symbols-outlined">menu</Icon>
                  <hr className="inst-step-hr"></hr>
                  <p className="title">Step 1</p>
                  <p className="desc">Expand the SideBar and Start a Party</p>
                  <p className="small">
                    Follow the Arrows and Expand the SideBar Press the Button to
                    Start a Party
                  </p>
                </div>

                <div className="inst-step step3">
                  <Icon className="material-symbols-outlined">play_circle</Icon>
                  <hr className="inst-step-hr"></hr>
                  <p className="title">Step 2</p>
                  <p className="desc">Select a Video and Play</p>
                  <p className="small">
                    Click the camera icon to select a video Ensure the video is
                    downloaded on each of your friends devices.
                  </p>
                </div>
              </div>
            ) : (
              <div className="lp-steps pub">
                <div className="inst-step step1">
                  <Icon className="material-symbols-outlined">menu</Icon>
                  <hr className="inst-step-hr"></hr>
                  <p className="title">Step 1</p>
                  <p className="desc">Expand the SideBar and Start a Party</p>
                  <p className="small">
                    Follow the Arrows and Expand the SideBar Press the Button to
                    Start a Party
                  </p>
                </div>

                <div className="inst-step step2">
                  <Icon className="material-symbols-outlined">link</Icon>
                  <hr className="inst-step-hr"></hr>
                  <p className="title">Step 2</p>
                  <p className="desc">
                    Copy and Share the Link With Your Friend
                  </p>
                  <p className="small">
                    Click the chain icon to copy the room ID to clip board Send
                    the copied link to your friend
                  </p>
                </div>

                <div className="inst-step step3">
                  <Icon className="material-symbols-outlined">play_circle</Icon>
                  <hr className="inst-step-hr"></hr>
                  <p className="title">Step 3</p>
                  <p className="desc">Select a Video and Play</p>
                  <p className="small">
                    Click the camera icon to select a video Ensure the video is
                    downloaded on each of your friends devices.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
