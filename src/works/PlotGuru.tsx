import * as React from "react";
import Spinning from "../components/Spinning";
import { Typography, Divider } from "@mui/material";
import WorkHeader from "../components/WorkHeader";
import WorkSection from "../components/WorkSection";
import { WORKBEM } from "../components/WorkWithDetails";
import WorkImage from "../components/WorkImage";

const SECTION_STYLE1 = {
  backgroundColor: "#F7F4EB",
  backgroundImage: "paper_bg.jpeg",
};

export interface PlotGuruProps {}

class PlotGuru extends React.Component<PlotGuruProps> {
  render() {
    return (
      <Spinning>
        <div className={WORKBEM.block("park-engagement")}>
          <WorkHeader
            style={{
              backgroundImage:
                "linear-gradient(to right bottom, #df2c51, #e03457, #e23c5e, #e34364, #e44a6a)",
            }}
            logo={
              <Typography variant="h3">Plot Guru Usability Testing</Typography>
            }
            subtitle="Plot Guru is an iOS mobile application, provides the real-time trivia game for all users’ favorite television shows. The usability testing is intended to determine the extent an interface facilitates a user’s ability to complete typical tasks."
            roles="User Researcher • Note Taker • Videographer"
            practices="Usability Testing • Interview • Video Editing"
            headerImage={
              <img
                src="previews/plotGuru.png"
                title="plotGuru"
                height="480px"
              />
            }
            noShadow
          />
          <WorkSection style={SECTION_STYLE1}>
            <Typography
              variant="h3"
              align="center"
              style={{ padding: "1.5em 0", textTransform: "uppercase" }}
            >
              Detailed Whole Process
            </Typography>
            <WorkImage
              src="plotguru/plotguru_process.png"
              title="Plot Guru Journey Map"
              isZoomable
            />
          </WorkSection>
        </div>
      </Spinning>
    );
  }
}

export default PlotGuru;
