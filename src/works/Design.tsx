import * as React from "react";
import Spinning from "../components/Spinning";
import { Typography } from "@mui/material";
import WorkH1 from "../components/WorkH1";
import WorkHeader from "../components/WorkHeader";
import WorkSection from "../components/WorkSection";
import { WORKBEM } from "../components/WorkWithDetails";
import WorkImage from "../components/WorkImage";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ImageGrid from "../components/ImageGrid";
import WorkCard from "../components/WorkCard";

export interface DesignProps {}

class Design extends React.Component<DesignProps> {
  render() {
    return (
      <Spinning>
        <div className={WORKBEM.block("design")}>
          <WorkHeader
            className="design"
            logo={<Typography variant="h3">Design Misc.</Typography>}
            subtitle="Enjoy my life with design and photography"
            roles="Designer • Photographer • Writer"
            practices="Design • Photography • Writing"
            headerImage={
              <WorkImage
                src="previews/new/design.png"
                title="Design"
                width="100%"
              />
            }
            noShadow
          />
          <WorkSection>
            <WorkH1 align="center" spaced>
              Blog Post
            </WorkH1>
            <div className={WORKBEM.element("cards", "3")}>
              <WorkCard
                avatar={<DescriptionOutlinedIcon />}
                title={
                  <a
                    href="https://medium.com/@wangzhen614/optimizing-ux-how-to-set-up-your-own-usability-testing-program-in-house-8cd059e6911c"
                    target="_blank"
                    className={WORKBEM.element("blog-title")}
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
                  <div className={WORKBEM.element("quotes")}>
                    Testing Tasktop Integration Hub’s user experience is a
                    rather complex undertaking. As my colleague Rebecca
                    explained in her blog last week, “Tasktop suffers from an
                    interesting, almost paradoxical problem: the users who
                    benefit most from our product often have no idea that it
                    exists”. To address this problem, we devised a Usability
                    Testing Program — which, as a smaller company — presented us
                    with some interesting challenges.
                  </div>
                }
              />
              <WorkCard
                avatar={<DescriptionOutlinedIcon />}
                title={
                  <a
                    href="https://medium.com/@Tasktop/why-you-should-bring-the-ux-designer-closer-to-the-product-development-action-56a917f7e292"
                    target="_blank"
                    className={WORKBEM.element("blog-title")}
                  >
                    Why you should bring the UX Designer closer to the Product
                    Development action
                  </a>
                }
                media={{
                  src:
                    "https://miro.medium.com/max/1522/0*_DrCON5ojuX3Fagg.png",
                  title:
                    "Why you should bring the UX Designer closer to the Product Development action",
                }}
                subheader="Blog Written by Zhen Wang"
                content={
                  <div className={WORKBEM.element("quotes")}>
                    Given the crucial role that UX design plays in delivering
                    software that delights end users, it’s important that the UX
                    designer is brought in as early as possible during a
                    product’s development. In doing so, a better software
                    product can be built — as well as delivered faster — to
                    accelerate the value delivery to the customer. Here we
                    describe how Tasktop has changed our own process to bring UX
                    design even closer to the product team.
                  </div>
                }
              />
              <WorkCard
                avatar={<DescriptionOutlinedIcon />}
                title={
                  <a
                    href="https://medium.com/@Tasktop/a-day-in-the-life-of-a-solo-ux-designer-at-a-software-company-36e9b14cf945"
                    target="_blank"
                    className={WORKBEM.element("blog-title")}
                  >
                    A Day In The Life: of a solo UX Designer at a software
                    company
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
                  <div className={WORKBEM.element("quotes")}>
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
          <WorkSection>
            <WorkH1 align="center" spaced>
              Photography & Paintings
            </WorkH1>
            <ImageGrid />
          </WorkSection>
        </div>
      </Spinning>
    );
  }
}

export default Design;
