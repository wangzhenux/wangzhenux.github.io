import React, { PureComponent } from "react";
import { Container } from "@mui/material";
import { Grid } from "@mui/material";
import { Fade } from "@mui/material";
import { List } from "@mui/material";
import { ListItemText } from "@mui/material";
import { WORKBEM } from "./WorkWithDetails";
import WorkSubtitle from "./WorkSubtitle";
import { CSSProperties } from "react";

export interface WorkHeaderProps {
  style?: CSSProperties;
  logo: React.ReactNode;
  subtitle: React.ReactNode;
  demo?: React.ReactNode;
  roles?: React.ReactNode;
  practices: React.ReactNode;
  headerImage?: React.ReactNode;
  noShadow?: boolean;
  className?: string;
}

export interface WorkHeaderState {}

class WorkHeader extends React.Component<WorkHeaderProps, WorkHeaderState> {
  constructor(props: WorkHeaderProps) {
    super(props);
  }

  render() {
    return (
      <div
        className={WORKBEM.element(
          "header",
          this.props.className,
          this.props.className != null
        )}
        style={this.props.style}
      >
        <Container>
          <Grid
            container
            spacing={4}
            className={WORKBEM.element("header-content")}
          >
            <Grid item xs={12} sm={this.props.headerImage ? 6 : 12}>
              <div className={WORKBEM.element("logo")}>{this.props.logo}</div>
              <WorkSubtitle>{this.props.subtitle}</WorkSubtitle>
              {this.props.demo}
              <div className={WORKBEM.element("attributes")}>
                {this.props.roles ? (
                  <List className={WORKBEM.element("list")}>
                    <ListItemText
                      className={WORKBEM.element("item")}
                      primary={<span>MY ROLE</span>}
                      secondary={this.props.roles}
                      secondaryTypographyProps={{ color: "inherit" }}
                    />
                  </List>
                ) : (
                  <List />
                )}
                <List className={WORKBEM.element("list")}>
                  <ListItemText
                    className={WORKBEM.element("item")}
                    primary={<span>BEST PRACTICE</span>}
                    secondary={this.props.practices}
                    secondaryTypographyProps={{ color: "inherit" }}
                  />
                </List>
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              style={{ display: this.props.headerImage ? "initial" : "none" }}
            >
              <Fade in={true} timeout={2000}>
                <div
                  className={WORKBEM.element(
                    "header-image-contaniner",
                    this.props.noShadow ? "no-shadow" : ""
                  )}
                >
                  {this.props.headerImage}
                </div>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default WorkHeader;
