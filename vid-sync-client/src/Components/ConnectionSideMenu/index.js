import React, {useState, useRef} from 'react';
import {Container, Wrapper, Btn, ContainerInner, Horizontal,Icon, ChatContainer, SelVidIcon } from './elements';
import { FaBars, FaUsers, FaLink, FaUserAlt, FaFileVideo } from "react-icons/fa";

export const ConnectionSideMenu = (props) => {
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const inputFile = useRef(null);
    const sidebarClass = sidebarOpen ? "sidebar open" : "sidebar";
    const sidebarInnerClass = sidebarOpen ? "sidebarInner open" : "sidebarInner";

    const handleViewSidebar = (props) => {
        setSideBarOpen(!sidebarOpen);
    };

    const selectMovie = () => {
        inputFile.current.click();
    };

    return (
        <>
            <Wrapper className={sidebarClass}>
                <Container>
                    <Horizontal className={"openCloseBar"}>
                        <Icon className={"trigger"} onClick={handleViewSidebar}><FaBars></FaBars></Icon>
                        <Icon className={sidebarInnerClass}><FaLink onClick={props.copyURL}></FaLink></Icon>
                        <Icon className={sidebarInnerClass}><FaUsers></FaUsers></Icon>
                        <Icon className={sidebarInnerClass}><FaUserAlt></FaUserAlt></Icon>
                    </Horizontal>
                    <ContainerInner className={sidebarInnerClass} >
                        <Horizontal className={"startBar"}>
                            <Btn className={"button-23 startPty"} onClick={()=>{props.con()}}>Start a Party</Btn>
                            <SelVidIcon><FaFileVideo onClick={()=>{selectMovie()}}></FaFileVideo></SelVidIcon>
                            <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={props.chURL}/>
                        </Horizontal>
                    </ContainerInner>
                    <ChatContainer className={sidebarInnerClass}></ChatContainer>
                    <ContainerInner className={sidebarInnerClass} >
                        <Btn className={"button-24 disconn"} onClick={()=>{props.disc()}}>Disconnect</Btn>
                    </ContainerInner>
                </Container>
            </Wrapper>
        </>
    );
}