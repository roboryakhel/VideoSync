import React, {useState, useRef} from 'react';
import {Container, Wrapper, Btn, ContainerInner, Horizontal,Icon, ChatContainer, SelVidIcon, MsgBox, MsgInputWrapper, MsgInput, MsgSendButton } from './elements';
import { FaBars, FaUsers, FaLink, FaUserAlt, FaFileVideo } from "react-icons/fa";
import { Socket } from 'socket.io-client';

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
                        <Icon onClick={handleViewSidebar}><FaBars className={"FaBars"}></FaBars></Icon>
                        <Icon className={sidebarInnerClass}><FaLink onClick={props.copyURL}></FaLink></Icon>
                        <Icon className={sidebarInnerClass}><FaUsers onClick={a}></FaUsers></Icon>
                        <Icon className={sidebarInnerClass}><FaUserAlt onClick={b}></FaUserAlt></Icon>
                    </Horizontal>
                    <ContainerInner className={sidebarInnerClass} >
                        <Horizontal className={"startBar"}>
                            <Btn className={"button-strt button- startPty"} onClick={()=>{props.con()}}>Start a Party</Btn>
                            <SelVidIcon><FaFileVideo onClick={()=>{selectMovie()}}></FaFileVideo></SelVidIcon>
                            <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={props.chURL}/>
                        </Horizontal>
                    </ContainerInner>
                    <ChatContainer className={sidebarInnerClass}>
                        <MsgBox>
                            {info}
                            {props.chat}
                        </MsgBox>
                        <MsgInputWrapper>
                            <MsgInput         
                                type="text"
                                id="message"
                                name="message"
                                onChange={props.handleMsgInput}
                                >
                            </MsgInput>
                            <MsgSendButton onClick={props.sendMsg}>Send</MsgSendButton>
                        </MsgInputWrapper>
                    </ChatContainer>
                    <Btn className={"button-disc button- disconnect"} onClick={()=>{props.disc()}}>Disconnect</Btn>
                </Container>
            </Wrapper>
        </>
    );
}