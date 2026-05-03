import * as React from "react";
import { Container, Grid } from "@mui/material";
import WorkSection from "../components/WorkSection";
import WorkImage from "../components/WorkImage";
import WorkH2 from "../components/WorkH2";
import WorkBodyText from "../components/WorkBodyText";
import WorkHighlight from "../components/WorkHighlight";
import { WORKBEM as BEM } from "../components/WorkWithDetails";
import WorkH1 from "../components/WorkH1";
import WorkCard from "../components/WorkCard";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const SECTION_STYLE3 = {
  // backgroundColor: "#E05928",
  padding: "3em 0",
  marginBottom: "0",
};

const SECTION_STYLE4 = {
  backgroundColor: "#f5f5f5",
  padding: "3em 0",
  marginBottom: "-3em",
};

export default class TasktopOthers extends React.Component {
  render() {
    return (
      <div>
        <WorkSection>
          <WorkH1 align="center" spaced>
            Blog Post
          </WorkH1>
          <div className={BEM.element("cards", "3")}>
            <WorkCard
              avatar={<DescriptionOutlinedIcon />}
              title={
                <a
                  href="https://medium.com/@wangzhen614/optimizing-ux-how-to-set-up-your-own-usability-testing-program-in-house-8cd059e6911c"
                  target="_blank"
                  className={BEM.element("blog-title")}
                >
                  Optimizing UX: How to set up your own Usability Testing
                  Program in-house
                </a>
              }
              media={{
                src:
                  "https://miro.medium.com/max/7680/1*6uFpxgCAeP8UZwi41A-LIg.png",
                title:
                  "Optimizing UX: How to set up your own Usability Testing Program in-house",
              }}
              subheader="Blog Written by Zhen Wang"
              content={
                <div className={BEM.element("quotes")}>
                  Testing Tasktop Integration Hub’s user experience is a rather
                  complex undertaking. As my colleague Rebecca explained in her
                  blog last week, “Tasktop suffers from an interesting, almost
                  paradoxical problem: the users who benefit most from our
                  product often have no idea that it exists”. To address this
                  problem, we devised a Usability Testing Program — which, as a
                  smaller company — presented us with some interesting
                  challenges.
                </div>
              }
            />
            <WorkCard
              avatar={<DescriptionOutlinedIcon />}
              title={
                <a
                  href="https://medium.com/@Tasktop/why-you-should-bring-the-ux-designer-closer-to-the-product-development-action-56a917f7e292"
                  target="_blank"
                  className={BEM.element("blog-title")}
                >
                  Why you should bring the UX Designer closer to the Product
                  Development action
                </a>
              }
              media={{
                src: "https://miro.medium.com/max/1522/0*_DrCON5ojuX3Fagg.png",
                title:
                  "Why you should bring the UX Designer closer to the Product Development action",
              }}
              subheader="Blog Written by Zhen Wang"
              content={
                <div className={BEM.element("quotes")}>
                  Given the crucial role that UX design plays in delivering
                  software that delights end users, it’s important that the UX
                  designer is brought in as early as possible product’s
                  development. In doing so, a better software product can be
                  built — as well as delivered faster — to accelerate the value
                  delivery to the customer. Here we describe how Tasktop has
                  changed our own process to bring UX design even closer to the
                  product team.
                </div>
              }
            />
            <WorkCard
              avatar={<DescriptionOutlinedIcon />}
              title={
                <a
                  href="https://medium.com/@Tasktop/a-day-in-the-life-of-a-solo-ux-designer-at-a-software-company-36e9b14cf945"
                  target="_blank"
                  className={BEM.element("blog-title")}
                >
                  A Day In The Life: of a solo UX Designer at a software company
                </a>
              }
              media={{
                src:
                  "https://miro.medium.com/max/1440/1*ccw2WQIUH94nlVqYpfnzww.png",
                title:
                  "A Day In The Life: of a solo UX Designer at a software company",
              }}
              subheader="Blog Written by Zhen Wang"
              content={
                <div className={BEM.element("quotes")}>
                  I relish the opportunity of being the solo UX designer at a
                  software company but it’s not without its challenges. Below
                  are some of the main challenges I face, as well as the key
                  benefits I enjoy in my role, which I hope will give you a
                  distinct flavour of my working day.
                </div>
              }
            />
          </div>
        </WorkSection>
        <WorkSection style={SECTION_STYLE4}>
          <Grid container spacing={4} className={BEM.element("center-section")}>
            <Grid item xs={12} md={7}>
              <WorkImage src="tasktop/Slides.png" title="Presentation Design" />
            </Grid>
            <Grid item xs={12} md={5}>
              <WorkH2>Graphic Design / Visualization</WorkH2>
              <WorkBodyText>
                I create visualizations to help customers understand our product
                better, and develop user experience enhancements to the user
                docs website with HTML/CSS/JavaScript.
              </WorkBodyText>
              <WorkBodyText>
                <WorkHighlight>
                  I collaborated with the leadership
                </WorkHighlight>{" "}
                to create organized, engaging, and animated presentations and
                graphics for various conferences and talks. (
                <WorkHighlight>
                  One of them is an award-winning talk in DOES London 2018
                </WorkHighlight>
                )
              </WorkBodyText>
            </Grid>
          </Grid>
        </WorkSection>
        <WorkSection style={SECTION_STYLE3}>
          <Grid container spacing={4} className={BEM.element("center-section")}>
            <Grid item xs={12} md={7}>
              <WorkImage src="tasktop/Usability.png" title="User Research" />
            </Grid>
            <Grid item xs={12} md={5}>
              <WorkH2>User Research</WorkH2>
              <WorkBodyText>
                <WorkHighlight>
                  I initiated and conduct usability testing
                </WorkHighlight>{" "}
                to validate the design decisions, ensuring improved customer
                experience. During the process, we built the participants pool
                for internals where we can easily sample participants for
                usability testing, based on the information we gathered from the
                survey. Also,{" "}
                <WorkHighlight>
                  we started UX guild, a flexible working group that involves
                  people who are interested in the same domain or topic of user
                  experience such as feature design, customer engagement and
                  user research
                </WorkHighlight>
                .
              </WorkBodyText>
            </Grid>
          </Grid>
        </WorkSection>
      </div>
    );
  }
}
