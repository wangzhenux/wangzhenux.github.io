import React from "react";
import BemBuilder from "../utils/BemBuilder";
import { Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import CloseIcon from "@mui/icons-material/Close";
import { url } from "inspector";
import WorkDialog from "./WorkDialog";

const BEM = BemBuilder.create("image-modal");

export interface ImageModalProps {
  src: string;
  title: string;
}

export interface State {
  isOpen: boolean;
}

export default class ImageModal extends React.Component<
  ImageModalProps,
  State
> {
  constructor(props: ImageModalProps) {
    super(props);
    this.state = { isOpen: false };
  }

  hideDialog = () => this.setState({ isOpen: false });
  showDialog = () => this.setState({ isOpen: true });

  render() {
    return (
      <div className={BEM.block()}>
        <div className={BEM.element("title")}>{this.props.title}</div>
        <div
          className={BEM.element("image")}
          style={{
            backgroundImage: `url(${this.props.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            width: 640,
          }}
          onClick={() => this.setState({ isOpen: true })}
        />
        <WorkDialog
          isVisible={this.state.isOpen}
          onClose={this.hideDialog}
          title={this.props.title}
        >
          <img src={this.props.src} width="100%" />
        </WorkDialog>
      </div>
    );
  }
}
