import React, { ReactNode } from "react";
import { WORKBEM } from "./WorkWithDetails";
import { Typography } from "@mui/material";

export interface WorkTitleProps {
  space?: boolean;
  children?: ReactNode;
}

export interface WorkTitleState { }

class WorkH2 extends React.Component<WorkTitleProps, WorkTitleState> {
  render() {
    return (
      <Typography
        variant="h5"
        className={WORKBEM.element("h2", "spaced", this.props.space !== false)}
        gutterBottom={this.props.space != false}
      >
        {this.props.children}
      </Typography>
    );
  }
}

export default WorkH2;
