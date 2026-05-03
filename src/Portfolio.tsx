import React from "react";
import BemBuilder from "./utils/BemBuilder";
import { Container } from "@mui/material";
import { AntTabs, AntTab } from "./components/StyledTab";
import { WORKS, WORK } from "./models/work";
import WorkBox from "./components/WorkBox";
import Footer from "./footer";
import About from "./about";
import ReactGA from "react-ga4";

const BEM = BemBuilder.create("App");

export interface PortfolioProps {}

export interface PortfolioState {
  tabValue: string;
  works: WORK[];
}

class Portfolio extends React.Component<PortfolioProps, PortfolioState> {
  state = {
    tabValue: "all",
    works: WORKS,
  };

  onTabChange = (value: string) => {
    this.setState({
      tabValue: value,
      works:
        value === "all"
          ? WORKS
          : WORKS.map((w) => {
              if (!w.category.find((c) => c.id === value)) {
                return {
                  ...w,
                  visible: false,
                };
              }
              return w;
            }),
    });
  };

  render() {
    ReactGA.send({ hitType: "pageview", page: window.location.hash });

    return (
      <div className={BEM.block()}>
        <header className={BEM.element("header")}>
          <img src="logo.png" className={BEM.element("logo")} alt="logo" />
        </header>
        <Container>
          <AntTabs
            value={this.state.tabValue}
            centered={true}
            onChange={(e, v) => this.onTabChange(v)}
            style={{ marginBottom: "1em" }}
          >
            <AntTab label="All" value="all" />
            <AntTab label="UX" value="ux" />
            <AntTab label="Design" value="design" />
            <AntTab label="Develop" value="develop" />
          </AntTabs>
        </Container>
        <Container>
          <div className={BEM.element("content")}>
            {this.state.works.map((w, i) => (
              <WorkBox work={w} key={i} />
            ))}
          </div>
        </Container>
        <About />
        <Footer />
      </div>
    );
  }
}

export default Portfolio;
