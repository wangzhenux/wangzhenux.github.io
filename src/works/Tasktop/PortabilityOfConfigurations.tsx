import * as React from "react";
import WorkDialog, { BEM } from "../../components/WorkDialog";
import WorkH1 from "../../components/WorkH1";
import WorkBodyText from "../../components/WorkBodyText";
import WorkHighlight from "../../components/WorkHighlight";
import WorkSection from "../../components/WorkSection";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import ImageComparison from "../../components/ImageComparison";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import WorkLists, { WorkListsProps } from "../../components/WorkLists";
import { Grid } from "@mui/material";
import WorkImage from "../../components/WorkImage";
import Carousel from "react-multi-carousel";
import { StyledDivider } from "../../components/StyledDivider";
import WorkTable, { TopFindings, createData } from "../../components/WorkTable";
import WorkHeader from "../../components/WorkHeader";
import { WORKBEM } from "../../components/WorkWithDetails";
import {
  ListItem,
  ListItemIcon,
  List,
  ListItemText,
  Typography,
} from "@mui/material";
import WorkH2 from "../../components/WorkH2";
import WorkCard from "../../components/WorkCard";
import { Star, WarningRounded } from "@mui/icons-material";

interface PortabilityOfConfigurationsProps {
  isVisible: boolean;
  onClose: () => void;
}

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    partialVisibilityGutter: 50,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    partialVisibilityGutter: 50,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const IMAGE_SPACE_STYLE = {
  margin: "1em 0 4em 0"
}

const KEY_BENEFITS: WorkListsProps = {
  title: "Key Benefits to Customers",
  icon: <DoneAllOutlinedIcon />,
  items: [
    "Help users quickly visualize the whole workflow of its company",
    "Quickly locate the integration users want to check out",
    "Match how users think of cooperation between different systems or departments",
    "Gives users the ability to dynamically construct integration components without having all of the details upfront",
  ],
};

const KEY_BUSINESS_VALUES: WorkListsProps = {
  title: "Key Business Values",
  icon: <AttachMoneyOutlinedIcon />,
  items: [
    "Offer CIOs a quick view to the entire value stream and see the value of Tasktop Hub",
    "Provide customers with our product vision",
    "Establish foundations for future features, and improve customer engagement",
  ],
};

const CORE_REQUIREMENTS: WorkListsProps = {
  title: "Fundamental Requirements",
  icon: <CheckBoxIcon />,
  items: [
    "It must be easy for users to visualize the entire workflow",
    "Users must be able to quickly locate an integration",
    "The Integration Landscape must match how users think about the flow of information between different systems or departments",
    "The Integration Landscape must give users the ability to dynamically construct integration components without having all of the details upfront",
  ],
};

const USER_NEEDS: WorkListsProps = {
  title: "Other Nice to Have User Needs",
  icon: <CheckBoxIcon />,
  items: [
    "User can create and view their integration landscape visually",
    "User can easily understand the workflow (information flow)",
    "User can apply different underlying canvas",
    "­­­User can see various aspects of flow, e.g. number of artifacts, number of users, states of artifact, volume,status of the integration",
    "User can zoom, filter integrations with associated details",
    "User can choose to view value/business/tool stream",
  ],
};

const WORK_SHOPS: WorkListsProps = {
  title: "",
  icon: <FaceOutlinedIcon />,
  items: [
    <span>
      <b>Product Manager</b>: give insights mainly from the perspective of
      business value and product vision
    </span>,
    <span>
      <b>Engineering</b>: give opinions mainly from the perspective of technical
      feasibility
    </span>,
    <span>
      <b>Customer-facing team members</b>: offer customer use cases and scenario
      details
    </span>,
    <span>
      <b>UX designer</b>: sketch ideas and dig deep to refine potential concepts
      and tackle design challenges
    </span>,
  ],
};

const VERSION_1_PROS: WorkListsProps = {
  title: "Pros",
  icon: <ThumbUpOutlinedIcon />,
  items: [
    "Clear procedures to build landscape",
    "Organizations are defined",
    "Easy to switch between layers",
  ],
};

const BUSINESS: WorkListsProps = {
  title: "Business Requirement",
  icon: <AttachMoneyOutlinedIcon />,
  items: [
    "Deal Breaking Feature",
  ],
};

