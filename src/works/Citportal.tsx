import * as React from "react";
import Spinning from "../components/Spinning";
import { Typography, Grid } from "@mui/material";
import WorkBodyText from "../components/WorkBodyText";
import WorkH1 from "../components/WorkH1";
import WorkHeader from "../components/WorkHeader";
import WorkSection from "../components/WorkSection";
import { WORKBEM } from "../components/WorkWithDetails";
import WorkImage from "../components/WorkImage";
import WorkH2 from "../components/WorkH2";

const SECTION_STYLE1 = {
  backgroundColor: "#F7F4EB",
  backgroundImage: "paper_bg.jpeg",
};

const SECTION_STYLE2 = {
  backgroundColor: "#54575a",
};

const SECTION_STYLE3 = {
  backgroundColor: "#F7F4EB",
  backgroundImage: "paper_bg.jpeg",
};

export interface CitportalProps {}

class Citportal extends React.Component<CitportalProps> {
  render() {
    return (
      <Spinning>
        <div className={WORKBEM.block("citportal")}>
          <WorkHeader
            style={{
              backgroundImage:
                "linear-gradient(to right bottom, #54575a, #525a63, #505e6c, #4d6175, #4a647e)",
            }}
            logo={
              <img src="citportal/logo.svg" alt="Citportal logo" width="320" />
            }
            subtitle="Combinational Interaction Testing (CIT) Web Portal will serve as a resource for combinatorial interaction testing in many domains."
            roles="PHP Developer • Web Designer • DB Designer & Developer"
            practices="Database Design • Database Development • PHP Development • Web Development • Heuristic Evaluation"
            headerImage={
              <WorkImage
                src="citportal/citportal_demo.png"
                title="Combinational Interaction Testing (CIT) Web Portal"
              />
            }
            noShadow
          />
          <WorkSection>
            <WorkImage
              src="citportal/process.png"
              title="Combinational Interaction Testing (CIT) Web Portal Process"
              spaced={true}
            />
          </WorkSection>
          <WorkSection style={SECTION_STYLE1}>
            <WorkH2>Layout Changes</WorkH2>
            <WorkImage
              src="citportal/citportal_change.png"
              title="Citportal Layout Change"
              spaced
            />
          </WorkSection>
          <WorkSection>
            <WorkH1>Database Implementation</WorkH1>
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <WorkBodyText>
                  The original version was a static page, no database supported.
                  In order to maintain the content of the website and easily
                  make updates, I decided to re-implement it as dynamic website.
                </WorkBodyText>
                <WorkBodyText>
                  During the implementation, I worked closely with my sponsor to
                  settle down the requirements and determine the entities we
                  needed for the site.
                </WorkBodyText>
                <WorkBodyText>
                  After determining the entities and relationship between
                  entities, I drew the ER diagram and started to building
                  database using mysql and PhpMyAdmin (I used PHP with
                  Codeigniter to develop the site).
                </WorkBodyText>
              </Grid>
              <Grid item xs={12} md={7}>
                <WorkImage src="citportal/db.png" title="Citportal DB Design" />
              </Grid>
            </Grid>
          </WorkSection>
          <WorkSection>
            <WorkH1>Concept of Operations</WorkH1>
            <WorkBodyText>
              I developed the site, using PHP with codeigniter. In order to make
              the site look better, I used the grumby framework to help build
              the website. With the framework, it is easier to set the grid, and
              arrange contents. As this is an informative site, I organized the
              contents as pieces of information boards, and used light but high
              contrast colors basically black, white, gray and some other
              highlights colors, to make the contents more clear and
              well-arranged to users.
            </WorkBodyText>
          </WorkSection>
          <WorkSection style={SECTION_STYLE2}>
            <WorkImage
              src="citportal/tools.png"
              title="Tools used in the Citportal"
            />
          </WorkSection>
          <WorkSection style={SECTION_STYLE3}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="caption"
                  display="block"
                  align="center"
                  gutterBottom
                >
                  Homepage
                </Typography>
                <WorkImage
                  src="citportal/citportal_homepage.png"
                  title="Citportal Homepage"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="caption"
                  display="block"
                  align="center"
                  gutterBottom
                >
                  Timeline
                </Typography>
                <WorkImage
                  src="citportal/citportal_timeline.png"
                  title="Citportal Timeline"
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
                  Paper & Post
                </Typography>
                <WorkImage
                  src="citportal/paper_post.png"
                  title="Paper & Post"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="caption"
                  display="block"
                  align="center"
                  gutterBottom
                >
                  Post Question
                </Typography>
                <WorkImage
                  src="citportal/citportal_question.png"
                  title="Question"
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
                  Tools
                </Typography>
                <WorkImage src="citportal/citportal_tools.png" title="Tools" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="caption"
                  display="block"
                  align="center"
                  gutterBottom
                >
                  Team
                </Typography>
                <WorkImage src="citportal/citportal_people.png" title="Team" />
              </Grid>
            </Grid>
          </WorkSection>
        </div>
      </Spinning>
    );
  }
}

export default Citportal;
