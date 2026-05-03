import React, { ReactNode } from "react";
import { Dialog, IconButton, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import BemBuilder from "../utils/BemBuilder";

export const BEM = BemBuilder.create("work-dialog");

export interface WorkDialogProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  isFullScreen?: boolean;
  children?: ReactNode;
}

export interface WorkDialogState {}

class WorkDialog extends React.Component<WorkDialogProps, WorkDialogState> {
  render() {
    return (
      <Dialog
        fullScreen={this.props.isFullScreen != null}
        open={this.props.isVisible}
        onClose={this.props.onClose}
        maxWidth={"lg"}
        className={BEM.block()}
      >
        <DialogTitle
          className={BEM.element(
            "header",
            "full-screen",
            this.props.isFullScreen != null
          )}
        >
          <div className={BEM.element("title")}>
            {this.props.title}
            <IconButton
              aria-label="close"
              onClick={this.props.onClose}
              className={BEM.element("close-button")}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent
          dividers
          className={BEM.element(
            "content",
            "full-screen",
            this.props.isFullScreen != null
          )}
        >
          {this.props.children}
        </DialogContent>
      </Dialog>
    );
  }
}

export default WorkDialog;
