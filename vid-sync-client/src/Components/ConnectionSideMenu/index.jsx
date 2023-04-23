import React, {useState, useRef, useEffect} from 'react';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import {Container, Wrapper, Btn, ContainerInner, Horizontal,Icon, ChatContainer, SelVidIcon, MsgBox, MsgInputWrapper, MsgInput, MsgSendButton } from './elements';
import { FaBars, FaUsers, FaLink, FaUserAlt, FaFileVideo, FaPlay } from "react-icons/fa";
import {AiOutlineDisconnect} from "react-icons/ai";
import { MessageBox } from '../MessageBox'; 

let info = "";

export const ConnectionSideMenu = (props) => {
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const inputFile = useRef(null);
    const sidebarClass = sidebarOpen ? "sidebar open" : "sidebar";
    const sidebarInnerClass = sidebarOpen ? "sidebarInner open" : "sidebarInner";
    const [message, setMessage] = useState('');
    const [toggle, setToggle] = useState(false);
    const [info, setInfo] = useState("Info");
    const [videoLink, setVideoLink] = useState('');

    const messageRef = useRef();

    useEffect(() => {
        if (messageRef.current) {
          messageRef.current.scrollIntoView(
            {
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest'
            })
        }
      },
      [message])

    const handleSendMessage = (e) => {
        e.preventDefault();
        if(props.socket.connected && message.trim()) {
                props.socket.emit('CHAT-S', {
                    text: message,
                    // name: localStorage.getItem('userName'), // Store uName only when client runs in prod. Don't use this for dev or testing
                    name : props.name,
                    id: `${props.socket.id}${Math.random()}`,
                    socketID: props.socket.id
              });
            setMessage('');
        }
    }

    const disconnect = () => {
        props.disc();
    }

    const handleViewSidebar = () => { setSideBarOpen(!sidebarOpen); };
    const selectMovie = () => { inputFile.current.click(); };
    const selectMovie2 = () => { props.chURL2(videoLink); };

    return (
        <>
            <Wrapper  className={sidebarClass} >
                <Container>
                    <Horizontal className={"openCloseBar"}>
                        <Icon onClick={handleViewSidebar}><FaBars style={{"color":"#FFFBEB"}} className={"FaBars"}></FaBars></Icon>
                        <Icon className={sidebarInnerClass}><FaLink className="top-bar-icon" onClick={props.copyURL}></FaLink></Icon>
                        <Icon className={sidebarInnerClass}><FaUsers className="top-bar-icon" onClick={() => {setInfo(props.membersData);setToggle(true)}}></FaUsers></Icon>
                        <Icon className={sidebarInnerClass}><FaUserAlt className="top-bar-icon" onClick={() => {setInfo(props.myData);setToggle(true)}}></FaUserAlt></Icon>
                    </Horizontal>
                    <ContainerInner className={sidebarInnerClass} >
                        <Horizontal className={"startBar"}>
                            <Btn className={"button-strt button- startPty"} onClick={()=>{props.con()}}>Start a Party</Btn>
                            <SelVidIcon><FaFileVideo style={{"color":"#00FFF6"}} onClick={()=>{selectMovie()}}></FaFileVideo></SelVidIcon>
                            <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={props.chURL}/>
                            <div className={"break"}></div> 
                            <div className={"video-link-wrapper"}>
                                <input  className={"remote-vl-input"}
                                type="text"
                                // id="message"
                                // name="message"
                                // value={videoLink}
                                placeholder="Paste video link here..."
                                onChange={(e) => setVideoLink(e.target.value)}
                                >
                                </input>
                                <div className='video-link-play' onClick={()=>{selectMovie2()}}><FaPlay style={{"padding": "0px 10px 0px 30px" ,"color": "#fff"}} /></div>
                            </div>
                        </Horizontal>
                    </ContainerInner>
                    <div id="chat-wrapper" className={sidebarInnerClass}>
                        <ChatContainer  >
                            <MsgBox >
                                {props.messages.map(message => {
                                    return ( 
                                        <MessageBox name={props.name} bName={message.name} key={message.id} msgTxt={message.text} /> 
                                    );
                                })}               
                                <div ref={messageRef}>
                                    <br/>
                                    <br/>
                                    <br/>
                                </div>         
                            </MsgBox>
                            <MsgInputWrapper  onSubmit={handleSendMessage}>
                                <MsgInput  className={"msgInput"}   
                                    type="text"
                                    id="message"
                                    name="message"
                                    value={message}
                                    placeholder="Type a message"
                                    onChange={(e) => setMessage(e.target.value)}
                                    >
                                </MsgInput>
                                <MsgSendButton className={"sendMsgBtn"} type="submit">
                                    <svg style={{"width":"24px","height":"24px"}} viewBox="0 0 24 24"><path fill="rgba(0,0,0,.38)" d="M17,12L12,17V14H8V10H12V7L17,12M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L5,8.09V15.91L12,19.85L19,15.91V8.09L12,4.15Z" /></svg>
                                </MsgSendButton>
                            </MsgInputWrapper>
                        </ChatContainer>
                    </div>

                    <div id="alerts-wrapper" className={sidebarInnerClass}>
                        <Collapse in={toggle}>
                            <Alert severity="info"
                            action={
                                <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setToggle(false);
                                }}
                                >
                                <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                            >
                                {info}
                            </Alert>
                        </Collapse>
                    </div>
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