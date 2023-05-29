import React from "react";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";

const AlertBox = (props) => {
  return (
    <>
      <div className={"alerts-wrapper-main"}>
        <Collapse in={props.toggle}>
          <Alert
            severity={props.type}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  props.handleToggle();
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {props.info}
          </Alert>
        </Collapse>
      </div>
    </>
  );
};

export default AlertBox;
