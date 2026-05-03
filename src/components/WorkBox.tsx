import * as React from "react";
import { Box, Grow } from "@mui/material";
import { Link } from "react-router-dom";
import { WORK } from "../models/work";
import BemBuilder from "../utils/BemBuilder";
import DialogAlert from "./DialogAlert";

const BEM = BemBuilder.create("work-preview");

export interface WorkBoxProps {
  work: WORK;
}

export interface WorkBoxState {
  isDialogVisible: boolean;
}

class WorkBox extends React.Component<WorkBoxProps, WorkBoxState> {
  state = { isDialogVisible: false };

  renderWork = (work: WORK) => {
    if (!work.locked) {
      return (
        <Link to={work.url} className={BEM.element("link")}>
          <img
            className={BEM.element("img")}
            src={work.img}
            title={work.label}
            alt={work.label}
          />
          <div className={BEM.element("text")}>
            <h3 className={BEM.element("title")}>{work.label}</h3>
            <p className={BEM.element("description")}>{work.description}</p>
          </div>
        </Link>
      );
    } else {
      return (
        <div
          className={BEM.element("link")}
          style={{ cursor: "pointer" }}
          onClick={() => this.setState({ isDialogVisible: true })}
        >
          <img
            className={BEM.element("img")}
            src={work.img}
            title={work.label}
            alt={work.label}
          />
          <div className={BEM.element("text")}>
            <h3 className={BEM.element("title")}>{work.label}</h3>
            <p className={BEM.element("description")}>{work.description}</p>
          </div>
        </div>
      );
    }
  };

  render() {
    const work = this.props.work;
    return (
      <Grow
        in={work.visible}
        style={{ display: work.visible ? "" : "none" }}
        {...(work.visible ? { timeout: 1000 } : {})}
      >
        <Box
          className={BEM.block("hide", !work.visible)}
          style={{ background: work.bg }}
        >
          {this.renderWork(work)}
          <DialogAlert
            isVisible={this.state.isDialogVisible}
            onClose={() => this.setState({ isDialogVisible: false })}
          />
        </Box>
      </Grow>
    );
  }
}

export default WorkBox;
