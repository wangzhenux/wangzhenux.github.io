import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
export interface DialogProps {
  isVisible: boolean;
  onClose: () => void;
}

export interface DialogState {}

class DialogAlert extends React.Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);
  }

  render() {
    return (
      <Dialog
        open={this.props.isVisible}
        onClose={this.props.onClose}
        aria-labelledby="locked-work"
        aria-describedby="locked-work-description"
      >
        <DialogTitle id="locked-work">
          <div style={{ display: "flex", alignItems: "center" }}>
            <LockOutlinedIcon fontSize="small" style={{ marginRight: "8px" }} />
            <span>This work is locked.</span>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="locked-work-description">
            Please{" "}
            <a href="mailto:wangzhen614@gmail.com?subject=Request%20Portfolio%20Access">
              contact me
            </a>{" "}
            for access and details.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DialogAlert;
