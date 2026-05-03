import React from "react";
import { WORKBEM } from "./WorkWithDetails";
import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  CardMedia,
  CardActions,
} from "@mui/material";

export interface CardMediaProps {
  src: string;
  title: string;
}

export interface WorkCardProps {
  avatar?: React.ReactNode;
  isSquareAvatar?: boolean;
  avatarBg?: string;
  media?: CardMediaProps;
  title: React.ReactNode;
  subheader?: React.ReactNode;
  content?: React.ReactNode;
  actions?: React.ReactNode[];
}

class WorkCard extends React.Component<WorkCardProps> {
  renderCardMedia() {
    if (this.props.media) {
      return (
        <CardMedia
          className={WORKBEM.element("card-media")}
          image={this.props.media.src}
          title={this.props.media.title}
        />
      );
    }
    return;
  }

  renderActions() {
    return this.props.actions ? (
      <CardActions className={WORKBEM.element("card-actions")}>
        {this.props.actions.map((a, i) => (
          <span key={i}>{a}</span>
        ))}
      </CardActions>
    ) : (
      <div />
    );
  }

  render() {
    return (
      <Card
        className={WORKBEM.element(
          "card",
          "with-actions",
          this.props.actions != null
        )}
      >
        <CardHeader
          avatar={
            this.props.avatar ? (
              <Avatar
                style={{
                  backgroundColor: this.props.avatarBg
                    ? this.props.avatarBg
                    : "#2196f3",
                  borderRadius: this.props.isSquareAvatar != null ? 0 : "100px",
                }}
              >
                {this.props.avatar}
              </Avatar>
            ) : (
              ""
            )
          }
          title={this.props.title}
          subheader={this.props.subheader}
        />
        {this.renderCardMedia()}
        {this.props.content ? (
          <CardContent className={WORKBEM.element("card-content")}>
            {this.props.content} {this.renderActions()}
          </CardContent>
        ) : (
          <div />
        )}
      </Card>
    );
  }
}

export default WorkCard;
