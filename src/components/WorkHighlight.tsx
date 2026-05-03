import React, { ReactNode } from "react";
import { WORKBEM } from "./WorkWithDetails";
import { Typography } from "@mui/material";

export interface WorkHighlightProps {
  children?: ReactNode;
}

export interface WorkHighlightState {}

class WorkHighlight extends React.Component<WorkHighlightProps, WorkHighlightState> {
  render() {
    return (
      <Typography component="span" className={WORKBEM.element("highlight")}>
        {this.props.children}
      </Typography>
    );
  }
}

export default WorkHighlight;
