import React, { PureComponent, ReactNode } from "react";
import BemBuilder from "../utils/BemBuilder";
import { Skeleton } from "@mui/material";

const BEM = BemBuilder.create("skeleton");

export interface SkeletonProps {
  timeout: number;
  children?: ReactNode;
}

export interface SkeletonState {
  loading: boolean;
}

class StyledSkeleton extends React.Component<SkeletonProps, SkeletonState> {
  constructor(props: SkeletonProps) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    setTimeout(
      () =>
        this.setState({
          loading: false
        }),
      this.props.timeout
    );
  }

  render() {
    return this.state.loading ? <Skeleton /> : this.props.children;
  }
}

export default StyledSkeleton;
