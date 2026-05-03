import * as React from "react";
import BemBuilder from "../utils/BemBuilder";
import ReactCompareImage from "react-compare-image";
import { Typography } from "@mui/material";

const BEM = BemBuilder.create("image-comparison");

export interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  width: number;
  ratio: number;
  beforeLabel: string;
  afterLabel: string;
  caption?: React.ReactNode;
}

class ImageComparison extends React.Component<ImageComparisonProps> {
  constructor(props: ImageComparisonProps) {
    super(props);
  }

  render() {
    return (
      <div className={BEM.block()}>
        <div
          style={{
            width: this.props.width,
            maxWidth: "100%",
          }}
        >
          <ReactCompareImage
            leftImage={this.props.beforeImage}
            rightImage={this.props.afterImage}
            leftImageLabel={this.props.beforeLabel}
            rightImageLabel={this.props.afterLabel}
            sliderLineColor="#2196f3"
          />
        </div>
        <span className={BEM.element("caption")}>
          <Typography variant="overline" display="block">
            {this.props.caption}
          </Typography>
        </span>
      </div>
    );
  }
}

export default ImageComparison;
