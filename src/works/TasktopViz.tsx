import * as React from "react";
import {
  Typography,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import WorkSection from "../components/WorkSection";
import WorkImage from "../components/WorkImage";
import WorkH2 from "../components/WorkH2";
import WorkH1 from "../components/WorkH1";
import WorkBodyText from "../components/WorkBodyText";
import WorkLists, { WorkListsProps } from "../components/WorkLists";
import WorkHighlight from "../components/WorkHighlight";
import { WORKBEM as BEM } from "../components/WorkWithDetails";
import WorkHeaderLists, { Item } from "../components/WorkHeaderLists";
import ZeroIcon from "../components/ZeroIcon";
import RequirementIcon from "../components/RequirementsIcon";
import TestIcon from "../components/TestIcon";
import UnknownIcon from "../components/UnknownIcon";
import WorkCard from "../components/WorkCard";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const CHALLENGES: Item[] = [
  {
    icon: <ZeroIcon />,
    title: "From 0 with Limited Time",
    description:
      "This was a totally new product and not a lot of existing competitors to learn from, and time and resources are limited.",
  },
  {
    icon: <RequirementIcon />,
    title: "Vague Customer Needs",
    description:
      "We knew customers needed the tool but we didn’t have details. Customers were not clear about what to expect either.",
  },
  {
    icon: <TestIcon />,
    title: "Difficulty to Test",
    description:
      "It is difficult to find prospective users that have domain-specific knowledge, and understand the concepts.",
  },
  {
    icon: <UnknownIcon />,
    title: "A lot of Unknown",
    description:
      "Technical difficulties and what data was available remained unknown, and there was no clear roadmap.",
  },
];

const FEATURE_LIST: WorkListsProps = {
  title: "Feature List",
  icon: <CheckBoxIcon />,
  items: [
    "Users can easily connect to different tools",
    "Users can see the list of the artifact types and projects after they connect tools",
    "Users can intuitively understand the flow metrics",
    "Users can add and customize product",
    "Users can categorize artifact types and artifact states into flow items and flow states",
    "Users can change configuration anytime and see the results",
    "Users can see all 5 flow metrics",
    "Users can analyze the flow metrics and get insights",
    "...",
  ],
};

export default class TasktopViz extends React.Component {
  render() {
    return (
      <div className={BEM.element("viz")}>
        <WorkSection className={BEM.element("viz-header")}>
          <Grid container spacing={4} className={BEM.element("center-section")}>
            <Grid item xs={12} md={6}>
              <WorkH1>Visibility for Leadership, Actionable for Teams</WorkH1>
              <WorkBodyText>
                Get real-time visibility into the health of product value
                streams and actionable insights into the obstacles impeding
                business value delivery.
              </WorkBodyText>
              <Button
                variant="outlined"
                color="primary"
                href="https://www.tasktop.com/viz"
                className={BEM.element("btn", "invert")}
              >
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkImage
                src="tasktop/viz_header_image.png"
                title="Tasktop Viz"
                style={{ width: "100%" }}
              />
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection>
          <WorkImage
            src="tasktop/feature_design_process.svg"
            title="General Feature Design Process At Tasktop"
            spaced
            isZoomable
            showCaption
          />
        </WorkSection>
        <WorkSection style={{ background: "#f1f1f1" }}>
          <WorkH1 spaced>Background</WorkH1>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <WorkBodyText>
                In 2018, Tasktop CEO, Dr. Mik Kersten, wrote a market developing
                book called{" "}
                <a href="https://projecttoproduct.org/" target="_blank">
                  “Project to Product”
                </a>{" "}
                <WorkHighlight>
                  (I assisted the CEO with designing the interior graphics and
                  Flow Framework™ diagram)
                </WorkHighlight>
                , introduced how organizations move from project-oriented to
                product-oriented model to survive and thrive in the age of
                digital disruption using the{" "}
                <a href="https://flowframework.org/" target="_blank">
                  Flow Framework™
                </a>{" "}
                as a blueprint.
              </WorkBodyText>
              <WorkBodyText>
                Tasktop began developing a first purpose-built tool to implement
                the Flow Framework™ which can automatically extract end-to-end
                tool data that underpins software delivery, and then translate
                that data into a common language that business leaders could
                understand.
              </WorkBodyText>
              <Button
                variant="outlined"
                color="primary"
                href="https://www.tasktop.com/blog/tasktop-viz-limited-release-announced-flow-metrics-made-easy/"
              >
                Read More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkImage
                src="tasktop/p2p.png"
                title="Project to Product + Flow Framework™"
                showCaption
              />
            </Grid>
          </Grid>
        </WorkSection>
        <div style={{ display: "none" }}>
          <WorkSection>
            <WorkH1 spaced>Challenges</WorkH1>
            <div className={BEM.element("challenges")}>
              <WorkHeaderLists items={CHALLENGES} color="warning" />
            </div>
          </WorkSection>
          <WorkSection>
            <WorkH1 spaced>Features (User Needs)</WorkH1>
            <WorkBodyText>
              Before starting, we did a{" "}
              <WorkHighlight>discovery workshop</WorkHighlight>. This workshop
              mainly involved the stakeholders, including CEO, VP of Product,
              product managers. This workshop help us create alignment on
              overall goals, scope and milestones, and gather information and
              user needs for the team:
            </WorkBodyText>
            <WorkLists lists={FEATURE_LIST} />
          </WorkSection>
          <WorkSection>
            <WorkH1 spaced>Early Data Analysis & Experiment</WorkH1>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <WorkBodyText>
                  The new product is very data centric, to be able to generate
                  metrics and visualize it, we need to validate what data we can
                  get and from it, what possible visualization we could generate
                  that makes sense to the users.
                </WorkBodyText>
                <WorkBodyText>
                  To do the experiment, we, as a team, worked with an agency who
                  has expertise in both design and data visualization. This
                  process lasted 3 months. During collaboration,{" "}
                  <WorkHighlight>
                    I touched base with them almost every week to keep track the
                    process, making sure the visualization we came up with
                    meeting the requirements. Also, we analyzed the data and
                    brainstormed various ideas together, from the sankey diagram
                    to the creative solar system visualization
                  </WorkHighlight>
                  .
                </WorkBodyText>
                <WorkBodyText>
                  To better demo the results, we not only found examples but
                  also implement the idea with React, using the sample data.
                  Overall the result turned out pretty well where all of the
                  stakeholders were very excited and fascinated to see the
                  visualization playback.
                </WorkBodyText>
              </Grid>
              <Grid item xs={12} md={6}>
                <WorkImage
                  src="tasktop/viz_data_visualizations.png"
                  title="Data Experiment"
                />
              </Grid>
            </Grid>
          </WorkSection>
          <WorkSection>
            <WorkH1 spaced>Narrow Down Scope & Simplify Workflow</WorkH1>
            <WorkBodyText>
              After early investigations, experiments, and meeting with
              engineers and stakeholders, we decided to narrow the scope to keep
              the minimum features. Moving forward, we would advance the product
              using the following guiding principles:
            </WorkBodyText>
            <div className={BEM.element("cards", "3")}>
              <WorkCard
                avatar={
                  <img src="tasktop/time.svg" title="Quick Time to Value" />
                }
                avatarBg="#fff"
                title="Quick Time to Value"
                subheader="Give value instantly if we can"
              />
              <WorkCard
                avatar={<img src="tasktop/baby.svg" title="Baby Steps" />}
                avatarBg="#fff"
                title="Baby Steps"
                subheader="Give a little … get a lot … give a little more… get a lot more!"
              />
              <WorkCard
                avatar={
                  <img src="tasktop/heart.svg" title="Make Abstractions Easy" />
                }
                avatarBg="#fff"
                title="Make Abstractions Easy"
                subheader="Modeling must occur at various layers"
              />
            </div>
            <WorkImage
              src="tasktop/viz_initial_workflow.png"
              title="Initial Workflow"
              showCaption
              style={{ filter: "grayscale(1)" }}
            />
            <div style={{ textAlign: "center" }}>
              <ArrowDownwardIcon />
            </div>
            <Stepper alternativeLabel>
              <Step active>
                <StepLabel>Model Product Value Stream</StepLabel>
              </Step>
              <Step active>
                <StepLabel>Add Artifact Types</StepLabel>
              </Step>
              <Step completed>
                <StepLabel>View Dashboard</StepLabel>
              </Step>
              <Step active>
                <StepLabel>Model Flow States</StepLabel>
              </Step>
              <Step completed>
                <StepLabel>View Flow Metrics</StepLabel>
              </Step>
            </Stepper>
          </WorkSection>
          <WorkSection>
            <WorkH1 spaced>Feedback Sessions</WorkH1>
            <WorkBodyText>
              As mentioned in the challenge section, it was difficult to test
              with perspective users; so instead, we used the{" "}
              <WorkHighlight>
                feedback sessions where stakeholders, product managers,
                engineering and designers
              </WorkHighlight>{" "}
              can review and give insights from different perspectives.
            </WorkBodyText>
            <WorkImage
              src="tasktop/feedback_sessions.svg"
              title="Feedback Sessions"
              showCaption
              spaced
            />
          </WorkSection>
          <WorkSection style={{ background: "#f5f5f5" }}>
            <WorkImage
              src="tasktop/customer_journey.svg"
              title="Customer Journey"
              showCaption
            />
          </WorkSection>
          <WorkSection>
            <WorkH1 spaced>Rapid Prototyping Iterations</WorkH1>
            <Typography variant="overline">Iteration 1</Typography>
            <WorkImage
              src="tasktop/viz_iteration1.png"
              title="Viz Design Iteration 1"
              spaced
            />
            <Typography variant="overline">Iteration 2</Typography>
            <WorkBodyText>
              <WorkHighlight>
                2 main design changes based on feedback
              </WorkHighlight>
              : 1. Instead of having all the configurations on one page, split
              it into multiple steps; 2. Using left navigation to make use of
              the width of the screen and easy to navigate between products
              (product-centric nav).
            </WorkBodyText>
            <WorkImage
              src="tasktop/viz_iteration2.png"
              title="Viz Design Iteration 2"
              spaced
            />
          </WorkSection>
        </div>
        <WorkSection>
          <WorkH2>
            Please <a href="mailto: wangzhen614@gmail.com">contact me</a> to
            learn more.
          </WorkH2>
        </WorkSection>
      </div>
    );
  }
}
