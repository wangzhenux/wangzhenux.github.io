import * as React from "react";
import Spinning from "../components/Spinning";
import { Typography, Grid } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import WorkBodyText from "../components/WorkBodyText";
import WorkH1 from "../components/WorkH1";
import WorkHeader from "../components/WorkHeader";
import WorkSection from "../components/WorkSection";
import { WORKBEM } from "../components/WorkWithDetails";
import WorkImage from "../components/WorkImage";
import WorkHighlight from "../components/WorkHighlight";
import WorkH2 from "../components/WorkH2";
import WorkLists, { WorkListsProps } from "../components/WorkLists";
import WorkTable, { TopFindings, createData } from "../components/WorkTable";

const SECTION_STYLE1 = {
  backgroundColor: "#F7F4EB",
  marginBottom: 0,
};

const SECTION_STYLE2 = {
  backgroundColor: "rgb(255, 206, 206)",
};

const PHASE_1_GOALS: WorkListsProps = {
  title: "Phase 1 Goals",
  icon: <CheckBoxIcon />,
  items: [
    "Document ServiceNow users’ primary needs and key pain points, focusing on the new hire onboarding process",
    "Provide a set of recommendations for redesigning the onboarding elements of ServiceNow",
    "Provide insights into what other elements or processes addressed through ServiceNow could be improved in later redesign efforts and how to prioritize those efforts",
  ],
};

const HEURISTIC_EVAL_ISSUES: WorkListsProps = {
  title: "Major Issues",
  icon: <AnnouncementOutlinedIcon />,
  items: [
    "Lots of unused real estate",
    "Icons are confusing or don’t work for HR",
    "Info boxes that you can’t hover into or interact with while with lots of content",
    "Color contrasts fail",
    "Titles and navigation are not organized and miss-leading",
    "Tooltips are missing or confusing (annotation for some labels)",
  ],
};

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

const TOP_FINDINGS_TABLE1 = {
  header: ["Top Findings", "Design Decision"],
  rows: TOP_FINDINGS_TABLE_ROWS1,
};

const TOP_FINDINGS_TABLE2 = {
  header: ["Top Findings", "Design Decision"],
  rows: TOP_FINDINGS_TABLE_ROWS2,
};

const PHASE_2_GOALS: WorkListsProps = {
  title: "Phase II Goals",
  icon: <AnnouncementOutlinedIcon />,
  items: [
    "Evaluate one iteration of ServiceNow redesign concepts and prototypes",
    "Provide a set of recommendations for ongoing concept and prototype development",
  ],
};

export interface RackspaceProps {}

export interface RackspaceState {}

