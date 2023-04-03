import styled from "styled-components";



export const Wrapper = styled.div`

`;

export const Container = styled.div`
    width:100%;
    height:100%;
    margin:auto;
`;

export const Horizontal = styled.div`
    display:flex;
    flex-wrap:wrap; 
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
`;

export const ContainerInner = styled.div`
    margin:auto;
    width:300px;
`;

export const Btn = styled.button`
    // width:100%;
    display:block;
`;


export const Icon = styled.div`
    font-size: 18px;
    cursor: pointer;
    color:#B6EADA;

`;

export const SelVidIcon = styled.div`
    font-size: 35px;
    cursor: pointer;
`;

export const ChatContainer = styled.div`
    width:100%;
    height:100%;
    margin:auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    // box-shadow: 0 0 4px rgba(0,0,0,.14),0 4px 8px rgba(0,0,0,.28);
`;


export const MsgBox = styled.div`
    width:100%;
    flex: auto;
    max-height: calc(100% - 60px);
    background: #2f323b;
    overflow: auto;
`;

export const MsgInputWrapper = styled.form`
    flex: 0 0 auto;
    height: 60px;
    background: #40434e;
    border-top: 1px solid #fff;
`;

export const MsgInput = styled.input`
line-height: 60px;
    outline: 0 none;
    border: none;
    width: calc(100% - 60px);
    color: white;
    text-indent: 10px;
    font-size: 12pt;
    padding: 0;
    background: #40434e;
`;

export const MsgSendButton = styled.button`
    float: right;
    outline: 0 none;
    border: none;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    padding: 2px 0 0 0;
    margin: 10px;
    transition: all 0.15s ease-in-out;
`;