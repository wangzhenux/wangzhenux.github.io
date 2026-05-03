import React from "react";
import { WORKBEM as BEM } from "./WorkWithDetails";
import { Typography } from "@mui/material";

export interface Item {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

export interface WorkHeaderListsProps {
  items: Item[];
  color?: "primary" | "secondary" | "warning";
}

class WorkHeaderLists extends React.Component<WorkHeaderListsProps> {
  render() {
    return this.props.items.map((r) => (
      <div key={r.title} className={BEM.element("header-list")}>
        <div
          className={BEM.element(
            "header-list-icon",
            this.props.color ? this.props.color : "primary"
          )}
        >
          {r.icon}
        </div>
        <div className={BEM.element("header-list-content")}>
          <Typography variant="subtitle1">
            <b>{r.title}</b>
          </Typography>
          <Typography variant="body2">{r.description}</Typography>
        </div>
      </div>
    ));
  }
}

export default WorkHeaderLists;
