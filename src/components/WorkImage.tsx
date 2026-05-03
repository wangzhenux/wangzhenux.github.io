import React from "react";
import { WORKBEM as BEM } from "./WorkWithDetails";
// import Magnifier from "react-magnifier";
import { CSSProperties } from "react";
import { Typography } from "@mui/material";

export interface WorkTitleProps {
  src: string;
  title: string;
  spaced?: boolean;
  isZoomable?: boolean;
  shadow?: boolean;
  border?: boolean;
  width?: string;
  style?: CSSProperties;
  showCaption?: boolean;
  hasOutline?: boolean;
  hasBorderRadius?: boolean;
}

export interface WorkTitleState { }

class WorkImage extends React.Component<WorkTitleProps, WorkTitleState> {
  renderImage() {
    const img = (
      <img
        src={this.props.src}
        className={
          BEM.element("image", "shadow", this.props.shadow != null) +
          " " +
          BEM.element("image", "border", this.props.border != null) +
          " " +
          BEM.element("image", "caption", this.props.showCaption != null) +
          " " +
          BEM.element("image", "border-radius", this.props.hasBorderRadius != null)
        }
        title={this.props.title}
        alt={this.props.title}
        width={this.props.width}
        style={this.props.style}
      />
    );
    return !this.props.isZoomable ? (
      img
    ) : (
      // <Magnifier
      //   src={this.props.src}
      //   width={"100%"}
      //   mgWidth={160}
      //   mgHeight={160}
      //   className={BEM.element(
      //     "zoomable-image",
      //     this.props.showCaption ? "caption" : ""
      //   )}
      // />
      <a
        href={this.props.src}
        target="_blank"
        className={BEM.element(
          "zoomable-image",
          "caption",
          this.props.showCaption
        )}
      >
        {img}
      </a>
    );
  }

  renderCaption() {
    return this.props.showCaption ? (
      <Typography
        variant="overline"
        display="block"
        className={BEM.element("image-caption")}
      >
        {this.props.title}
      </Typography>
    ) : null;
  }

  render() {
    return (
      <div
        className={
          BEM.element(
            "image-container",
            "caption",
            this.props.showCaption != null
          ) +
          " " +
          BEM.element(
            "image-container",
            "outline",
            this.props.hasOutline != null
          ) +
          " " +
          BEM.element("image-container", "spaced", this.props.spaced != null)
        }
      >
        {this.renderImage()} {this.renderCaption()}
      </div>
    );
  }
}

export default WorkImage;
