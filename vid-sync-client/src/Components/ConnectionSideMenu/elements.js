import styled from "styled-components";



export const Wrapper = styled.div`

`;

export const Container = styled.div`
    width:100%;
    height:100%;
    margin:auto;
`;

export const ContainerInner = styled.div`
    margin-top:50px;
    margin:auto;
    width:300px;
`;

export const Btn = styled.button`
    // width:100%;
    display:block;
`;

export const Horizontal = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
`;

export const Icon = styled.div`
    // font-size: 24px;
    // cursor: pointer;
`;

export const ChatContainer = styled.div`
    width:100%;
    height:68%;
    margin:auto;
    background-color: #c5c7c9;
`;

export const SelVidIcon = styled.div`
    font-size: 35px;
    cursor: pointer;
`;

export const MsgBox = styled.div`
    height: 90%;
    overflow:scroll;
    border:1px solid black;
    background-color: white;
    margin:auto;
`;

export const MsgInputWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-item: center; 
    border:1px solid blue;
    height:10%;
`;

export const MsgInput = styled.input`
    width : 80%;
`;

export const MsgSendButton = styled.button`
    width 20%;
`;