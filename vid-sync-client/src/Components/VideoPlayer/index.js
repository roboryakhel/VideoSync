import React from 'react';
import ReactPlayer from 'react-player';

export const VideoPlayer = ({props}) => {

    return (
        <>
            <div className={"vidWrapper"}>
                <div className={"vidContainer"}>
                    <div>
                        {/* <ReactPlayer ref={props.ref} url={props.url}  className="react-player" playing controls width="100%" height="100%" onProgress={props.onProgress} />                   */}
                    </div>
                </div>
            </div>
        </>
    );
}