const VERSION_1_CONS: WorkListsProps = {
  title: "Cons",
  icon: <ThumbDownOutlinedIcon />,
  items: [
    "Difficult to develop",
    "Could be a lot of work and complicated to users to start with",
    "Not very scalable",
  ],
};

const VERSION_2_PROS: WorkListsProps = {
  title: "Pros",
  icon: <ThumbUpOutlinedIcon />,
  items: [
    "Less complicated UI to develop",
    "Scalable for large amount of integrations",
    "Have emphasis on the model which is unique to Tasktop",
  ],
};

const VERSION_2_CONS: WorkListsProps = {
  title: "Cons",
  icon: <ThumbDownOutlinedIcon />,
  items: [
    "Not intuitive to view flow as a whole",
    "Lines can get crowded to look at",
  ],
};

const VERSION_3_PROS: WorkListsProps = {
  title: "Pros",
  icon: <ThumbUpOutlinedIcon />,
  items: [
    "Clean structure and intuitive to view the overall flow between repositories",
    "Easy to filter the artifact flow users want to see",
    "Provide good foundation for integration construction in the future",
  ],
};

const VERSION_3_CONS: WorkListsProps = {
  title: "Cons",
  icon: <ThumbDownOutlinedIcon />,
  items: ["Unclear about development effort", "Scalability is still a concern"],
};

const DESIGN_DECISIONS: TopFindings[] = [
  createData(
    "Users can understand the entire flow quickly",
    "Hide low level details (noise) by default but can toggle details as needed"
  ),
  createData(
    "Users can quickly locate an integration",
    "Provides visual elements like connection lines as integrations, tool icons, and filters"
  ),
  createData(
    "Users can construct how the landscape looks like",
    "Provides auto-layout but allow users to easily change it"
  ),
  createData(
    "Users can check details of an integration",
    "Provides details panel when users click on an integration"
  ),
  createData(
    "Users can know the status of an integration",
    "Color coding the integration connection lines"
  ),
];

interface State {
  width: number;
}

class PortabilityOfConfigurations extends React.Component<
  PortabilityOfConfigurationsProps,
  State