class Rackspace extends React.Component<RackspaceProps, RackspaceState> {
  constructor(props: RackspaceProps) {
    super(props);
  }
  render() {
    return (
      <Spinning>
        <div className={WORKBEM.block("rackspace")}>
          <WorkHeader
            style={{
              backgroundImage:
                "linear-gradient(to right bottom, #df0113, #dc003a, #ce0059, #b70073, #970987)",
            }}
            logo={
              <img
                src="rackspace/rackspace-logo.png"
                alt="Rackspace Logo"
                style={{ maxWidth: 320 }}
              />
            }
            subtitle="ServiceNow Redesign: researched users, conducted usability testing, and redesigned the platform called ServiceNow, related to the new hire process"
            roles="Design Leader • UX Designer • User Researcher"
            practices="Competitive Analysis • Heuristic Evaluation • Interaction Design • Usability Testing"
            headerImage={
              <WorkImage
                src="rackspace/service_now_new_hire.png"
                title="Rackspace"
              />
            }
          />
          <WorkSection>
            <WorkImage
              src="rackspace/over_process.png"
              title="Rackspace Process"
              spaced={true}
            />
          </WorkSection>
          <WorkSection style={{ background: "#f1f1f1" }}>
            <WorkH1>Background</WorkH1>
            <WorkBodyText>
              ServiceNow is a platform-as-a-service (PaaS) provider of
              enterprise Service Management (SM) software. Onboarding new hires
              (new employees) is one of the most frequently used functions.
              Through the ServiceNow, managers are able to assign equipment and
              to set permissions to new employees, and to track the onboarding
              process.{" "}
              <WorkHighlight>
                The two main problems of the current site are not intuitive
                workflow and confusing taxonomy
              </WorkHighlight>
              .
            </WorkBodyText>
          </WorkSection>
          <WorkSection>
            <WorkH1>Research Study I</WorkH1>
            <WorkBodyText>
              The ServiceNow New Hire Process redesign and research efforts were
              conducted in iterative, coordinated phases. During the first
              phase, generative research was conducted to determine key user
              needs. Following data collection, alternative designs were
              produced. The second phase of research was dedicated to evaluating
              those designs.
            </WorkBodyText>
            <WorkLists lists={PHASE_1_GOALS} />
            <WorkH2 space>Heuristic Evaluation</WorkH2>
            <Grid spacing={4} container>
              <Grid item xs={12} md={6}>
                <WorkBodyText>
                  Prior to user feedback sessions, a heuristic evaluation was
                  completed. This enabled researcher to better understand the
                  ServiceNow product, evaluate it against standard usability
                  heuristics, and identify potential pain points for users
                  during testing.
                </WorkBodyText>
                <WorkLists lists={HEURISTIC_EVAL_ISSUES} />
              </Grid>
              <Grid item xs={12} md={6}>
                <WorkImage
                  src="rackspace/heuristic_eval_screenshots.png"
                  title="Heuristic Evaluation"
                />
              </Grid>
            </Grid>
            <WorkH2 space>User Feedback Sessions 1</WorkH2>
            <WorkBodyText>
              <WorkHighlight>
                Methods: "Think Aloud" Protocol (Semi-structured Usability
                Testing) + Post-session Surveys Including TAM (Technology
                Acceptance Model), SUS (System Usability Scale), STR (Supporting
                Tasks Rating).
              </WorkHighlight>
            </WorkBodyText>
            <WorkBodyText>
              During the first study of the project, generative research was
              conducted with Rackspace managers, most of whom had onboarded at
              least two new hires in the previous 6 months. Totally, 8 Rackspace
              managers participated in usability feedback sessions, lasting
              approximately 1-hour each. Participants varied by department/team
              as well as experience level: SMB Windows, Customer Programs, Cloud
              Office Email, Fanatical Support, Interaction Design and Data
              Practice.
            </WorkBodyText>
            <WorkImage
              src="rackspace/feedback1_results.png"
              title="Sessions 1 Feedback"
              spaced
            />
          </WorkSection>
          <WorkSection style={SECTION_STYLE1}>
            <WorkH2>Top Findings & Design Decisions</WorkH2>
            <WorkTable
              header={TOP_FINDINGS_TABLE1.header}
              rows={TOP_FINDINGS_TABLE1.rows}
            />
            <WorkImage src="rackspace/design_photo.png" title="Design" spaced />
            <WorkH2 space>4 Prototypes</WorkH2>
            <WorkBodyText>
              In total, we came up with 4 different prototypes.{" "}
              <WorkHighlight>
                After we talked to developer, we narrowed down the prototypes
                from 4 to 2
              </WorkHighlight>
              . We finally picked version 1 and version 4, and revised them
              based on the developer's feedback.
            </WorkBodyText>
            <Grid spacing={4} container>
              <Grid item xs={12} md={6}>
                <Typography variant="overline" display="block" gutterBottom>
                  Version 1: Single Page Structure
                </Typography>
                <WorkImage
                  src="rackspace/v1.gif"
                  title="Redesign V1"
                  hasOutline
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="overline" display="block" gutterBottom>
                  Version 2: Single Page Structure with Collapse
                </Typography>
                <WorkImage
                  src="rackspace/v2.gif"
                  title="Redesign V2"
                  hasOutline
                />
              </Grid>
            </Grid>
            <Grid spacing={4} container>
              <Grid item xs={12} md={6}>
                <Typography variant="overline" display="block" gutterBottom>
                  Version 3: Single Page Structure with Three Columns
                </Typography>
                <WorkImage
                  src="rackspace/v3.gif"
                  title="Redesign V3"
                  hasOutline
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="overline" display="block" gutterBottom>
                  Version 4: Multiple-Page Wizard Structure
                </Typography>
                <WorkImage
                  src="rackspace/v4.gif"
                  title="Redesign V4"
                  hasOutline
                />
              </Grid>
            </Grid>
          </WorkSection>
          <WorkSection>
            <WorkH1>Research Study II</WorkH1>
            <Grid spacing={4} container>
              <Grid item xs={12} md={6}>
                <WorkBodyText>
                  During the second study of the project,{" "}
                  <WorkHighlight>2 design concepts</WorkHighlight> were chosen
                  for evaluation and feedback from managers.
                </WorkBodyText>
                <WorkLists lists={PHASE_2_GOALS} />
              </Grid>
              <Grid item xs={12} md={6}>
                <WorkImage
                  src="rackspace/test_prototypes.png"
                  title="Test Prototypes"
                />
              </Grid>
            </Grid>
            <WorkH2 space>User Feedback Sessions II</WorkH2>
            <WorkBodyText>
              <WorkHighlight>9 Rackspace managers</WorkHighlight> participated
              in second usability feedback sessions, lasting approximately
              1-hour each, with high fidelity prototypes. Participants varied by
              department/team (e.g. different types of support groups, sales,
              investment), as well as experience level. After each session, on a
              scale of 1 to 100, participants rated each prototype based on how
              well they expected it to support them in the new hire process.
            </WorkBodyText>
            <WorkBodyText>
              <WorkHighlight>
                Results: the rating for the prototype increased from 65 to 85.
              </WorkHighlight>{" "}
              In terms of design preference, a slight majority (5 out of 9)
              preferred the single-page form, however, order affect may have
              been a contributing factor to participants’ preferences. 6 out of
              9 participants preferred the second design they were presented
              with.
            </WorkBodyText>
            <WorkImage
              src="rackspace/usability_testing_photo.png"
              title="Usability Testing Photo"
            />
          </WorkSection>
          <WorkSection style={SECTION_STYLE1}>
            <WorkH2>Top Findings & Design Decision II</WorkH2>
            <WorkTable
              header={TOP_FINDINGS_TABLE2.header}
              rows={TOP_FINDINGS_TABLE2.rows}
            />
          </WorkSection>
          <WorkSection style={SECTION_STYLE2} className="grid-vertical-stripes">
            <WorkH2>Revised Prototype</WorkH2>
            <Grid spacing={4} container>
              <Grid item xs={12} md={6}>
                <Typography variant="overline" display="block" gutterBottom>
                  Form Before Submission
                </Typography>
                <WorkImage
                  shadow
                  src="rackspace/revised_prototype_1.png"
                  title="Revised Prototype: Form Before Submission"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="overline" display="block" gutterBottom>
                  Status Check After Submission
                </Typography>
                <WorkImage
                  shadow
                  src="rackspace/revised_prototype_2.png"
                  title="Revised Prototype: Status Check After Submission"
                />
              </Grid>
            </Grid>
          </WorkSection>
          <WorkSection>
            <WorkH1>Other Projects in Rackspace</WorkH1>
            <WorkBodyText>
              In addition to the ServiceNow project, I also contributed to
              development of the style guide to assist with the implementation
              of internal tools in Rackspace, and consult with the company to
              build a high fidelity prototype to create consistency between
              customer website and customer support website.
            </WorkBodyText>
            <Grid spacing={4} container>
              <Grid item xs={12} md={6}>
                <WorkImage
                  src="rackspace/noted_hifi.png"
                  title="Design Audit 1"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <WorkImage
                  border
                  src="rackspace/hifi_design.png"
                  title="Design Audit 2"
                />
              </Grid>
            </Grid>
          </WorkSection>
        </div>
      </Spinning>
    );
  }
}

export default Rackspace;
