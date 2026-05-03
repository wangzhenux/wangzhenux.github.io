import React from "react";
import BemBuilder from "./utils/BemBuilder";
import { Grid } from "@mui/material";
import { List } from "@mui/material";
import { ListItemText } from "@mui/material";
import WorkSection from "./components/WorkSection";

const BEM = BemBuilder.create("about");

export interface AboutProps { }

export interface AboutState { }

class About extends React.Component<AboutProps, AboutState> {
  render() {
    return (
      <WorkSection>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} className={BEM.element("about")}>
            <h1>
              Zhen Wang • <a href="Zhen-Wang-Resume.pdf">Resume</a>
            </h1>
            <List className={BEM.element("list")}>
              <ListItemText
                className={BEM.element("item")}
                primary={
                  <span>
                    I am a user experience designer and developer with passion
                    for making things functional and intuitive to use. In my
                    free time, I like to travel, and play sports, especially
                    table-tennis and badminton. Also, I love traditional Chinese
                    calligraphy and painting.
                  </span>
                }
              />
            </List>
            <List className={BEM.element("list")}>
              <ListItemText
                className={BEM.element("item")}
                primary={
                  <span>
                    In addition to my design skills, I have a background in computer engineering with a focus on front-end development, which provides me with insights into various technical challenges.
                  </span>
                }
              />
            </List>
          </Grid>
          <Grid item xs={12} sm={6} className={BEM.element("skills")}>
            <h1>Skills</h1>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <List className={BEM.element("list")}>
                  <ListItemText
                    className={BEM.element("item")}
                    primary={<span>Design</span>}
                    secondary={
                      <React.Fragment>
                        Illustration & UI graphics • Wireframe & Mockups • User Flow
                      </React.Fragment>
                    }
                  />
                </List>
              </Grid>
              <Grid item xs={12} sm={6}>
                <List className={BEM.element("list")}>
                  <ListItemText
                    className={BEM.element("item")}
                    primary={<span>Prototyping</span>}
                    secondary={
                      <React.Fragment>
                        Rapid Prototyping • Interactive Flow with
                        React + TypeScript, HTML/CSS/JS
                      </React.Fragment>
                    }
                  />
                </List>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <List className={BEM.element("list")}>
                  <ListItemText
                    className={BEM.element("item")}
                    primary={<span>Research</span>}
                    secondary={
                      <React.Fragment>
                        Data Analysis • Usability Testing • Heuristic Evaluation
                        • Competitive Analysis
                      </React.Fragment>
                    }
                  />
                </List>
              </Grid>
              <Grid item xs={12} sm={6}>
                <List className={BEM.element("list")}>
                  <ListItemText
                    className={BEM.element("item")}
                    primary={<span>Collaboration</span>}
                    secondary={
                      <React.Fragment>
                        Self Starter • Flexible • Communicative • Detail
                        Oriented • Workshop
                      </React.Fragment>
                    }
                  />
                </List>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </WorkSection>
    );
  }
}

export default About;
