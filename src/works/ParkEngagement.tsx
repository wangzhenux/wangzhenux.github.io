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

export interface ParkEngagementProps {}

class ParkEngagement extends React.Component<ParkEngagementProps> {
  render() {
    return (
      <Spinning>
        <div className={WORKBEM.block("park-engagement")}>
          <WorkHeader
            style={{
              backgroundImage:
                "linear-gradient(to right bottom, #415bf4, #007ef6, #008bc7, #008f89, #1f8d58)",
            }}
            logo={
              <Typography variant="h3">
                Park Engagement User Research
              </Typography>
            }
            subtitle="Encourage civic engagement between Austin residents and the city’s Parks and Recreation Department (PARD)."
            roles="User Researcher • Note Taker"
            practices="Survey • Interception • Interview • Ideation • Journey Map"
            headerImage={
              <img
                src="previews/parkEngagement.svg"
                title="Park Engagement"
                style={{ width: "100%" }}
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
              src="park_engagement/park_engagement_journey_map.png"
              title="Park Engagement Journey Map"
              isZoomable
            />
            <Divider />
            <Typography
              variant="h3"
              align="center"
              style={{ padding: "1.5em 0", textTransform: "uppercase" }}
            >
              Behind Scene Photos
            </Typography>
            <WorkImage
              src="park_engagement/park_engagement_photo.png"
              title="Park Engagement Photos"
            />
          </WorkSection>
        </div>
      </Spinning>
    );
  }
}

export default ParkEngagement;
