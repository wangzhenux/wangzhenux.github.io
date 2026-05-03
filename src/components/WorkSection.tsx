import React, { ReactNode, CSSProperties } from "react";
import { WORKBEM } from "./WorkWithDetails";
import { Container } from "@mui/material";

export interface WorkSectionProps {
  style?: CSSProperties;
  className?: string;
  noContainer?: boolean;
  children?: ReactNode;
}

export interface WorkSectionState {}

class WorkSection extends React.Component<WorkSectionProps, WorkSectionState> {
  renderContent() {
    return this.props.noContainer ? (
      this.props.children
    ) : (
      <Container>{this.props.children}</Container>
    );
  }

  render() {
    return (
      <section
        className={
          this.props.className
            ? WORKBEM.element("section") + " " + this.props.className
            : WORKBEM.element("section")
        }
        style={this.props.style}
      >
        {this.renderContent()}
      </section>
    );
  }
}

export default WorkSection;
