import React, {useState, useRef} from 'react';
import alien from "../../Pictures/alien.png"


export const MessageBox = (props) => {


    return (
        <>
            <article className={"msg-container msg-self"} id={"msg-0"}>
                <div className={"msg-box"}>
                    <div className={"flr"}>
                        <div className={"messages"}>
                            <p className={"msg"} id={"msg-1"}> {props.msgTxt}</p>
                        </div>
                        <span className={"timestamp"}><span className={"username"}>{props.name}</span>&bull;<span className={"posttime"}>{props.time}</span></span>
                    </div>
                    <img className={"user-img"} id={"user-0"} src={alien} />
                </div>
            </article>
        </>
    );
}



// Use the below later for better message display

// {messages.map((message) =>
//     message.name === localStorage.getItem('userName') ? (
//       <div className="message__chats" key={message.id}>
//         <p className="sender__name">You</p>
//         <div className="message__sender">
//           <p>{message.text}</p>
//         </div>
//       </div>
//     ) : (
//       <div className="message__chats" key={message.id}>
//         <p>{message.name}</p>
//         <div className="message__recipient">
//           <p>{message.text}</p>
//         </div>
//       </div>
//     )
//   )}