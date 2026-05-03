import * as React from "react";
import Spinning from "../components/Spinning";
import {
  Typography,
  Grid,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import { StyledDivider } from "../components/StyledDivider";
import WorkBodyText from "../components/WorkBodyText";
import WorkH1 from "../components/WorkH1";
import WorkHeader from "../components/WorkHeader";
import WorkSection from "../components/WorkSection";
import { WORKBEM } from "../components/WorkWithDetails";
import WorkImage from "../components/WorkImage";
import WorkHighlight from "../components/WorkHighlight";
import WorkH2 from "../components/WorkH2";
import WorkLists from "../components/WorkLists";
import { TopFindings } from "../components/WorkTable";
import WorkCard from "../components/WorkCard";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import WorkCarousel, { ImageStep } from "../components/WorkCarousel";

const SECTION_STYLE1 = {
  backgroundColor: "#F7F4EB",
  marginBottom: 0,
};

const SECTION_STYLE2 = {
  backgroundColor: "rgba(26, 34, 46, 0.65)",
  color: "#fff",
  marginBottom: 0,
};

const SECTION_STYLE3 = {
  backgroundColor: "rgba(26, 34, 46, 0.75)",
  color: "#fff",
  marginBottom: 0,
};

const SECTION_STYLE4 = {
  backgroundColor: "rgba(26, 34, 46, 0.85)",
  color: "#fff",
  marginBottom: 0,
};
const SECTION_STYLE5 = {
  backgroundColor: "rgba(26, 34, 46, 1)",
  color: "#fff",
  marginBottom: 0,
};

const UBER_PROS = {
  title: "Pros",
  icon: (
    <IconButton>
      <ThumbUpAltOutlinedIcon />
    </IconButton>
  ),
  items: [
    "Payment can be made by google wallet, paypal, or scanned credit/debit card.",
    "Customer can track real-time location of reserved car.",
    "App provides clear estimate pricing with city rates.",
    "Customer can comment on the service of the driver.",
  ],
};

const UBER_CONS = {
  title: "Cons",
  icon: <ThumbDownAltOutlinedIcon />,
  items: [
    "Customer can’t determine the driver before reservation.",
    "App is limited to areas, not for cross state transportation.",
  ],
};

const POOL_MY_RIDE_PROS = {
  title: "Pros",
  icon: <ThumbUpAltOutlinedIcon />,
  items: [
    "Instant messaging is built in the app which is convenient to contact carpoolers.",
    "User can carpool with facebook friends.",
    "User is able to view others’ profile from facebook.",
    "It is easy to see the route for ride.",
  ],
};

const POOL_MY_RIDE_CONS = {
  title: "Cons",
  icon: <ThumbDownAltOutlinedIcon />,
  items: [
    "Some bugs exist when viewing someone’s profile.",
    "User needs to login in with facebook, which too dependent on facebook.",
  ],
};

const ZIMRIDE_PROS = {
  title: "Pros",
  icon: <ThumbUpAltOutlinedIcon />,
  items: [
    "User can find friends in common and read reviews from the previous Zimrides.",
    "User can get to know other Zimriders before sharing a ride.",
    "New messages will stay on the top and reply to ride requests easily.",
  ],
};

const ZIMRIDE_CONS = {
  title: "Cons",
  icon: <ThumbDownAltOutlinedIcon />,
  items: [
    "Posting ride function is not consistent.",
    "The information of ride or user is no sufficient.",
    "User’s profile is not customizable.",
    "Map is not embedded, which will jump to google map app.",
  ],
};

function createData(topFinding: string, designDecision: string) {
  return { topFinding, designDecision };
}

const TOP_FINDINGS_TABLE_ROWS1: TopFindings[] = [
  createData("Link in email creates security concern", "Spell out the link"),
  createData("Tabs vs One-page", "Smoother workflow/progress"),
  createData(
    "White and grey color palette visually limiting",
    "Increase the color contrast"
  ),
  createData(
    "Iconography and labels not intuitive",
    "Find better icons and add tooltips"
  ),
  createData(
    "Process progression unclear",
    "Redesign progress bar and indicators"
  ),
  createData(
    "Confusing commenting process",
    "Make comment interaction more obvious"
  ),
  createData("Permissions process unclear", "Define mirror permissions"),
  createData(
    "Popup or panel often obscured",
    "Create mouse over and scroll function for popup"
  ),
];

const TOP_FINDINGS_TABLE_ROWS2: TopFindings[] = [
  createData(
    "Labels still confusing to users",
    "New labels and tooltip help throughout the form"
  ),
  createData(
    "Confused by language of progress bar stages",
    "Clearer wording to indicate ticket path and status"
  ),
  createData(
    "Concerns of logistics of desk location",
    "Select general area instead of specific location"
  ),
  createData(
    "Business costs of hardware selections",
    "Add informative icons and alert message"
  ),
  createData(
    "Desired to view permissions of mirrored Racker",
    "Able to display all permissions of a Racker"
  ),
  createData(
    "Unclear or missing fields in submission process",
    "Scroll to and highlight the missing fields"
  ),
  createData(
    "Unsure of how to create/edit autofill templates",
    "Created more intuitive UI w/ role-based templates"
  ),
  createData(
    "Separate sections of Comment Center confusing",
    "Combined all comments into single page"
  ),
  createData(
    "Desired status check of submitted ticket",
    "Provided live status updates and comment section"
  ),
];

const SURVEY_RESULTS: ImageStep[] = [
  {
    label: "Demographics",
    imgPath: "team/survey_r1.png",
  },
  {
    label: "Carpooler Type",
    imgPath: "team/survey_r2.png",
  },
  {
    label: "Way to Find Carpooler",
    imgPath: "team/survey_r3.png",
  },
  {
    label: "Reward Wanted",
    imgPath: "team/survey_r4.png",
  },
  {
    label: "Difficulty to Find a Carpooler",
    imgPath: "team/survey_r5.png",
  },
];

const TOP_FINDINGS_TABLE1 = {
  header: ["Top Findings", "Design Decision"],
  rows: TOP_FINDINGS_TABLE_ROWS1,
};

export interface TeamProps {}

class Team extends React.Component<TeamProps> {
  render() {
    return (
      <Spinning>
        <div className={WORKBEM.block("team")}>
          <WorkHeader
            style={{
              backgroundImage:
                "linear-gradient(to right bottom, #f46c41, #f88f38, #f6b238, #eed348, #e1f366)",
            }}
            logo={<img src="team/logo.png" alt="TEAM Logo" width="256px" />}
            subtitle="T.E.A.M (Together Everyone Achieves More) Carpool is an iOS mobile app dedicated to providing capool service to students from The University of Texas at Austin."
            roles="User Researcher • Interaction Designer"
            practices="Competitive Analysis • Interaction Design • Paper Sketch • Usability Testing • Wireframe"
            headerImage={
              <img
                src="team/team_mockup.png"
                title="TEAM Mockup"
                height="480px"
              />
            }
            noShadow
          />
          <WorkSection>
            <WorkImage
              src="team/team_process.png"
              title="TEAM Process"
              spaced={true}
            />
          </WorkSection>
          <WorkSection style={{ background: "#f1f1f1" }}>
            <WorkH1>Initial Concept</WorkH1>
            <Grid spacing={4} container>
              <Grid item xs={12} md={6}>
                <WorkBodyText>
                  Define opportunity space: Based on the 2014 Parking Strategies
                  Committee Report of University of Texas at Austin, UT had{" "}
                  <WorkHighlight>
                    52,000 students, 17,279 faculty and staff, 5,000 visitors
                    and 15,800 parking spaces
                  </WorkHighlight>{" "}
                  in the year of 2013, which means{" "}
                  <WorkHighlight>
                    the potential user to parking space ratio is 4.8:1
                  </WorkHighlight>
                  . In short words, UT has a severe parking situation. To solve
                  the problem, UT now allows a max of four members to{" "}
                  <WorkHighlight>share a parking permit</WorkHighlight> and
                  carpool to the campus. However, based on our user research,
                  few students know the existence of this policy and the major
                  problem for them to take advantage of this policy, is to find
                  a carpooler.
                </WorkBodyText>
                <WorkBodyText>
                  Based on the reasons above, we designed a carpool app called
                  T.E.A.M. for the UT students to find a carpooler. For one
                  thing, we can help students find a carpooler quickly and much
                  more easily. For another thing, the app advertised UT’s
                  carpool permit policy, which can raise UT’s profit. In
                  general, the app help with the severe parking situation for
                  UT, and help students save time and money on their way to
                  school.
                </WorkBodyText>
              </Grid>
              <Grid item xs={12} md={6}>
                <WorkImage
                  src="team/statistics_report.png"
                  title="Statistics Report"
                />
              </Grid>
            </Grid>
          </WorkSection>
          <WorkSection>
            <WorkH1>User Research</WorkH1>
            <Typography variant="overline" display="block" gutterBottom>
              1st Round User Research
            </Typography>
            <WorkBodyText>
              In order to accomplish our goal of this project, we conduct a
              survey and interviews. This survey collects both qualitative and
              quantitative data from our target users on how they think about
              the carpool, how likely they use carpool, and what kind of feature
              they want to see in the app.
            </WorkBodyText>
            <Typography variant="overline" display="block" gutterBottom>
              Competitive Analysis
            </Typography>
            <WorkBodyText>
              In order to better understand the features, organization and
              design, we did an assessment of the strengths and weaknesses of
              current and potential competitor applications with similar goal
              and functionalities. They are{" "}
              <WorkHighlight>Uber, Zimride, and Pool My Ride</WorkHighlight>.
              This analysis provides both an offensive and defensive strategic
              context to identify opportunities and threats.
            </WorkBodyText>
            <div className={WORKBEM.element("cards", "3")}>
              <WorkCard
                title={
                  <img src="team/uber.png" title="Uber Logo" width="64px" />
                }
                subheader="A smartphone application to connect passengers with drivers of vehicles for hire. Customers use the app to request rides and track their reserved vehicle's location."
                content={
                  <div>
                    <StyledDivider />
                    <WorkLists lists={UBER_PROS} />
                    <StyledDivider />
                    <WorkLists lists={UBER_CONS} />
                  </div>
                }
              />
              <WorkCard
                title={
                  <img
                    src="team/pool_my_ride.png"
                    title="Pool My Ride Logo"
                    height="64px"
                  />
                }
                subheader="A platform provides customers to select carpool partners from over 10,000 registered users across the globe over Android | IOS to help cutting down expense."
                content={
                  <div>
                    <StyledDivider />
                    <WorkLists lists={POOL_MY_RIDE_PROS} />
                    <StyledDivider />
                    <WorkLists lists={POOL_MY_RIDE_CONS} />
                  </div>
                }
              />
              <WorkCard
                title={
                  <img
                    src="team/zimride.png"
                    title="Zimride Logo"
                    height="64px"
                  />
                }
                subheader="A website provides a social ride-sharing community where you can find people going the same way as you go, and make friends as you go."
                content={
                  <div>
                    <StyledDivider />
                    <WorkLists lists={ZIMRIDE_PROS} />
                    <StyledDivider />
                    <WorkLists lists={ZIMRIDE_CONS} />
                  </div>
                }
              />
            </div>
            <Typography variant="overline" display="block" gutterBottom>
              Survey
            </Typography>
            <Grid spacing={4} container>
              <Grid item xs={12} md={6}>
                <WorkBodyText>
                  The total number of response we got by now is{" "}
                  <WorkHighlight>43</WorkHighlight>. We categorized our survey
                  into five different topics: demographics, way to find
                  carpooler, carpooler type, reward, and difficulty to find
                  carpooler.
                </WorkBodyText>
              </Grid>
              <Grid item xs={12} md={6}>
                <WorkCarousel imgs={SURVEY_RESULTS} />
              </Grid>
            </Grid>
            <Typography variant="overline" display="block" gutterBottom>
              Tailoring Scope
            </Typography>
            <WorkBodyText>
              After our initial pre-interview and survey, we narrowed the scope
              of our system by focusing on the most significant usage performed
              by students at UT. Since the students of UT are our primary users,
              we then conducted second interview and collected their inputs in
              order to find out more insight on usage model. In addition, we
              also cooperate UT’s current carpool policy in our system and apply
              the benefits including reserving carpool parking spaces, reducing
              parking permit fees and offering extra UT share pass.
            </WorkBodyText>
            <Typography variant="overline" display="block" gutterBottom>
              2nd Round User Research
            </Typography>
            <WorkBodyText>
              As we narrow down our topic to UT students, we conduct another
              interview focus on UT students. In this interview, we get
              qualitative data to determine features expected to be implemented
              on the app and tasks need to be completed by asking students with
              car or without car how much they spend on the travel, how likely
              they want to take/give a ride, how they would like to reward/share
              gas fee, how they like to find carpooler/driver and so on.
            </WorkBodyText>
          </WorkSection>
          <WorkSection style={SECTION_STYLE1}>
            <WorkH2>Findings: User Needs</WorkH2>
            <WorkImage src="team/user_needs.png" title="User Needs" spaced />
            <WorkH2 space>Findings: Personas</WorkH2>
            <WorkImage src="team/personas.png" title="Personas" spaced />
            <WorkH2 space>Findings: StoryBoard</WorkH2>
            <WorkImage src="team/storyboard.png" title="Storyboard" spaced />
          </WorkSection>
          <WorkSection>
            <WorkH1>Iterative Design</WorkH1>
            <WorkBodyText>
              We discussed and determined the initial blueprint. Then we began
              with paper prototypes, drafting out the chosen design idea, which
              was supposed to show a flow of the main functions of our website.
              We gathered usability feedback from usability testing and iterated
              4 rounds of the prototype from the early sketch to hi-fidelity
              mockups. Each iteration, we refined our ideas and design based on
              feedbacks from the usability testing. Meanwhile along with the
              design, we also settled down the Content Mapping and Controlled
              Vocabulary .
            </WorkBodyText>
          </WorkSection>
          <WorkSection style={SECTION_STYLE2} className="grid-blueprint">
            <WorkH2>Early Stage with Balsamiq</WorkH2>
            <WorkImage
              src="team/early_stage_design.png"
              title="Early Stage Design"
              width="60%"
              spaced
            />
          </WorkSection>
          <WorkSection style={SECTION_STYLE3} className="grid-blueprint">
            <WorkH2>Paper Sketch</WorkH2>
            <WorkImage
              src="team/sketch_design.png"
              title="Paper Sketch"
              spaced
            />
          </WorkSection>
          <WorkSection style={SECTION_STYLE4} className="grid-blueprint">
            <WorkH2>Medium Fidelity Mockup with Axure</WorkH2>
            <WorkImage
              src="team/medium_fi.png"
              title="Medium Fidelity Mockup with Axure"
              spaced
            />
          </WorkSection>
          <WorkSection style={SECTION_STYLE5} className="grid-blueprint">
            <WorkH2>High Fidelity Mockup</WorkH2>
            <WorkImage
              src="team/hi_fi.png"
              title="High Fidelity Mockup"
              spaced
            />
          </WorkSection>
          <WorkSection>
            <WorkH1>Behind the Scenes</WorkH1>
            <WorkImage
              src="team/behind_scene.png"
              title="Behind Scene"
              width="100%"
              spaced
            />
          </WorkSection>
        </div>
      </Spinning>
    );
  }
}

export default Team;
