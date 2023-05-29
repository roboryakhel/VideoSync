import React, { useState, useRef, useEffect } from "react";
import {
  ChatContainer,
  MsgBox,
  MsgInputWrapper,
  MsgInput,
  MsgSendButton,
} from "../ConnectionSideMenu/elements";
import { MessageBox } from "./msgBox";
import { socket } from "../Socket";

let msgList = [];

export const ChatBox = (props) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const [msg, setMsgs] = useState(0);
  const messageRef = useRef();

  useEffect(() => {
    if (props.connected) {
      chatListener();
    }
  }, [props.connected]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [message]);


  const chatListener = () => {
    socket.on("CHAT-C", (args) => {
      msgList = [...msgList, args];
      setMessages(msgList);
      // messages = [...messages, args];
      // setMsgs(0);
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (socket.connected && message.trim()) {
      socket.emit("CHAT-S", {
        text: message,
        // name: localStorage.getItem('userName'), // Store uName only when client runs in prod. Don't use this for dev or testing
        name: props.name,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id
      });
      setMessage("");
    }
  };

  return (
    <>
      <ChatContainer>
        <MsgBox>
          {messages.map((message) => {
            return (
              <MessageBox
                name={props.name}
                bName={message.name}
                key={message.id}
                msgTxt={message.text}
              />
            );
          })}
          <div ref={messageRef}>
            <br />
            <br />
            <br />
          </div>
        </MsgBox>
        <MsgInputWrapper onSubmit={handleSendMessage}>
          <MsgInput
            className={"msgInput"}
            type="text"
            id="message"
            name="message"
            value={message}
            placeholder="Type a message"
            onChange={(e) => setMessage(e.target.value)}
          ></MsgInput>
          <MsgSendButton className={"sendMsgBtn"} type="submit">
            <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
              <path
                fill="rgba(0,0,0,.38)"
                d="M17,12L12,17V14H8V10H12V7L17,12M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L5,8.09V15.91L12,19.85L19,15.91V8.09L12,4.15Z"
              />
            </svg>
          </MsgSendButton>
        </MsgInputWrapper>
      </ChatContainer>
    </>
  );
};
