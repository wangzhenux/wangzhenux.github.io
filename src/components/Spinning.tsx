import React, { ReactNode } from "react";
import BemBuilder from "../utils/BemBuilder";
import { CircularProgress } from "@mui/material";
import Footer from "../footer";
import BackToTop from "./BackToTop";
import ReactGA from "react-ga4";

const BEM = BemBuilder.create("spinning");

export interface SpinningProps {
  timeout?: number;
  children?: ReactNode;
}

export interface SpinningState {
  loading: boolean;
}

class Spinning extends React.Component<SpinningProps, SpinningState> {
  constructor(props: SpinningProps) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    setTimeout(
      () =>
        this.setState({
          loading: false,
        }),
      this.props.timeout ? this.props.timeout : 1000
    );
  }

  render() {
    ReactGA.send({ hitType: "pageview", page: window.location.hash });
    return this.state.loading ? (
      <CircularProgress className={BEM.block()} />
    ) : (
      <div>
        <div id="back-to-top-anchor" />
        {this.props.children}
        <BackToTop />
        <Footer />
      </div>
    );
  }
}

export default Spinning;
