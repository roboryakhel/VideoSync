import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Wrapper,
  Btn,
  ContainerInner,
  Horizontal,
  Icon,
} from "./elements";
import { FaBars, FaUsers, FaLink, FaUserAlt } from "react-icons/fa";
import AlertBox from "../Alerts";
import { ChatBox } from "../Chat";
import {
  socket,
  getSocketDataAndActivate,
  setSocketRID,
  setSockType,
  setSocket,
} from "../Socket";
import { Button } from "../Button";
import { VideoSelector } from "../VideoSelector";

// const wsServerURL = "https://watchparty.herokuapp.com";
// const baseClientURL = "https://watch-partyso.netlify.app/?r=";
//Dev server
const wsServerURL = "http://localhost:8080";
const baseClientURL = "http://127.0.0.1:4200/?r=";

let name = "";
let roomID = "";
let copyURL = "";

export const ConnectionSideMenu = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlParam = searchParams.get("r");
  const [connStatus, setConnStatus] = useState(false);
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const sidebarClass = sidebarOpen ? "sidebar open" : "sidebar";
  const sidebarInnerClass = sidebarOpen ? "sidebarInner open" : "sidebarInner";
  const [toggle, setToggle] = useState(false);
  const [info, setInfo] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(urlParam)) {
      console.log("urlParam is : " + urlParam);
      connectSocket("sub");
      props.handleType("sub");
    }
  }, []);

  useEffect(() => {
    if (connStatus) {
      console.log("Setting Socket useEffect");
      setInfo("Name: " + name + " type: " + " room: " + roomID);
      setAlertType("success");
      setToggle(true);
    }
  }, [connStatus]);

  useEffect(() => {
    setToggle(true);
  }, [info]);

  useEffect(() => {}, [toggle]);

  const connectSocket = async (t) => {
    if (t === "sub") {
      setSocketRID(urlParam);
      setSockType("sub");
      let socket = io(wsServerURL, {
        extraHeaders: {
          type: "sub",
          roomid: urlParam,
          uid: "0",
        },
      });
      setSocket(socket);
    } else socket.connect();
    let userData = await getSocketDataAndActivate();
    if (!userData) {
      console.log("could not connect to server");
      return 0;
    }
    name = userData.name;
    roomID = userData.roomID;
    copyURL = baseClientURL + roomID;
    setConnStatus(true);
    props.vURLListener();
    props.newMemListener();
    props.pubCListener();
  };

  function copyURLf() {
    navigator.clipboard.writeText(copyURL);
  }

  function alertInfo(arg) {
    if (arg === "me") {
      setInfo("You are " + name + " and you are in room: " + roomID);
    } else if (arg === "others") {
      // change below to other members
      setInfo("You are " + name + " and you are in room: " + roomID);
    }
  }

  function handleToggle() {
    setToggle(false);
    console.log(toggle);
  }
 
  function handleDisconnect() {
    if (connStatus) {
      socket.disconnect();
      setConnStatus(false);
      setAlertType("error");
      setToggle(true);
      window.location.reload();
    }
  }

  return (
    <Wrapper className={sidebarClass}>
        <Container>
          <Horizontal className={"openCloseBar"}>
            <Icon
              onClick={() => {
                setSideBarOpen(!sidebarOpen);
              }}
            >
              <FaBars
                style={{ color: "#FFFBEB" }}
                className={"FaBars"}
              ></FaBars>
            </Icon>
            <Icon className={sidebarInnerClass}>
              <FaLink className="top-bar-icon" onClick={copyURLf}></FaLink>
            </Icon>
            <Icon className={sidebarInnerClass}>
              <FaUsers
                className="top-bar-icon"
                onClick={() => {
                  alertInfo("me");
                }}
              ></FaUsers>
            </Icon>
            <Icon className={sidebarInnerClass}>
              <FaUserAlt
                className="top-bar-icon"
                onClick={() => {
                  alertInfo("others");
                }}
              ></FaUserAlt>
            </Icon>
          </Horizontal>
          <ContainerInner className={sidebarInnerClass}>
            <Horizontal className={"startBar"}>
              <Btn
                className={"button-strt button- startPty"}
                onClick={() => {
                  connectSocket();
                }}
              >
                Start a Party
              </Btn>
              <VideoSelector
                handleLocalURL={props.localURL}
                handleRemoteURL={props.remoteURL}
              />
            </Horizontal>
          </ContainerInner>
          <div id="chat-wrapper" className={sidebarInnerClass}>
            <ChatBox name={name} connected={connStatus} />
          </div>
          <AlertBox
            type={alertType}
            toggle={toggle}
            info={info}
            handleToggle={handleToggle}
          />
          <div className={sidebarInnerClass}>
            <Button
              handleDisconnect={handleDisconnect}
              connected={connStatus}
            />
          </div>
        </Container>
      </Wrapper>
  );
};
