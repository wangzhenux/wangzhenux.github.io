import * as React from "react";
import WorkDialog from "../../components/WorkDialog";
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
import { Grid, Typography } from "@mui/material";
import WorkImage from "../../components/WorkImage";
import Carousel from "react-multi-carousel";
import { StyledDivider } from "../../components/StyledDivider";
import WorkTable, { TopFindings, createData } from "../../components/WorkTable";

interface IntegrationLandscapeProps {
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

class IntegrationLandscape extends React.Component<
  IntegrationLandscapeProps,
  State
> {
  constructor(props: IntegrationLandscapeProps) {
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
        title="Integration Landscape"
        isFullScreen
        isVisible={this.props.isVisible}
        onClose={this.props.onClose}
      >
        <div ref={this.ref} />
        <WorkSection style={{ marginBottom: "-4em" }}>
          <WorkBodyText>
            <b>Integration Landscape</b> is the overall view of all the
            integrations set up by the customers. It is aiming to help users to
            better understand their artifact flow in a big picture but also can
            help provide a intuitive way to build their integrations
            (eventually).
          </WorkBodyText>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <WorkLists lists={KEY_BENEFITS} />
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkLists lists={KEY_BUSINESS_VALUES} />
            </Grid>
          </Grid>
          <ImageComparison
            beforeImage="tasktop/integration_landscape/before.png"
            afterImage="tasktop/integration_landscape/final_landscape.png"
            beforeLabel="List"
            afterLabel="Landscape"
            width={800}
            ratio={0.75}
            caption="Integration Landscape"
          />
        </WorkSection>
        <WorkSection>
          <WorkH1>Background</WorkH1>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <WorkBodyText>
                Tasktop Integration Hub is an enterprise software to power the
                world’s largest Agile and DevOps transformations. Customers can
                automate information flow between teams through Hub.
              </WorkBodyText>
              <WorkBodyText>
                From the feedback we got, customers are very happy about the
                efficiency and the effortless of the tool. However, when
                prospects/customers start to think about their integration, they
                start at the very highest of levels rather than the low-level
                details and work their way down. Nevertheless, given the stage
                of the product, we only have the lower levels there, and
                integrations are created by starting with the able elements and
                working up.{" "}
                <WorkHighlight>
                  This is difficult for users to get higher-level visibility of
                  seeing their entire landscape in a single place.
                </WorkHighlight>
              </WorkBodyText>
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkImage
                src="tasktop/integration_landscape/SLA.png"
                title="Inspired by software lifecycle architecture from the field teams"
                shadow
                showCaption
              />
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection>
          <WorkH1>Gather Initial Requirements</WorkH1>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <WorkLists lists={CORE_REQUIREMENTS} />
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkLists lists={USER_NEEDS} />
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection>
          <WorkH1>Design Workshops</WorkH1>
          <WorkBodyText>
            Cross-disciplinary team members gather to rapidly generate and
            discuss a wide set of ideas from various perspectives:
          </WorkBodyText>
          <WorkLists lists={WORK_SHOPS} />
        </WorkSection>
        <div
          style={{
            padding: "4em 2em 3em 2em",
            position: "relative",
            background: "url('tasktop/integration_landscape/whiteboard.JPG')",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              left: "0",
              right: "100%",
              top: "0",
              bottom: "100%",
              backdropFilter: "saturate(30%) blur(6px) brightness(80%)",
            }}
          ></div>
          <Carousel
            responsive={responsive}
            showDots
            autoPlay
            autoPlaySpeed={10000}
            infinite
            arrows={false}
          >
            <WorkImage
              src="tasktop/integration_landscape/whiteboard1.png"
              title="whiteboard 1"
              shadow
              style={{ width: "85%", marginBottom: "2em" }}
            />
            <WorkImage
              src="tasktop/integration_landscape/whiteboard2.png"
              title="whiteboard 2"
              shadow
              style={{ width: "85%", marginBottom: "2em" }}
            />
            <WorkImage
              src="tasktop/integration_landscape/whiteboard3.png"
              title="whiteboard 3"
              shadow
              style={{ width: "85%", marginBottom: "2em" }}
            />
            <WorkImage
              src="tasktop/integration_landscape/whiteboard4.png"
              title="whiteboard 4"
              shadow
              style={{ width: "85%", marginBottom: "2em" }}
            />
          </Carousel>
        </div>
        <WorkSection style={{ paddingTop: "8em" }}>
          <WorkH1>Wireframing & Design Critiques</WorkH1>
          <WorkBodyText>
            After design workshops, we determined the basic workflow how users
            can build the landscape from scratch and run the integration from
            the landscape. However, after discussing with different
            stakeholders, especially after chatting with engineering,{" "}
            <WorkHighlight>
              with the concern of time and effort, we decided to narrow down the
              scope and focus on the display only view
            </WorkHighlight>
            , then we build up from it.
          </WorkBodyText>
        </WorkSection>
        <WorkSection
          className="grid-blueprint"
          style={{
            backgroundColor: "#a5c1d8",
            padding: "3em 2em",
            marginTop: "-2em",
          }}
          noContainer
        >
          <WorkImage
            src="tasktop/integration_landscape/workflow.png"
            title="initial workflow with building capability"
            style={{ width: "100%", filter: "grayscale(1)" }}
            showCaption
          />
        </WorkSection>
        <WorkSection>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
              <video
                style={{ border: "solid 1px #ddd", borderRadius: "4px" }}
                controls
                width="100%"
                src="tasktop/integration_landscape/version_1.mov"
              ></video>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" display="block" gutterBottom>
                Version 1
              </Typography>
              <WorkLists lists={VERSION_1_PROS} />
              <br />
              <WorkLists lists={VERSION_1_CONS} />
            </Grid>
          </Grid>
          <StyledDivider />
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
              <video
                style={{ border: "solid 1px #ddd", borderRadius: "4px" }}
                controls
                width="100%"
                src="tasktop/integration_landscape/version_2.mov"
              ></video>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" display="block" gutterBottom>
                Version 2
              </Typography>
              <Typography variant="subtitle2" display="block" gutterBottom>
                (Scope down to display only)
              </Typography>
              <WorkLists lists={VERSION_2_PROS} />
              <br />
              <WorkLists lists={VERSION_2_CONS} />
            </Grid>
          </Grid>
          <StyledDivider />
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
              <video
                style={{ border: "solid 1px #ddd", borderRadius: "4px" }}
                controls
                width="100%"
                src="tasktop/integration_landscape/version_3.mov"
              ></video>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" display="block" gutterBottom>
                Version 3
              </Typography>
              <Typography variant="subtitle2" display="block" gutterBottom>
                (Scope down to display only)
              </Typography>
              <WorkLists lists={VERSION_3_PROS} />
              <br />
              <WorkLists lists={VERSION_3_CONS} />
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection style={{ paddingBottom: "2em" }}>
          <WorkH1>High-fidelity Prototype</WorkH1>
        </WorkSection>
        <WorkSection style={{ padding: "2em 0", backgroundColor: "#f5f5f5" }}>
          <WorkTable
            header={["Top Requirements", "Design Decisions"]}
            rows={DESIGN_DECISIONS}
          />
        </WorkSection>
        <WorkSection
          className="grid-vertical-stripes"
          style={{ backgroundColor: "#dfe8ee" }}
        >
          <Typography variant="h6" display="block" gutterBottom>
            Visual Elements
          </Typography>
          <WorkImage
            src="tasktop/integration_landscape/visual_elements.svg"
            title="Visual Elements"
            spaced
          />
          <WorkImage
            src="tasktop/integration_landscape/final_design.png"
            title="Final Design"
            spaced
            shadow
          />
        </WorkSection>
        <WorkSection style={{ background: "#23222e", color: "white" }}>
          <WorkH1>Key Takeaways</WorkH1>
          <WorkBodyText>
            Typically, Enterprise software platforms are complicated,
            heavyweight, and difficult for customers to use. User experience is
            often overlooked. However, UX plays a huge role in the success of a
            software company:{" "}
            <WorkHighlight>
              good UX improves not only the user’s happiness but their
              effectiveness in meeting company needs
            </WorkHighlight>
            .
          </WorkBodyText>
          <WorkBodyText>
            In this project, I learned how to{" "}
            <WorkHighlight>
              scope down a problem, and extract key values
            </WorkHighlight>
            . Hiding the non-essential details and providing a high-level
            landscape can present a much clear view of their overall
            integrations, reducing noises. Then customers can use toggles and
            filters to quickly locate and browse the details as needed. Instead
            of solving a challenge as a whole at the beginning, I can get my
            ideas into shapes by breaking it down, then put them together at the
            end.
          </WorkBodyText>
        </WorkSection>
      </WorkDialog>
    );
  }
}

export default IntegrationLandscape;
