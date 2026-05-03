import React from "react";
import { Zoom, Fab, Container, Button, Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styled } from "@mui/material/styles";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import BemBuilder from "../utils/BemBuilder";
import AppsIcon from "@mui/icons-material/Apps";

const BEM = BemBuilder.create("bottom-control");

interface ScrollTopProps {
  window?: () => Window;
  children?: React.ReactElement;
}

const ScrollTopRoot = styled(Box)({
  position: "fixed",
  bottom: "46px",
  right: "calc(50% - 20px)",
  zIndex: 1,
});

function ScrollTop(props: ScrollTopProps) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");
    console.log(anchor);
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <ScrollTopRoot onClick={handleClick} role="presentation">
        {children}
      </ScrollTopRoot>
    </Zoom>
  );
}

class BackToTop extends React.Component<ScrollTopProps> {
  constructor(props: ScrollTopProps) {
    super(props);
  }

  renderBackToTop() {
    return (
      <ScrollTop {...this.props}>
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    );
  }

  handleClick = () => {
    const anchor = document.querySelector("#back-to-top-anchor");
    console.log(anchor);
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  renderBottomControl() {
    return (
      <div className={BEM.block()}>
        <Container className={BEM.element("container")}>
          <div className={BEM.element("control")}>
            <Button href="/#" color="inherit">
              <AppsIcon className={BEM.element("icon")} />
              Back to Home
            </Button>
          </div>
          <div className={BEM.element("control")}>
            <Button onClick={() => this.handleClick()} color="inherit">
              <KeyboardArrowUpIcon className={BEM.element("icon")} />
              Back to top
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  render() {
    return this.renderBottomControl();
  }
}

export default BackToTop;
