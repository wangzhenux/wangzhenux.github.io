import * as React from "react";
import Spinning from "../components/Spinning";
import { Typography, Grid, IconButton } from "@mui/material";
import WorkBodyText from "../components/WorkBodyText";
import WorkH1 from "../components/WorkH1";
import WorkHeader from "../components/WorkHeader";
import WorkSection from "../components/WorkSection";
import { WORKBEM } from "../components/WorkWithDetails";
import WorkImage from "../components/WorkImage";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import WorkLists, { WorkListsProps } from "../components/WorkLists";

const SECTION_STYLE1 = {
  backgroundColor: "#F7F4EB",
  backgroundImage: "paper_bg.jpeg",
};

export interface ILabProps {}

const CONCEPT_OF_OPERATIONS: WorkListsProps = {
  title: "",
  icon: (
    <IconButton aria-label="operations">
      <AssignmentTurnedInIcon />
    </IconButton>
  ),
  items: [
    "Optimize team formation arrount: 1. Student’s schedule and preferences, 2. Skills and project needs",
    "Project Review/Application",
    "Project/Notify student of potential constraints",
    "Group resource management",
    "Sponsorship Application/Approval",
    "Professor Oversight",
    "iLab Resource Library",
  ],
};

class ILab extends React.Component<ILabProps> {
  render() {
    return (
      <Spinning>
        <div className={WORKBEM.block("ilab")}>
          <WorkHeader
            style={{
              backgroundImage:
                "linear-gradient(to right bottom, #d21d00, #d02408, #cd2b11, #cb3017, #c8351d)",
            }}
            logo={<img src="ilab/logo.svg" alt="iLab logo" width="320" />}
            subtitle="Innovation Lab Team Assignment Site is to provide a platform for cse innovation lab to better assign students projects in a convenient way and project team cooperation."
            roles="RoR Developer • DB Designer • Developer • Web Designer • Information Architect"
            practices="DB Dev. & Design • Web Development • Software Testing"
            headerImage={
              <WorkImage
                src="ilab/ilab_demo.png"
                title="Innovation Lab Team Assignment Site"
              />
            }
            noShadow
          />
          <WorkSection>
            <WorkImage
              src="ilab/ilab_process.png"
              title="Innovation Lab Team Assignment Site Process"
              spaced={true}
            />
          </WorkSection>
          <WorkSection>
            <WorkH1>Problem Statement</WorkH1>
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <WorkBodyText>
                  Sponsors first upload their proposals for their projects.
                  Students need to review those proposals and submit the resumes
                  and cover letters to apply for projects. And instructors need
                  to go through all those documents and make decisions of who
                  should work on which project, also considering equity, but
                  it's very time-consuming.
                </WorkBodyText>
              </Grid>
              <Grid item xs={12} md={7}>
                <WorkImage
                  src="ilab/problems.png"
                  title="Innovation Lab Team Assingment Site Problems to Address"
                />
              </Grid>
            </Grid>
          </WorkSection>
          <WorkSection>
            <WorkH1>Concept of Operations</WorkH1>
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <WorkLists lists={CONCEPT_OF_OPERATIONS} />
              </Grid>
              <Grid item xs={12} md={7}>
                <WorkImage
                  src="ilab/concept_of_operations.png"
                  title="Concept of Operations"
                />
              </Grid>
            </Grid>
          </WorkSection>
          <WorkSection style={SECTION_STYLE1}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="caption"
                  display="block"
                  align="center"
                  gutterBottom
                >
                  Single Student Preference
                </Typography>
                <WorkImage
                  src="ilab/student_preference.png"
                  title="Single Student Preference"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="caption"
                  display="block"
                  align="center"
                  gutterBottom
                >
                  All Sponsor Preferences
                </Typography>
                <WorkImage
                  src="ilab/sponsor_preferences.png"
                  title="All Sponsor Preferences"
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="caption"
                  display="block"
                  align="center"
                  gutterBottom
                >
                  New Team Task
                </Typography>
                <WorkImage src="ilab/new_team_task.png" title="New Team Task" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="caption"
                  display="block"
                  align="center"
                  gutterBottom
                >
                  Team Task Track
                </Typography>
                <WorkImage
                  src="ilab/team_task_track.png"
                  title="Team Task Track"
                />
              </Grid>
            </Grid>
          </WorkSection>
        </div>
      </Spinning>
    );
  }
}

export default ILab;
