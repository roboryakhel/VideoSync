import React, {useState, useRef} from 'react';
import {Container, Wrapper, RoomIDInp, Btn,Join, Text, ContainerInner } from './elements';

import { FaBars } from "react-icons/fa";


export const ConnectionSideMenu = (props) => {
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const inputFile = useRef(null);
    const sidebarClass = sidebarOpen ? "sidebar open" : "sidebar";
    const sidebarInnerClass = sidebarOpen ? "sidebarInner open" : "sidebarInner";

    const handleViewSidebar = () => {
        setSideBarOpen(!sidebarOpen);
    };

    const selectMovie = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };
    return (
        <>
            <Wrapper className={sidebarClass}>
                <Container>
                    <div id="trigger" className={"closebtn"} onClick={handleViewSidebar} >
                        <FaBars></FaBars>
                    </div>
                    <ContainerInner className={sidebarInnerClass} >
                        <Btn onClick={()=>{props.con("pub")}}>Start a Party</Btn>
                        <p> or </p>
                        <Join>
                            <RoomIDInp type="text" onChange={(e)=>{props.han(e)}}></RoomIDInp>
                            <Btn id="joinBtn" onClick={()=>{props.con("sub")}}>Join</Btn>
                        </Join>
                        <Text>RoomID: {props.r}</Text>
                        <Btn onClick={()=>{selectMovie()}} >Select Movie</Btn>
                        <input type='file' id='file' ref={inputFile} style={{display: 'none'}}/>
                    </ContainerInner>
                </Container>
            </Wrapper>
        </>
    );
}