import React, {useState, useRef} from 'react';
import {Container, Wrapper, Btn, ContainerInner, Horizontal,Icon, ChatContainer, SelVidIcon, MsgBox, MsgInputWrapper, MsgInput, MsgSendButton } from './elements';
import { FaBars, FaUsers, FaLink, FaUserAlt, FaFileVideo } from "react-icons/fa";
import {AiOutlineDisconnect} from "react-icons/ai";
import alien from "../../Pictures/alien.png"
export const ConnectionSideMenu = (props) => {
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const inputFile = useRef(null);
    const sidebarClass = sidebarOpen ? "sidebar open" : "sidebar";
    const sidebarInnerClass = sidebarOpen ? "sidebarInner open" : "sidebarInner";
    const [info, setInfo] = useState("");

    function a() {setInfo(props.displayMembers)}
    function b() {setInfo(props.displayMyInfo)}
    const handleViewSidebar = (props) => { setSideBarOpen(!sidebarOpen); };
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
                            {info}
                            {/* make the below into a separate component */}
                            {/* <article className={"msg-container msg-self"} id={"msg-0"}>
                                <div className={"msg-box"}>
                                    <div className={"flr"}>
                                        <div className={"messages"}>
                                            <p className={"msg"} id={"msg-1"}> {props.chat} </p>
                                        </div>
                                        <span className={"timestamp"}><span className={"username"}>Name</span>&bull;<span className={"posttime"}>Now</span></span>
                                    </div>
                                    <img className={"user-img"} id={"user-0"} src={alien} />
                                </div>
			                </article> */}
                        </MsgBox>
                        <MsgInputWrapper className={sidebarInnerClass}>
                            <MsgInput  className={"msgInput"}   
                                type="text"
                                id="message"
                                name="message"
                                placeholder="Type a message"
                                onChange={props.handleMsgInput}
                                >
                            </MsgInput>
                            <MsgSendButton className={"sendMsgBtn"} onClick={props.sendMsg}>
                                <svg style={{"width":"24px","height":"24px"}} viewBox="0 0 24 24"><path fill="rgba(0,0,0,.38)" d="M17,12L12,17V14H8V10H12V7L17,12M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L5,8.09V15.91L12,19.85L19,15.91V8.09L12,4.15Z" /></svg>
                            </MsgSendButton>
                        </MsgInputWrapper>
                    </ChatContainer>
                    <div className={sidebarInnerClass}>
                        <div id="disconnectBtnWrapper">
                            <Btn className={"disconnectBtn"} onClick={()=>{props.disc()}}><AiOutlineDisconnect style={{"fontSize":"25px"}}></AiOutlineDisconnect></Btn>
                        </div>
                    </div>
                </Container>
            </Wrapper>
        </>
    );
}