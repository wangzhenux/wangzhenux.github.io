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
import WorkLists, { WorkListsProps } from "../components/WorkLists";
import {
  AddAlertOutlined,
  ArrowDownwardOutlined,
  AttachMoneyOutlined,
  SupervisedUserCircleOutlined,
  WarningRounded,
  PeopleAltOutlined,
  DonutSmall,
  PeopleOutlineOutlined,
  CakeOutlined,
} from "@mui/icons-material";

const PARTICIPANTS_LIST: WorkListsProps = {
  title: "10 Participants",
  icon: <PeopleAltOutlined />,
  items: [
    "4 current, international Twilio customers",
    "6 international non-customers",
  ],
};

const IDEAS_LIST: WorkListsProps = {
  title: "7 Ideas",
  icon: <StarsIcon />,
  items: [
    "Choose region when naming account",
    "Choose region in Ahoy questions",
    "One pager for region selection between Ahoy and Dashboard",
    "Region selection modal first time in Console",
    "Appcue tour in Console",
    "Confirm region when buying a phone number",
    "Confirm region when saving phone number configuration",
  ]
}

const OBJECTIVES_LIST: WorkListsProps = {
  title: "2 Objectives",
  icon: <StarsIcon />,
  items: [
    "Evaluate Regional onboarding and configuration concepts",
    "Determine what features would make Default Region useful for customers",
  ],
};

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
export default class TwilioOnboarding extends React.Component<Props, State> {
  state: State = {
    isExampleVisible: false,
    isIntegrationLandscapeProcessVisible: false,
    isPortabilityOfConfigurationsProcessVisible: false,
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
      <div className={BEM.element("twilio")}>
        <WorkSection className={BEM.element("twilio-header")} style={{ padding: "100px 0 48px 0", textAlign: "center" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
            <div style={{ position: "absolute", left: "64px", top: "-64px", zIndex: -1 }}>
              <img src="twilio/scribble2.svg" />
            </div>
            <WorkH1>Regional Onboarding</WorkH1>
            <WorkBodyText>
              Helps increases exposure to Twilio Regions and improves customer
              comprehension of them, so customers can select the appropriate
              region for building applications intended for their non-US
              clients.
            </WorkBodyText>
          </div>

          <div style={{ position: "absolute", right: "20%", top: "10%", zIndex: -1 }}>
            <img src="twilio/cloud.svg" />
          </div>
          <div style={{ position: "absolute", left: "20%", top: "22%", zIndex: -1 }}>
            <img src="twilio/scribble1.svg" />
          </div>
          <WorkImage
            src="twilio/onboarding_cover.png"
            title="Regional Onboarding"
            style={{ width: "80%", borderRadius: "10px" }}
            shadow
          ></WorkImage>
        </WorkSection>
        <WorkSection>
          <Grid spacing={8} container>
            <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
              <WorkH1>Background</WorkH1>
              <WorkBodyText>
                Twilio Regions lets users deploy apps in specific geographic
                regions, solving challenges for customers doing business outside
                the US, including data sovereignty, performance, and disaster
                recovery.
              </WorkBodyText>
              <WorkBodyText>
                However, customers often don't know about the different Twilio
                regions and their benefits, so they build products in the
                default region (US1) even if it's not the best choice for data
                sovereignty or performance.
              </WorkBodyText>
              <WorkH2>Job To Be Done</WorkH2>
              <WorkBodyText>
                As a <WorkHighlight>Twilio customer interested in developing an application for non-US customers</WorkHighlight>, I want to <WorkHighlight>be informed of the existence of different Twilio regions</WorkHighlight>, so I can <WorkHighlight>decide if building my applications in a Twilio non-US1 region makes sense for my use case</WorkHighlight>.
              </WorkBodyText>
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkImage src="twilio/jtbd.png" title="Quote" />
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection className={BEM.element("dot-bg")}>
          <WorkH1 spaced>Target Users</WorkH1>
          <WorkBodyText>
            For this regional onboarding initiative, we segment customers in two
            groups under international and multinational enterprise customers
            umbrella
          </WorkBodyText>
          <div className={BEM.element("cards", "2")}>
            <WorkCard
              avatar={<img src="twilio/persona1.png" />}
              avatarBg={"#FFE58F"}
              title={<Typography variant="h6">Net New Customers</Typography>}
              content={
                <WorkBodyText>
                  Customers serving non-US users that are building products with
                  Twilio for the first time.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<img src="twilio/persona2.png" />}
              avatarBg={"#FFD591"}
              title={<Typography variant="h6">Existing Customers</Typography>}
              content={
                <WorkBodyText>
                  Existing customers serving non-US users that have only built
                  applications in the US1 region.
                </WorkBodyText>
              }
            />
          </div>
        </WorkSection>
        <WorkSection>
          <WorkH1>Why Low Adoptions?</WorkH1>
          <WorkBodyText>
            Below are the top 3 pain points causing low adoptions based on the
            past research.
          </WorkBodyText>
          <div className={BEM.element("cards", "3")}>
            <WorkCard
              avatar={<WarningRounded />}
              avatarBg={"#FF7A45"}
              title={<Typography variant="h6">Lack of Visibility</Typography>}
              content={
                <WorkBodyText>
                  Twilio Regions is a relatively new feature, and many users are
                  not aware of its benefits or how to use it.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<WarningRounded />}
              avatarBg={"#FF7A45"}
              title={<Typography variant="h6">Limited Use Cases</Typography>}
              content={
                <WorkBodyText>
                  Users need to evaluate whether their use case justifies the
                  use of Twilio Regions with limited features
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<WarningRounded />}
              avatarBg={"#FF7A45"}
              title={<Typography variant="h6">Technical Complexity</Typography>}
              content={
                <WorkBodyText>
                  Setting up Twilio Regions can be technically complex as users
                  need to re-route traffic in their application.
                </WorkBodyText>
              }
            />
          </div>
        </WorkSection>
        <WorkSection>
          <WorkH1>Business Impact</WorkH1>
          <WorkBodyText>
            Having an educational onboarding flow is key to the success of the
            Regional experience
          </WorkBodyText>
          <div className={BEM.element("cards", "3")}>
            <WorkCard
              avatar={<ArrowDownwardOutlined />}
              avatarBg={"#096DD9"}
              title={<Typography variant="h6">Risk Reduction</Typography>}
              content={
                <WorkBodyText>
                  Successfully onboarding to the Regional experience help
                  reduces data compliance liability to Twilio’s customers.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<AttachMoneyOutlined />}
              avatarBg={"#096DD9"}
              title={<Typography variant="h6">New Revenue</Typography>}
              content={
                <WorkBodyText>
                  New customers are willing to use Twilio as they become aware
                  that Twilio complies with local data regulations.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<SupervisedUserCircleOutlined />}
              avatarBg={"#096DD9"}
              title={<Typography variant="h6">Customer Experience</Typography>}
              content={
                <WorkBodyText>
                  Raising awareness of Regional product offerings and benefits
                  can lead to a better end-user experience.
                </WorkBodyText>
              }
            />
          </div>
        </WorkSection>
        <WorkSection>
          <WorkH1>Competitive Analysis</WorkH1>
          <WorkBodyText>
            Take a look at other products’ onboarding flow and see if there are
            any pros and cons that we can learn from.
          </WorkBodyText>
          <div className={BEM.element("cards", "3")}>
            <WorkCard
              avatar={<img src="twilio/plivo.png" />}
              avatarBg={"#43A047"}
              title={<Typography variant="h6">Plivo</Typography>}
              content={
                <>
                  <WorkBodyText style={{ marginBottom: 16 }}>
                    Guided tour to onboard users to build an application but no
                    tour specific to regions.
                  </WorkBodyText>
                  <WorkBodyText>
                    <WorkHighlight>* Provide redact option to anonymize data</WorkHighlight>
                  </WorkBodyText>
                </>
              }
            />
            <WorkCard
              avatar={<img src="twilio/vonage.png" />}
              avatarBg={"#F5F5F5"}
              title={<Typography variant="h6">Vonage</Typography>}
              content={
                <>
                  <WorkBodyText style={{ marginBottom: 16 }}>
                    Simple steps to quickly onboard users, and only show
                    relevant guides.
                  </WorkBodyText>
                  <WorkBodyText>
                    <WorkHighlight>* Link to the docs to explain how they collect data</WorkHighlight>
                  </WorkBodyText>
                </>
              }
            />
            <WorkCard
              avatar={<img src="twilio/google_cloud.png" />}
              avatarBg={"#E6F7FF"}
              title={<Typography variant="h6">Google Cloud</Typography>}
              content={
                <>
                  <WorkBodyText style={{ marginBottom: 16 }}>
                    Show tutorials in the right panel to guide users how to set
                    up their instance.
                  </WorkBodyText>
                  <WorkBodyText>
                    <WorkHighlight>* Region is permanent once saved</WorkHighlight>
                  </WorkBodyText>
                </>
              }
            />
          </div>
        </WorkSection>
        <WorkSection className={BEM.element("dot-bg")}>
          <WorkH1>Diverge and Decide</WorkH1>
          <WorkBodyText>
            I mapped out the current onboarding flow, and brainstorming possible solutions on the user flow.
          </WorkBodyText>
          <WorkLists lists={IDEAS_LIST} />
          <WorkImage
            src="twilio/flows.png"
            title="User Flow with possible solutions"
            spaced
          />
          <WorkH2 space>Meet with RAPID Stakeholders and Decide on Solutions</WorkH2>
          <WorkBodyText>
            Following consultations with RAPID (Recommend, Agree, Perform, Input, Decide) stakeholders including Global, Growth, Console, and Phone number teams, we decided to proceed with <WorkHighlight>options 3 and 7 </WorkHighlight> to run usability testing after careful review. Below are the top concerns in our review cycles where some of them that we would like to validate with customers through hypothesis testing.
          </WorkBodyText>
          <div className={BEM.element("cards", "2")} style={{ marginTop: "2em" }}>
            <WorkCard
              avatar={<AddAlertOutlined />}
              avatarBg={"#FA8C16"}
              title={
                <Typography variant="h6">Filter users</Typography>
              }
              content={
                <WorkBodyText>
                  • Use of IP address, verification phone number or billing country to detect non-US customers can lead to missed opportunities
                  <br />
                  • New account, sub-account, existing users
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<AddAlertOutlined />}
              avatarBg={"#FA8C16"}
              title={
                <Typography variant="h6">Lower entry barriers to get to the console</Typography>
              }
              content={
                <WorkBodyText>
                  We’re actively working on minimizing the number of questions on the Ahoy flow. Additionally, we also want to disrupt as little as possible the buy a PN flow.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<AddAlertOutlined />}
              avatarBg={"#FA8C16"}
              title={
                <Typography variant="h6">Why offer default region</Typography>
              }
              content={
                <WorkBodyText>
                  As it is today, how much value/benefits can customers get from it?
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<AddAlertOutlined />}
              avatarBg={"#FA8C16"}
              title={
                <Typography variant="h6">Mixed using regional and non-regional product
                </Typography>
              }
              content={
                <WorkBodyText>
                  • If customers pick a non regional product/use case during Ahoy, we won’t include regional onboarding screen.
                  <br />
                  • Customers cannot configure a product that is non-regional (e.g., Messaging) so they won’t see the configuration modal.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<AddAlertOutlined />}
              avatarBg={"#FA8C16"}
              title={
                <Typography variant="h6">Scaring existing users
                </Typography>
              }
              content={
                <WorkBodyText>
                  Existing customers are not aware of their data being stored in the US. They can’t migrate existing data from one to another region today.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<AddAlertOutlined />}
              avatarBg={"#FA8C16"}
              title={
                <Typography variant="h6">Not all features available for non-US products
                </Typography>
              }
              content={
                <WorkBodyText>
                  E.g. customers still need to go to US phone numbers to check out regulatory information and event logs
                </WorkBodyText>
              }
            />
          </div>
        </WorkSection>
        <WorkSection>
          <WorkH1>Design Critique</WorkH1>
          <WorkBodyText>
            Prior to conducting usability testing, I sought design critiques and clinics to receive feedback on my designs. The following are some examples of the critical feedback I received and the changes I implemented based on them.
          </WorkBodyText>
          <Grid spacing={8} container>
            <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
              <WorkH2 space>One pager for region selection between Ahoy and Dashboard</WorkH2>
              <WorkBodyText>
                <WorkHighlight>🙌 Appreciate the infographics/latency information</WorkHighlight>
              </WorkBodyText>
              <WorkBodyText>
                <b>1. Copy/text on the page</b>
                <br />
                Benefits of using the default region still not very clear or correct
                <br />
                <b>How to address:</b> Update copy to make it more clear
              </WorkBodyText>
              <WorkBodyText>
                <b>2. Label for the region selection</b>
                <br />
                Without label, customers would be confused what they are configuring on this page
                <br />
                <b>How to address:</b> add title to this page “Choose default region”
              </WorkBodyText>
              <WorkBodyText>
                <b>3. Highlight limited products support for AU1</b>
                <br />
                We should let customers know the negative impact of using
                non-US region more clearly
                <br />
                <b>How to address:</b> when users pick a region, show a popover
                to explain what’s supported with the region. Also, updated text: "You can continue to use our full product suite, including Messaging, in the United States (US1) Region."
              </WorkBodyText>
              <WorkBodyText>
                <b>Lower entry barriers to get to the console</b>
                <br />
                There is still a concern around when to show regional onboarding, concern if this will cause people drop off.
                <br />
                <b>How to address:</b> We will do usability testing as well as segment international customers, only show the step to relevant customers.
              </WorkBodyText>
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkImage
                src="twilio/design_critique1.png"
                title="Design Critique 1"
              />
            </Grid>
          </Grid>
          <Grid spacing={8} container>
            <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
              <WorkH2 space>Regional optimization modal after saving phone number configuration</WorkH2>
              <WorkBodyText>
                <WorkHighlight>🙌 Appreciate where we prompt regional information</WorkHighlight>
                <br />
                It makes sense to ask for and onboard Twilio region when people configures a non-US phone number with voice we support region
              </WorkBodyText>
              <WorkBodyText>
                <b>1. Modal requires more attention</b>
                <br />
                It seems an important information but the modal is too informative.
                <br />
                <b>How to address:</b> this is meant to be an informative modal, add number to the modal title to make it more relevant.
              </WorkBodyText>
              <WorkBodyText>
                <b>2. Not explaining why this shows up</b>
                <br />
                It provides some information but not clear why this comes up
                <br />
                <b>How to address:</b> add explanation why this shows up and the benefits
              </WorkBodyText>
              <WorkBodyText>
                <b>3. Too many things in one modal</b>
                <br />
                The modal contains routing configuration as well as default region, it might be overwhelming to customers
                <br />
                <b>How to address:</b> remove default region setting from the modal as default region concept itself could be confusing to customers.
              </WorkBodyText>
              <WorkBodyText>
                <b>4. Two buttons might be confusing</b>
                <br />
                When customers keep using United States, it is confusing to see two buttons but doing the same thing.
                <br />
                <b>How to address:</b> use one button for the selected region.
              </WorkBodyText>
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkImage
                src="twilio/design_critique2.png"
                title="Design Critique 2"
              />
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection>
          <WorkH1 spaced>Validate via Usability Testing</WorkH1>
          <Grid container spacing={8} className={BEM.element("center-section")}>
            <Grid item xs={12} md={6}>
              <WorkLists lists={PARTICIPANTS_LIST} />
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkLists lists={OBJECTIVES_LIST} />
            </Grid>
          </Grid>
          <WorkH2 space>Key Findings</WorkH2>
          <div className={BEM.element("cards", "3")}>
            <WorkCard
              avatar={<DonutSmall />}
              title={<Typography variant="h6">Complex Onboarding</Typography>}
              content={
                <WorkBodyText>
                  <i>
                    “Choosing new regions might be complicated - I don’t even
                    know if someone needs to choose a default location.”
                  </i>
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<DonutSmall />}
              title={
                <Typography variant="h6">Default Region Misleading</Typography>
              }
              content={
                <WorkBodyText>
                  <i>
                    “Setting the Default Region will impact the language
                    [display] and billing [i.e., what currency I’m billed in.”
                  </i>
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<DonutSmall />}
              title={
                <Typography variant="h6">Confusing Routing Concept</Typography>
              }
              content={
                <WorkBodyText>
                  <i>
                    “Do I need to have the same setup in the US and Australia?”
                  </i>
                </WorkBodyText>
              }
            />
          </div>
          <WorkH2 space>Recommendations</WorkH2>
          <div className={BEM.element("cards", "3")}>
            <WorkCard
              avatar={<img src="twilio/icon/Bulb.png" />}
              avatarBg={"#08979C"}
              title={<Typography variant="h6">Further Research</Typography>}
              content={
                <WorkBodyText>
                  Partner with Growth and CX to continue research into the
                  customer’s experience between the Evaluate and Acquire phases.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<img src="twilio/icon/Bulb.png" />}
              avatarBg={"#08979C"}
              title={
                <Typography variant="h6">Re-evaluate Default Region</Typography>
              }
              content={
                <WorkBodyText>
                  Consider removing Default Region concept from the Console and
                  its functionalities.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<img src="twilio/icon/Bulb.png" />}
              avatarBg={"#08979C"}
              title={<Typography variant="h6">Phased Approach</Typography>}
              content={
                <WorkBodyText>
                  Phase Regions into the Console and evaluate customer response
                  at each stage of maturity.
                </WorkBodyText>
              }
            />
          </div>
        </WorkSection>
        <WorkSection>
          <WorkH1 spaced>Strategic Solution</WorkH1>
          <WorkBodyText>Based on the research and the discussion with relative stakeholders, I came up with the <WorkHighlight>phased approach to strategically onboard customers with Twilio Regions</WorkHighlight>.</WorkBodyText>
          <Grid spacing={8} container>
            <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
              <WorkH2 space>Phase 1: “👋 Ahoy, we have Twilio Regions for you”</WorkH2>
              <WorkBodyText style={{ marginBottom: "8px" }}>Increase exposure of Twilio Regions and educate on its benefits without disrupting the current customer experience
              </WorkBodyText>
              <WorkBodyText>
                • Guided tour and pin the region based on location <br />
                • Add regional docs to the last step of self-serve flow
              </WorkBodyText>
              <WorkBodyText style={{ marginBottom: "8px" }}><b>Target Customers</b></WorkBodyText>
              <WorkBodyText>
                Existing US/non-US customers creating new account, New customers
              </WorkBodyText>
              <WorkBodyText style={{ marginBottom: "8px" }}><b>Key Metrics</b></WorkBodyText>
              <WorkBodyText>
                # of Regional Docs Page Impressions
                <br />
                # of Regional "Buy a Number" page impressions
              </WorkBodyText>
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkImage src="twilio/ahoy.png" title="Ahoy" />
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection className={BEM.element("dot-bg")}>
          <WorkImage
            src="twilio/phase_1.png"
            title="Phase 1 proposal"
            spaced
          />
        </WorkSection>
        <WorkSection>
          <Grid spacing={8} container>
            <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
              <WorkH2 space>Phase 2: “🤔 You might want to use Twilio Regions”</WorkH2>
              <WorkBodyText style={{ marginBottom: "8px" }}>Nudge customers when we know they can gain benefits from Twilio Regions
              </WorkBodyText>
              <WorkBodyText>
                • Surface routing suggestion in case we believe it can be optimized
              </WorkBodyText>
              <WorkBodyText style={{ marginBottom: "8px" }}><b>Target Customers</b></WorkBodyText>
              <WorkBodyText>
                Existing US/non-US customers
              </WorkBodyText>
              <WorkBodyText style={{ marginBottom: "8px" }}><b>Key Metrics</b></WorkBodyText>
              <WorkBodyText>
                # of PNs routing to non-US1 regions
              </WorkBodyText>
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkImage src="twilio/suggest.png" title="Suggest" />
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection className={BEM.element("dot-bg")}>
          <WorkImage
            src="twilio/phase_2.png"
            title="Phase 2 proposal"
            spaced
          />
        </WorkSection>
        <WorkSection>
          <Grid spacing={8} container>
            <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
              <WorkH2 space>Phase 3: “😍 You’re gonna love using Twilio Regions”</WorkH2>
              <WorkBodyText style={{ marginBottom: "8px" }}>Proactively optimize the regional experience for customers from the get-go
              </WorkBodyText>
              <WorkBodyText>
                • Regional configuration as a part of the initial setup flow
                <br />
                • Regionalized Console experience
              </WorkBodyText>
              <WorkBodyText style={{ marginBottom: "8px" }}><b>Target Customers</b></WorkBodyText>
              <WorkBodyText>
                New Account Customer
              </WorkBodyText>
              <WorkBodyText style={{ marginBottom: "8px" }}><b>Key Metrics</b></WorkBodyText>
              <WorkBodyText>
                NPS for non-US customers
              </WorkBodyText>
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkImage src="twilio/love.png" title="Love" />
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection className={BEM.element("dot-bg")}>
          <WorkImage
            src="twilio/phase_3.png"
            title="Phase 3 proposal"
            spaced
          />
        </WorkSection>
        <WorkSection>
          <Grid spacing={8} container>
            <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
              <WorkH1>Success Metrics</WorkH1>
              <WorkBodyText style={{ marginBottom: "8px" }}>
                3 months since phase 1 launch
                <br />
                The regional "Buy a Number" page impressions increased by
              </WorkBodyText>
              <span style={{ fontSize: "3em", fontWeight: "bold" }}>179%</span>
            </Grid>
            <Grid item xs={12} md={6}>
              <WorkImage
                src="twilio/hello_global.png"
                title="Hello Global"
              />
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection>
          <WorkH1>Next Steps</WorkH1>
          <div className={BEM.element("cards", "2")}>
            <WorkCard
              avatar={<img src="twilio/icon/Bulb.png" />}
              avatarBg={"#08979C"}
              title={
                <Typography variant="h6">Evaluate Default Region</Typography>
              }
              content={
                <WorkBodyText>
                  Assess whether customers comprehend the default region and whether they consider it beneficial.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<img src="twilio/icon/Bulb.png" />}
              avatarBg={"#08979C"}
              title={
                <Typography variant="h6">Mature Twilio Regions</Typography>
              }
              content={
                <WorkBodyText>
                  Expand Twilio Regions to more products and optimize regional experience in Console (information architecture for regions).
                </WorkBodyText>
              }
            />
          </div>
        </WorkSection>
        <WorkSection>
          <WorkH1>Key Learnings</WorkH1>
          <div className={BEM.element("cards", "2")}>
            <WorkCard
              avatar={<PeopleOutlineOutlined />}
              avatarBg={"#7CB305"}
              title={
                <Typography variant="h6">RAPID Decision-making Framework</Typography>
              }
              content={
                <WorkBodyText>
                  Use RAPID decision-making framework to identify the key decision-making roles of Recommend, Agree, Perform, Input, and Decide, as well as the associated deliverables at the beginning of the project.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<StarsIcon />}
              avatarBg={"#7CB305"}
              title={
                <Typography variant="h6">Strategic Thinking</Typography>
              }
              content={
                <WorkBodyText>
                  It's not always possible to achieve a design all at once, especially when there are numerous dependencies and constraints. Consider taking a phased approach that gradually work towards the north star.
                </WorkBodyText>
              }
            />
          </div>
        </WorkSection>
      </div>
    );
  }
}
