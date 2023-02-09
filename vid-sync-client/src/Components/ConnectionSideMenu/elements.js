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
    height:50%;
    margin:auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 0 4px rgba(0,0,0,.14),0 4px 8px rgba(0,0,0,.28);
`;


export const MsgBox = styled.div`
    // height: 90%;
    width:100%;
    // overflow:scroll;
    background-color: #E7F6F2;
    // margin:auto;
    flex: auto;
    max-height: calc(100% - 60px);
    background: #2f323b;
    overflow: auto;
}
`;

export const MsgInputWrapper = styled.div`
    // display: flex;
    // flex-direction: row;
    // justify-content: space-between;
    // align-item: center; 
    // margin:auto;
    // width:85%;
    // height:5%;
    flex: 0 0 auto;
    height: 60px;
    background: #40434e;
    border-top: 1px solid #2671ff;
    box-shadow: 0 0 4px rgba(0,0,0,.14),0 4px 8px rgba(0,0,0,.28);
`;

export const MsgInput = styled.input`
    // width : 80%;
    // border-bottom-left-radius: 8px;
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