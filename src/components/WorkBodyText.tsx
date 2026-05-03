import React, { ReactNode } from "react";
import { WORKBEM } from "./WorkWithDetails";
import { Typography } from "@mui/material";

export interface WorkBodyTextProps {
  style?: React.CSSProperties;
  children?: ReactNode;
}

export interface WorkBodyTextState { }

class WorkBodyText extends React.Component<WorkBodyTextProps, WorkBodyTextState> {
  render() {
    return (
      <Typography variant="body1" paragraph className={WORKBEM.element("body")} style={this.props.style ? this.props.style : {}}>
        {this.props.children}
      </Typography>
    );
  }
}

export default WorkBodyText;
