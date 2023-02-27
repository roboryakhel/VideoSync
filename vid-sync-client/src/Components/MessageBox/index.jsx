import React from 'react';
import alien from "../../Pictures/alien.png"

export const MessageBox = (props) => {

    return (
        props.name === props.bName ? 
        (<article className={"msg-container"}>
            <div className={"msg-inner"}>
                <div className={"msg-box msg-self"}>
                    <div className={"flr"}>
                        <div className={"messages"}>
                            <p className={"msg"}> {props.msgTxt}</p>
                        </div>
                    </div>
                    <img className={"user-img"} src={alien} />
                </div>
            </div>
        </article>)
    :
        (<article className={"msg-container"} >
        <div className={"msg-inner"}>
            <div className={"msg-box msg-other"}>
                <div className={"flr"}>
                    <span className={"timestamp"}><span className={"username"}>{props.bName}</span></span>
                    <div className={"messages"}>
                        <p className={"msg"}> {props.msgTxt}</p>
                    </div>
                </div>
                <img className={"user-img"} src={alien} />
            </div>
        </div>
    </article>)
    );
}