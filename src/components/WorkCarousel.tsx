import * as React from "react";
import { makeStyles } from '@mui/styles';
import { Theme, createStyles } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import WorkImage from "./WorkImage";
import BemBuilder from "../utils/BemBuilder";

const BEM = BemBuilder.create("work-carousel");

export interface ImageStep {
  label: string;
  imgPath: string;
}

interface WorkCarouselProps {
  imgs: ImageStep[];
}
interface WorkCarouselStates {
  activeStep: number;
}

const useCarouselStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    header: {
      display: "flex",
      alignItems: "center",
      height: 50,
      paddingLeft: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
    },
    img: {
      height: 255,
      overflow: "hidden",
      display: "block",
      width: "100%",
    },
  })
);

class WorkCarousel extends React.Component<
  WorkCarouselProps,
  WorkCarouselStates
> {
  constructor(props: WorkCarouselProps) {
    super(props);

    this.state = {
      activeStep: 0,
    };
  }

  handleNext = (maxSteps: number) => {
    if (this.state.activeStep < maxSteps - 1) {
      this.setState({
        activeStep: this.state.activeStep + 1,
      });
    } else {
      this.setState({
        activeStep: 0,
      });
    }
  };

  handleBack = () => {
    if (this.state.activeStep > 0) {
      this.setState({
        activeStep: this.state.activeStep - 1,
      });
    }
  };

  render() {
    const activeStep = this.state.activeStep;
    const images = this.props.imgs;
    const maxSteps = images.length;

    return (
      <div className={BEM.block()}>
        <Paper
          square
          elevation={0}
          style={{
            display: "flex",
            alignItems: "center",
            height: 48,
          }}
        >
          <Typography>{images[activeStep].label}</Typography>
        </Paper>
        <div style={{ padding: "10px", background: "#f1f1f1" }}>
          <WorkImage
            src={images[activeStep].imgPath}
            title={images[activeStep].label}
            width="100%"
          />
        </div>
        <div className={BEM.element("stepper")}>
          <div
            className={BEM.element("step-back")}
            onClick={this.handleBack}
            title="Click to Go Back"
          >
            <Button
              size="small"
              onClick={this.handleBack}
              disabled={activeStep === 0}
            >
              <KeyboardArrowLeft />
            </Button>
          </div>
          <div
            className={BEM.element("step-next")}
            onClick={() => this.handleNext(maxSteps)}
            title="Click to Go Next"
          >
            <Button size="small" disabled={activeStep === maxSteps - 1}>
              <KeyboardArrowRight />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default WorkCarousel;