> {
  constructor(props: PortabilityOfConfigurationsProps) {
    super(props);
    this.state = {
      width: 0,
    };
  }

  ref: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount() {
    this.getWidth();
  }

  private getWidth = () => {
    if (this.ref != null && this.ref.current != null) {
      console.log(this.ref.current);
      this.setState({
        width: this.ref.current.clientWidth,
      });
    }
  };

  render() {
    return (
      <WorkDialog
        title="Portability Of Configurations"
        isFullScreen
        isVisible={this.props.isVisible}
        onClose={this.props.onClose}
      >
        <div ref={this.ref} />
        <WorkSection style={{ marginBottom: "-4em" }}>
          <WorkHeader
            logo={<WorkH1>Portability of Configurations</WorkH1>}
            style={{ color: "initial", margin: "-24px" }}
            subtitle={"This feature allows customers to track the changes they make in one instance of the product and transfer the changes to another instance without too much manual work."}
            roles="Product Designer • UX Researcher"
            practices="UX Research • Interaction Design • Usability Testing"
            headerImage={<WorkImage src="tasktop/portability_of_configurations.png" title="Portability of Configurations" hasBorderRadius />}
          />
        </WorkSection>
        <WorkSection className={BEM.element("dot-bg")}>
          <WorkImage
            src="tasktop/PortabilityOfConfigurations/process.png"
            title="Overall Process"
            showCaption
            spaced
          />
        </WorkSection>
        <WorkSection>
          <Grid spacing={4} container>
            <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
              <WorkH1>Background</WorkH1>
              <WorkBodyText>
                In order to ensure the integrity and functionality of their systems, customers typically make changes in a controlled environment such as a test or development environment, where they can validate and fine-tune the changes before deploying them to production.
              </WorkBodyText>
              <WorkBodyText>However, even after successfully testing and verifying the changes, customers still need to manually replicate them in the production environment to ensure that the changes are fully implemented and operational. <WorkHighlight>This manual replication process is crucial to maintain consistency between the different environments and minimize any potential errors or discrepancies</WorkHighlight>.
              </WorkBodyText>
              <WorkH2>Business Impact: $ Deal Breaking Feature</WorkH2>
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkImage src="tasktop/PortabilityOfConfigurations/background.png" title="Background" />
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection className={BEM.element("dot-bg")}>
          <WorkH1 spaced>5 User Studies</WorkH1>
          <WorkBodyText>
            I worked with the PM to conduct 5 user studies, asked customers to walk through their journey.
          </WorkBodyText>
          <Grid spacing={4} container style={{ marginTop: "2em", marginBottom: "2em" }}>
            <Grid item xs={12} md={3} style={{ alignSelf: "center" }}>
              <div className={BEM.element("cards", "1")}>
                <WorkCard
                  avatar={<WorkH2 space={false}>🚗</WorkH2>}
                  avatarBg={"#FFE58F"}
                  title={<b>Automotive Industry</b>}
                  content={
                    <WorkBodyText>
                      6+ Instances, 45+ Integrations
                    </WorkBodyText>
                  }
                />
                <WorkCard
                  avatar={<WorkH2 space={false}>💵</WorkH2>}
                  avatarBg={"#FFE58F"}
                  title={<b>Finance Company</b>}
                  content={
                    <WorkBodyText>
                      2 Instances, 10+ Integrations
                    </WorkBodyText>
                  }
                />
                <WorkCard
                  avatar={<WorkH2 space={false}>💼</WorkH2>}
                  avatarBg={"#FFE58F"}
                  title={<b>Insurance Company</b>}
                  content={
                    <WorkBodyText>
                      2 Instances, 15 Integrations
                    </WorkBodyText>
                  }
                />
                <WorkCard
                  avatar={<WorkH2 space={false}>🎧</WorkH2>}
                  avatarBg={"#FFE58F"}
                  title={<b>Consulting Firm</b>}
                  content={
                    <WorkBodyText>
                      6+ Instances, 10-15 Integrations
                    </WorkBodyText>
                  }
                />
                <WorkCard
                  avatar={<WorkH2 space={false}>🚙</WorkH2>}
                  avatarBg={"#FFE58F"}
                  title={<b>Automotive Industry</b>}
                  content={
                    <WorkBodyText>
                      10+ Instances, 8+ Integrations
                    </WorkBodyText>
                  }
                />
              </div>
            </Grid>
            <Grid item xs={12} md={9} style={{ alignSelf: "center" }}>
              <WorkImage src="tasktop/PortabilityOfConfigurations/customer_journey.png" title="Customer Journey Map" spaced showCaption hasBorderRadius style={{ background: "#fff" }} />
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection>
          <WorkH1>Top Pain Points</WorkH1>
          <WorkBodyText>
            Below are the top pain points based on the user studies.
          </WorkBodyText>
          <div className={BEM.element("cards", "2")}>
            <WorkCard
              avatar={<WarningRounded />}
              avatarBg={"#FF7A45"}
              title={<Typography variant="h6">Overhead Manual Tracking Changes</Typography>}
              content={
                <WorkBodyText>
                  Manually tracking and documenting changes is a time-consuming and labor-intensive process, which may involve keeping track of changes made to code, configuration files, or other system components by using spreadsheets, version control tools, or even paper-based logs.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<WarningRounded />}
              avatarBg={"#FF7A45"}
              title={<Typography variant="h6">Error Prone to Manual Replicate Changes</Typography>}
              content={
                <WorkBodyText>
                  Replicating changes made in test instance manually to production instance is often time-consuming, tedious, and prone to errors, which can lead to inconsistencies and incorrect results, due to human error, lack of proper documentation, miscommunication between team members, and differences in system configurations.
                </WorkBodyText>
              }
            />
          </div>
        </WorkSection>
        <WorkSection>
          <WorkH1>Proposed Solutions & User Flow</WorkH1>
          <WorkBodyText>
            To tackle the pain points, I worked with PMs and engineers to come up with solutions and potential user flows.
          </WorkBodyText>
          <div className={BEM.element("cards", "2")}>
            <WorkCard
              avatar={<Star />}
              avatarBg={"#7CB305"}
              title={<Typography variant="h6">Audit Configurations Changes</Typography>}
              content={
                <WorkBodyText>
                  Automatically audits all user-made changes and presents a transparent record of the change history, eliminating the need for manual documentation.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<Star />}
              avatarBg={"#7CB305"}
              title={<Typography variant="h6">Transfer Changes</Typography>}
              content={
                <WorkBodyText>
                  Enables users to transfer changes from one instance to another and provides assistance in validating the changes to ensure a seamless migration without any glitches.
                </WorkBodyText>
              }
            />
          </div>
        </WorkSection>
        <WorkSection className={BEM.element("dot-bg")}>
          <WorkImage
            src="tasktop/PortabilityOfConfigurations/user_flow.png"
            title="Proposed User Flow"
            showCaption
            spaced
          />
        </WorkSection>
        <WorkSection>
          <WorkH1>Design Iterations + Usability Testings</WorkH1>
          <WorkBodyText>
            I conducted 5 usability testings with 3 internal users, 2 customers; along the research, I iterated designs at the mean time.
          </WorkBodyText>
        </WorkSection>
        <WorkSection className={BEM.element("dot-bg")}>
          <WorkH2 space>History Screen</WorkH2>
          <WorkBodyText>
            ⚠️ Over complicated expand and collapse; summary could be more clear
          </WorkBodyText>
          <WorkBodyText>
            ✅ <WorkHighlight>Solution: reduce number of collapses and reorganize the information</WorkHighlight>
          </WorkBodyText>
          <WorkImage
            src="tasktop/PortabilityOfConfigurations/history_summary.png"
            title="History Summary Iteration"
            style={IMAGE_SPACE_STYLE}
          />
          <WorkBodyText>
            ⚠️ It is not clear that users can select and export changes
          </WorkBodyText>
          <WorkBodyText>
            ✅ <WorkHighlight>Solution: add an action button to trigger the selection for export</WorkHighlight>
          </WorkBodyText>
          <WorkImage
            src="tasktop/PortabilityOfConfigurations/history_export_changes.png"
            title="History Export Iteration"
            style={IMAGE_SPACE_STYLE}
          />
          <WorkH2 space>Import Wizard</WorkH2>
          <WorkBodyText>
            ⚠️ More metadata information should be included in the exported file
          </WorkBodyText>
          <WorkBodyText>
            ✅ <WorkHighlight>Solution: includes metadata like instance name, last updated date and number of changes</WorkHighlight>
          </WorkBodyText>
          <WorkImage
            src="tasktop/PortabilityOfConfigurations/import_metadata.png"
            title="Import Metadata Iteration"
            style={IMAGE_SPACE_STYLE}
          />
          <WorkBodyText>
            ⚠️ Instead of a confirm dialog with limited information, would rather an extra step for summary
          </WorkBodyText>
          <WorkBodyText>
            ✅ <WorkHighlight>Solution: in end of the wizard, add a confirmation step to summarize what has been imported successfully.</WorkHighlight>
          </WorkBodyText>
          <WorkImage
            src="tasktop/PortabilityOfConfigurations/import_success.png"
            title="Import Success Step Iteration"
            style={IMAGE_SPACE_STYLE}
          />
        </WorkSection>
        <WorkSection>
          {/* <iframe src="tasktop/portabilityofconfigurations.pdf" width="100%" height="800px">
          </iframe> */}
          <WorkImage
            src="tasktop/PortabilityOfConfigurations/all_screens.png"
            title="All Screens"
            showCaption
          />
        </WorkSection>
        <WorkSection>
          <WorkH1>Key Learnings</WorkH1>
          <WorkBodyText>While working with engineering, we faced technical difficulties aligning the history screen summary with the design. To ensure a quick release of the feature, I proposed to temporarily hide some unnecessary information from the log while ensuring readability. The engineering team and project manager agreed with the decision, with plans to fine-tune the history to match the design in the future.</WorkBodyText>
          <WorkCard
            avatar={<Star />}
            avatarBg={"#7CB305"}
            title={<Typography variant="h6"><i>"Don't let perfect be the enemy of good!"</i></Typography>}
            content={
              <WorkBodyText>
                Instead of spending a lot of time tackling the technical difficulties, use alternative solution to solve it for customers, even if it is not perfect.
              </WorkBodyText>
            }
          />
        </WorkSection>
      </WorkDialog>
    );
  }
}

export default PortabilityOfConfigurations;
