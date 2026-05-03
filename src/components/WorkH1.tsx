import React, { ReactNode } from "react";
import { WORKBEM } from "./WorkWithDetails";
import { Typography } from "@mui/material";

export interface WorkTitleProps {
  align?: "left" | "center" | "right" | "justify" | "inherit";
  spaced?: boolean;
  children?: ReactNode;
}

export interface WorkTitleState {}

class WorkH1 extends React.Component<WorkTitleProps, WorkTitleState> {
  render() {
    return (
      <Typography
        variant="h4"
        component="h4"
        className={WORKBEM.element("title", this.props.spaced ? "spaced" : "")}
        align={this.props.align}
        gutterBottom
      >
        <strong>{this.props.children}</strong>
      </Typography>
    );
  }
}

export default WorkH1;
