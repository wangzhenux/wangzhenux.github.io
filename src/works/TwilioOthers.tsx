import * as React from "react";
import { Container, Grid, Typography } from "@mui/material";
import WorkSection from "../components/WorkSection";
import WorkImage from "../components/WorkImage";
import WorkH2 from "../components/WorkH2";
import WorkBodyText from "../components/WorkBodyText";
import WorkHighlight from "../components/WorkHighlight";
import { WORKBEM as BEM } from "../components/WorkWithDetails";
import WorkH1 from "../components/WorkH1";
import WorkCard from "../components/WorkCard";
import StarsIcon from "@mui/icons-material/Stars";

const SECTION_STYLE3 = {
  // backgroundColor: "#E05928",
  padding: "6em 0",
};

const SECTION_STYLE4 = {
  backgroundColor: "#f5f5f5",
  padding: "6em 0",
};

export default class TwilioOthers extends React.Component {
  render() {
    return (
      <div>
        <WorkSection>
          <WorkH1 align="center" spaced>
            Other Projects
          </WorkH1>
          <div className={BEM.element("cards", "2")}>
            <WorkCard
              avatar={<StarsIcon />}
              title={
                <Typography variant="h6">International Onboarding (UK)</Typography>
              }
              media={{
                src:
                  "twilio/international_onboarding.png",
                title:
                  "International onboarding",
              }}
              subheader="Role: Product Designer"
              content={
                <WorkBodyText>
                  According to our research, the majority of UK customers (80%) utilize alpha sender IDs to communicate with their customers. However, currently, we onboard customers worldwide using a default 10-digit long code (phone number) without offering the option of alpha sender IDs. This approach doesn't give users a choice, and they remain unaware of the alpha sender ID option until they discover it themselves while using our product. Therefore, providing a tailored onboarding experience for UK customers that includes the alpha sender ID option would enhance customer engagement in the UK and potentially increase our customer base there.
                </WorkBodyText>
              }
            />
            <WorkCard
              avatar={<StarsIcon />}
              title={
                <Typography variant="h6">Remove default region to reduce confusion</Typography>
              }
              media={{
                src:
                  "twilio/remove_default_region.png",
                title:
                  "Remove Default Region",
              }}
              subheader="Role: Product Designer"
              content={
                <WorkBodyText>
                  The Default Region, introduced in Q3 '21 with Twilio Regions to optimize the console UI experience, is causing onboarding friction, increased support contacts, and legal/compliance risks due to customer misunderstandings. I worked with a UX researcher to validate potential solutions, but found that changing labels or adding explanatory text wouldn't help users. Moreover, only 5% of participants found the feature beneficial. Therefore, we have decided to remove the Default Region concept altogether to address this issue urgently.
                </WorkBodyText>
              }
            />
          </div>
        </WorkSection>
        <WorkSection style={SECTION_STYLE3}>
          <Grid container spacing={8} className={BEM.element("center-section")}>
            <Grid item xs={12} md={7}>
              <WorkImage src="twilio/design_library.png" title="Design Library & Guideline" />
            </Grid>
            <Grid item xs={12} md={5}>
              <WorkH2 space>Spearheaded Design Guidelines and Library</WorkH2>
              <WorkBodyText>
                I initiated the Global Design Guidelines and established a design library to facilitate collaboration and consistency among the design team.
              </WorkBodyText>
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection style={SECTION_STYLE4}>
          <Grid container spacing={8} className={BEM.element("center-section")}>
            <Grid item xs={12} md={7}>
              <WorkImage src="twilio/airtable_proccess.png" title="Use Airtable to Automate Process" />
            </Grid>
            <Grid item xs={12} md={5}>
              <WorkH2 space>Built Team Collaboration Automation</WorkH2>
              <WorkBodyText>
                I built platforms for asynchronous file reviews and discussions within Airtable to boost the efficiency of team collaboration, as well as providing other teams with tools to ask questions and schedule office hours with us.
              </WorkBodyText>
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection style={SECTION_STYLE3}>
          <Grid container spacing={8} className={BEM.element("center-section")}>
            <Grid item xs={12} md={7}>
              <WorkImage src="twilio/figma_plugins.png" title="Figma Plugins" />
            </Grid>
            <Grid item xs={12} md={5}>
              <WorkH2 space>Developed Figma Plugins</WorkH2>
              <WorkBodyText>
                I created four plugins, two internal and two external, to enhance the design and prototyping efficiency in Figma. The two external plugins have garnered thousands of users.
              </WorkBodyText>
              <WorkBodyText>
                • <a href="https://www.figma.com/community/plugin/1080947393958718736/Rich-Text-Replacer" target="_blank">Rich Text Replacer</a>
                <br />
                • <a href="https://www.figma.com/community/plugin/1039275928529118354/Label-Slides" target="_blank">Label Slides</a>
              </WorkBodyText>
            </Grid>
          </Grid>
        </WorkSection>
      </div>
    );
  }
}
