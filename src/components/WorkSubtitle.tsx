import React, { ReactNode } from "react";
import { WORKBEM } from "./WorkWithDetails";
import { Typography } from "@mui/material";

export interface WorkSubtitleProps {
  children?: ReactNode;
}

export interface WorkSubtitleState {}

class WorkSubtitle extends React.Component<WorkSubtitleProps, WorkSubtitleState> {
  render() {
    return (
      <Typography
        className={WORKBEM.element("description")}
        variant="h6"
        gutterBottom
      >
        {this.props.children}
      </Typography>
    );
  }
}

export default WorkSubtitle;
