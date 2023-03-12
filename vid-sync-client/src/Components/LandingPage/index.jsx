import React, {useState, useRef, useEffect} from 'react';

export const LandingPage = (props) => {



    return (
        <>
            <div className="full">
                <div className="lp-inner">
                    <div className="lp-intro">
                        <div>
                            <p className="title">Watch Party</p>
                            <p className="desc">A Tool that Synchronizes Videos Playing on Your Device With the Same Videos Playing on Your Friends Device.</p>
                            <p>Simply choose a video you and your friends want to watch and play the video without any manual coordination.</p>
                            <p>All party members can control the vide (pause/play/ffwd etc) and all action are synchronized!</p>
                            
                        </div>
                    </div>
                    <div className="lp-steps">
                        <div className="inst-step step1">
                            <p className='title'>Step 1</p>
                            <p className='desc'>Expand the sidebar and start a party</p>
                            <p>Follow the arrows and expand the side bar</p>
                            <p>press the button to start a party</p>
                        </div>

                        <div className="inst-step step2">
                            <p className='title'>Step 2</p>
                            <p className='desc'>Copy and share link with friend!</p>
                            <p>Click the chain icon to copy the room ID to clip board</p>
                            <p>Send the copied link to your friend</p>
                        </div>

                        <div className="inst-step step3">
                            <p className='title'>Step 3</p>
                            <p className='desc'>Select a video and play</p>
                            <p>Click the camera icon to select a video</p>
                            <p>SEnsure the video you wan to watch is downloaded on each of your friends devices.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}