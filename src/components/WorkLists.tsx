import React from "react";
import { WORKBEM } from "./WorkWithDetails";
import {
  ListItem,
  ListItemIcon,
  List,
  ListItemText,
  Typography,
} from "@mui/material";

export interface WorkListsProps {
  title: string;
  items: React.ReactNode[];
  icon: React.ReactElement;
}

interface Props {
  lists: WorkListsProps;
}

export interface WorkListsState {}

class WorkLists extends React.Component<Props, WorkListsState> {
  render() {
    return (
      <div className={WORKBEM.element("lists")}>
        <Typography variant="overline" display="block" gutterBottom>
          {this.props.lists.title}
        </Typography>
        <List disablePadding>
          {this.props.lists.items.map((v, i) => (
            <ListItem
              disableGutters
              dense
              key={i}
              style={{ alignItems: "flex-start" }}
            >
              <ListItemIcon className={WORKBEM.element("list-icon")}>
                {this.props.lists.icon}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ variant: "body1" }}
                primary={v}
              />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default WorkLists;
