import React, {useState, useRef} from 'react';
import {Container, Wrapper, Btn, ContainerInner, Horizontal,Icon, ChatContainer, SelVidIcon, MsgBox, MsgInputWrapper, MsgInput, MsgSendButton } from './elements';
import { FaBars, FaUsers, FaLink, FaUserAlt, FaFileVideo } from "react-icons/fa";
import {AiOutlineDisconnect} from "react-icons/ai";
import { MessageBox } from '../MessageBox'; 

export const ConnectionSideMenu = (props) => {
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const inputFile = useRef(null);
    const sidebarClass = sidebarOpen ? "sidebar open" : "sidebar";
    const sidebarInnerClass = sidebarOpen ? "sidebarInner open" : "sidebarInner";
    const [info, setInfo] = useState("");
    const [message, setMessage] = useState('');


    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            props.socket.emit('CHAT-S', {
                text: message,
                // name: localStorage.getItem('userName'), // Store uName only when client runs in prod. Don't use this for dev or testing
                name : props.name,
                id: `${props.socket.id}${Math.random()}`,
                socketID: props.socket.id
          });
        }
        setMessage('');
    }

    const disconnect = () => {
        if (socket.connected)
            socket.disconnect();
    }

    const displayMembers = () => { return otherRoomMembers; }
    const displayMyInfo = () => {
        const t = (type === "pub") ? "Host" : "Guest";
        const info = "You are " + uName + ". " + t + " in room: " + room;
        return info;
    }
    function a() {setInfo(props.displayMembers)}
    function b() {setInfo(props.displayMyInfo)}
    const handleViewSidebar = () => { setSideBarOpen(!sidebarOpen); };
    const selectMovie = () => { inputFile.current.click(); };

    return (
        <>
            <Wrapper className={sidebarClass}>
                <Container>
                    <Horizontal className={"openCloseBar"}>
                        <Icon onClick={handleViewSidebar}><FaBars style={{"color":"#FFFBEB"}} className={"FaBars"}></FaBars></Icon>
                        <Icon className={sidebarInnerClass}><FaLink style={{"color":"#FFFBEB"}} onClick={props.copyURL}></FaLink></Icon>
                        <Icon className={sidebarInnerClass}><FaUsers style={{"color":"#FFFBEB"}} onClick={a}></FaUsers></Icon>
                        <Icon className={sidebarInnerClass}><FaUserAlt style={{"color":"#FFFBEB"}} onClick={b}></FaUserAlt></Icon>
                    </Horizontal>
                    <ContainerInner className={sidebarInnerClass} >
                        <Horizontal className={"startBar"}>
                            <Btn className={"button-strt button- startPty"} onClick={()=>{props.con()}}>Start a Party</Btn>
                            <SelVidIcon><FaFileVideo style={{"color":"#00FFF6"}} onClick={()=>{selectMovie()}}></FaFileVideo></SelVidIcon>
                            <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={props.chURL}/>
                        </Horizontal>
                    </ContainerInner>
                    <ChatContainer >
                        <MsgBox className={sidebarInnerClass}>
                            {props.messages.map(message => {
                                return ( 
                                     <MessageBox name={props.name} bName={message.name} key={message.id} msgTxt={message.text} /> 
                                );
                            })}                        
                        </MsgBox>
                        <MsgInputWrapper className={sidebarInnerClass}>
                            <MsgInput  className={"msgInput"}   
                                type="text"
                                id="message"
                                name="message"
                                value={props.inpVal}
                                placeholder="Type a message"
                                onChange={(e) => setMessage(e.target.value)}
                                >
                            </MsgInput>
                            <MsgSendButton className={"sendMsgBtn"} onClick={handleSendMessage}>
                                <svg style={{"width":"24px","height":"24px"}} viewBox="0 0 24 24"><path fill="rgba(0,0,0,.38)" d="M17,12L12,17V14H8V10H12V7L17,12M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L5,8.09V15.91L12,19.85L19,15.91V8.09L12,4.15Z" /></svg>
                            </MsgSendButton>
                        </MsgInputWrapper>
                    </ChatContainer>
                    <div className={sidebarInnerClass}>
                        <div id="disconnectBtnWrapper">
                            <Btn className={"disconnectBtn"} onClick={disconnect}><AiOutlineDisconnect style={{"fontSize":"25px"}}></AiOutlineDisconnect></Btn>
                        </div>
                    </div>
                </Container>
            </Wrapper>
        </>
    );
}