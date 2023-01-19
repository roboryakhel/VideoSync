import React, {useState, useRef} from 'react';
import {Container, Wrapper, RoomIDInp, Btn,Join, Text, ContainerInner } from './elements';

import { FaBars } from "react-icons/fa";


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
                    <div id="trigger" className={"closebtn"} onClick={handleViewSidebar} >
                        <FaBars></FaBars>
                    </div>
                    <ContainerInner className={sidebarInnerClass} >
                        <Btn className={"button-23"} onClick={()=>{props.con("pub")}}>Start a Party</Btn>
                        <Btn className={"button-23"} onClick={props.copyURL} >Copy URL</Btn>
                        <Btn className={"button-23 selectBtn"} onClick={()=>{selectMovie()}} >Select Movie</Btn>
                        <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={props.chURL}/> 
                    </ContainerInner>
                </Container>
            </Wrapper>
        </>
    );
}