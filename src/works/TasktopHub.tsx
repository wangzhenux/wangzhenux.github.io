import * as React from "react";
import { Typography, Button, Grid, IconButton } from "@mui/material";
import WorkSection from "../components/WorkSection";
import WorkImage from "../components/WorkImage";
import ArtTrackOutlinedIcon from "@mui/icons-material/ArtTrackOutlined";
import WorkH2 from "../components/WorkH2";
import WorkH1 from "../components/WorkH1";
import WorkBodyText from "../components/WorkBodyText";
import WorkHighlight from "../components/WorkHighlight";
import { WORKBEM as BEM } from "../components/WorkWithDetails";
import WorkCard from "../components/WorkCard";
import StarsIcon from "@mui/icons-material/Stars";
import WorkCarousel, { ImageStep } from "../components/WorkCarousel";
import WorkDialog from "../components/WorkDialog";
import IntegrationLandscape from "./Tasktop/IntegrationLandscape";
import PortabilityOfConfigurations from "./Tasktop/PortabilityOfConfigurations";

const INTEGRATION_FLOW: ImageStep[] = [
  {
    label: "1. Customer Request from Salesforce",
    imgPath: "tasktop/Flow/1.png",
  },
  {
    label: "2. Flow requests to JAMA, and turn into requirements and features",
    imgPath: "tasktop/Flow/2.png",
  },
  {
    label: "3. Flow features into Jira and breakdown into stories",
    imgPath: "tasktop/Flow/3.png",
  },
  {
    label: "4. Duplicate features with story in MicroFocus for test",
    imgPath: "tasktop/Flow/4.png",
  },
  {
    label:
      "5. Reporting bugs, run build and test, and sent bug/issues back to Jira",
    imgPath: "tasktop/Flow/5.png",
  },
  {
    label: "6. Auto flow right build for production",
    imgPath: "tasktop/Flow/6.png",
  },
];

const FEATURE_LISTS = {
  title: "",
  items: [
    <span>
      <WorkHighlight>Integration Landscape</WorkHighlight> - Users can view and
      manage what tools are integrated and artifacts flow between them via
      landscape.
    </span>,
    <span>
      <WorkHighlight>Advanced Artifact Filtering</WorkHighlight> - Users can
      filter artifacts bi-directionally based on projects.
    </span>,
    <span>
      <WorkHighlight>Activity Metrics</WorkHighlight> - Users can get values out
      of our product via dashboard and metrics.
    </span>,
  ],
  icon: (
    <IconButton aria-label="Feature">
      <ArtTrackOutlinedIcon />
    </IconButton>
  ),
};
interface Props { }
interface State {
  isExampleVisible: boolean;
  isIntegrationLandscapeProcessVisible: boolean;
  isPortabilityOfConfigurationsProcessVisible: boolean;
}
export default class TasktopHub extends React.Component<Props, State> {
  state: State = {
    isExampleVisible: false,
    isIntegrationLandscapeProcessVisible: false,
    isPortabilityOfConfigurationsProcessVisible: false
  };

  showExample = () => this.setState({ isExampleVisible: true });

  showProcess = () =>
    this.setState({ isIntegrationLandscapeProcessVisible: true });

  showPortabilityOfConfigurationsProcessProcess = () =>
    this.setState({ isPortabilityOfConfigurationsProcessVisible: true });

  hidePortabilityOfConfigurationsProcessProcess = () =>
    this.setState({ isPortabilityOfConfigurationsProcessVisible: false });

  hideExample = () => this.setState({ isExampleVisible: false });

  hideProcess = () =>
    this.setState({ isIntegrationLandscapeProcessVisible: false });

