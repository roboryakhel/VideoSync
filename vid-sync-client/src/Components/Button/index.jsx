import React, { useEffect } from "react";
import { AiOutlineDisconnect } from "react-icons/ai";
import { Btn } from "../ConnectionSideMenu/elements";

export const Button = (props) => {
  const disconnect = () => {
    if (props.connected) {
      props.handleDisconnect();
    }
  };
  return (
    <>
      <div id="disconnectBtnWrapper">
        <Btn className={"disconnectBtn"} onClick={disconnect}>
          <AiOutlineDisconnect
            style={{ fontSize: "25px" }}
          ></AiOutlineDisconnect>
        </Btn>
      </div>
    </>
  );
};