  render() {
    return (
      <div className={BEM.element("hub")}>
        <WorkSection className={BEM.element("hub-header")}>
          <Grid container spacing={4} className={BEM.element("center-section")}>
            <Grid item xs={12} md={6}>
              <WorkH1>
                Flow Work Automatically and Seamlessly from Tool to Tool
              </WorkH1>
              <WorkBodyText>
                With <b>Tasktop Integration Hub</b>, you can remove the
                duplicate data entry and manual handovers that are slowing teams
                down and improve efficiency, speed, and visibility across teams.
              </WorkBodyText>
              <Button
                variant="outlined"
                color="primary"
                href="https://www.tasktop.com/integration-hub"
                className={BEM.element("btn", "invert")}
              >
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkImage
                src="tasktop/hub_integration_landscape.png"
                title="Tasktop hub"
                style={{ width: "100%" }}
                shadow
              />
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection>
          <WorkH1 spaced>What Problems Hub Solves</WorkH1>
          <WorkBodyText>
            Delivery roles have multiplied and so have the specialized tools
            throughout the delivery chain and having tools not connected means
            that team members share even the simplest of updates through
            multiple emails, status sheets and endless amounts of meetings. All
            of this increases the risk of requirements, features get lost,
            deadlines are missed. This is where integration comes in.
          </WorkBodyText>
          <div className={BEM.element("cards", "4")}>
            <WorkCard
              avatar={
                <img src="tasktop/bi-directional.svg" title="Bi-directional" />
              }
              avatarBg="#fff"
              title="True bi-directional integration"
              isSquareAvatar
            />
            <WorkCard
              avatar={<img src="tasktop/mapping.svg" title="Mapping" />}
              avatarBg="#fff"
              title="Bulk project mapping through models"
              isSquareAvatar
            />
            <WorkCard
              avatar={
                <img src="tasktop/easy-configure.svg" title="Easy Configure" />
              }
              avatarBg="#fff"
              title="Intuitive and Visual point-and-click configuration"
              isSquareAvatar
            />
            <WorkCard
              avatar={<img src="tasktop/api.svg" title="API" />}
              avatarBg="#fff"
              title="Proactive Support for API"
              isSquareAvatar
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={this.showExample}
              variant="outlined"
              color="primary"
            >
              An Example of End-to-end Integration
            </Button>
            <WorkDialog
              isVisible={this.state.isExampleVisible}
              onClose={this.hideExample}
              title="An Example of End-to-end Integration"
            >
              <WorkCarousel imgs={INTEGRATION_FLOW} />
            </WorkDialog>
          </div>
        </WorkSection>
        <WorkSection className={BEM.element("dot-bg")}>
          <WorkImage
            src="tasktop/feature_design_process.svg"
            title="General Feature Design Process at Tasktop"
            isZoomable
            showCaption
            spaced
          />
        </WorkSection>
        <WorkSection style={{ position: "relative" }}>
          <IntegrationLandscape
            isVisible={this.state.isIntegrationLandscapeProcessVisible}
            onClose={this.hideProcess}
          />
          <PortabilityOfConfigurations isVisible={this.state.isPortabilityOfConfigurationsProcessVisible} onClose={this.hidePortabilityOfConfigurationsProcessProcess} />
          <div className={BEM.element("cards", "5")}>
            <WorkCard
              avatar={<StarsIcon />}
              title={
                <Typography variant="h6">Portability of Configurations</Typography>
              }
              content={
                <WorkBodyText>
                  A new History screen was added to catalog changes Tasktop Hub users make to general settings or specific configuration elements. Users can view changes in the admin interface itself, including the date of change, name of user who made the change and a description of the change.
                  Meanwhile, users can export selected changes and import to a different instances without too much manual work.
                </WorkBodyText>
              }
              media={{
                src:
                  "tasktop/hub_history_page.png",
                title: "Portability of Configurations",
              }}
              actions={[
                <Button
                  color="primary"
                  size="small"
                  variant="outlined"
                  href="https://blog.tasktop.com/new-product-release-tasktop-hub-20-4/"
                  target="_blank"
                >
                  Learn More
                </Button>,
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => this.showPortabilityOfConfigurationsProcessProcess()}
                // href={"tasktop/portabilityofconfigurations.pdf"}
                >
                  See Process
                </Button>,
              ]}
            />
            <WorkCard
              avatar={<StarsIcon />}
              title={
                <Typography variant="h6">Integration Landscape</Typography>
              }
              content={
                <WorkBodyText>
                  Landscape view provides a simple but dramatic visual overview
                  of an enterprise’s entire software delivery value stream. This
                  type of at-a-glance value stream overview is the first of its
                  kind. It allows users to quickly see which systems are
                  integrated, what models are being used, whether the flows are
                  one-way or two-way, and see which artifacts are flowing
                  between tools (e.g. Stories, Defects, Requirements).
                </WorkBodyText>
              }
              media={{
                src:
                  "tasktop/hub_integration_landscape.png",
                title: "Integration Landscape",
              }}
              actions={[
                <Button
                  color="primary"
                  size="small"
                  variant="outlined"
                  href="https://www.tasktop.com/blog/lets-get-visual-visualize-your-integration-landscape-with-tasktop-integration-hub/"
                  target="_blank"
                >
                  Learn More
                </Button>,
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => this.showProcess()}
                >
                  See Process
                </Button>,
              ]}
            />
            {/* <WorkCard
              avatar={<StarsIcon />}
              title={
                <Typography variant="h6">Twinless Artifact Update</Typography>
              }
              content={
                <div>
                  <WorkBodyText>
                    Twinless Artifact Update ensures that when one of those
                    twins is deleted or no longer meets the criteria to flow,
                    the other twin is notified. Admins can set a rule that sends
                    one final packet of information to the other side to
                    explain, for example you can add a comment like “this
                    artifact was deleted”, or set the status to Closed or
                    Invalid.
                  </WorkBodyText>
                  <br />
                </div>
              }
              media={{
                src:
                  "https://tasktopblog.wpengine.com/wp-content/uploads/2019/01/TwinlessArtifactUpdateConfigurationExample.png",
                title: "Twinless Updates",
              }}
              actions={[
                <Button
                  color="primary"
                  size="small"
                  variant="outlined"
                  href="https://www.tasktop.com/blog/product-release-whats-new-in-tasktop-integration-hub-19-1/"
                  target="_blank"
                >
                  Learn More
                </Button>,
              ]}
            />
            <WorkCard
              avatar={<StarsIcon />}
              title={
                <Typography variant="h6">
                  Integration Metrics Dashboard V1
                </Typography>
              }
              content={
                <WorkBodyText>
                  Users can use the Integration Metrics Dashboard to monitor the
                  volumes of artifacts created and updated by their integrations
                  over time. The dashboard illustrates the value of integration
                  to their organization, while also providing a window into
                  interesting trends and patterns in their integration activity.
                </WorkBodyText>
              }
              media={{
                src:
                  "https://tasktopblog.wpengine.com/wp-content/uploads/2018/04/Metrics-Dashboard-753x550.png",
                title: "Metrics Dashboard",
              }}
              actions={[
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  href="https://www.tasktop.com/blog/tasktop-integration-hub-18-2/"
                  target="_blank"
                >
                  Learn More
                </Button>,
              ]}
            />
            <WorkCard
              avatar={<StarsIcon />}
              title={
                <Typography variant="h6">
                  Container + Work Item Synchronization
                </Typography>
              }
              content={
                <WorkBodyText>
                  Many organizations rely heavily on folder structures within
                  their software development tools to organize work items, with
                  the hierarchical folder structure providing meaningful context
                  for the individual work items. The location of a work item
                  within that structure matters, and Tasktop helps preserve that
                  structure as the work item flows from tool to tool.
                </WorkBodyText>
              }
              media={{
                src:
                  "https://tasktopblog.wpengine.com/wp-content/uploads/2018/01/Tasktop-Single-Integration-For-Containers.png",
                title: "Container + Work Item Synchronization",
              }}
              actions={[
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  href="https://www.tasktop.com/blog/tasktop-integration-hub-18-1/"
                  target="_blank"
                >
                  Learn More
                </Button>,
              ]}
            />
            <WorkCard
              avatar={<StarsIcon />}
              title={<Typography variant="h6">Test Management</Typography>}
              content={
                <WorkBodyText>
                  By integrating the network of testing tools with all other
                  tools in the process, software leaders can gain powerful
                  visibility into the coverage, quality, and cost of their
                  testing operations. They can gain control of the software
                  delivery process and quality of the end products that are
                  transforming their business in the Age of Digital Disruption.
                </WorkBodyText>
              }
              media={{
                src: "tasktop/test_management.png",
                title: "Test Management",
              }}
              actions={[
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  href="https://www.tasktop.com/blog/infographic-how-to-unify-testing-reporting-across-a-multi-tool-stack/"
                  target="_blank"
                >
                  Learn More
                </Button>,
              ]}
            /> */}
          </div>
        </WorkSection>
      </div>
    );
  }
}
