import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import BemBuilder from "../utils/BemBuilder";
import ImageModal from "./ImageModal";

const BEM = BemBuilder.create("image-grid");

interface Props {}

interface State {
  cols: number;
  data: any;
  isVisible: boolean;
}

export default class ImageGrid extends React.Component<Props, State> {
  state: State = {
    cols: 4,
    data: [],
    isVisible: false,
  };

  myRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    fetch("data.json")
      .then((response) => response.json())
      .then((response) =>
        this.setState({
          data: response.photos.data,
        })
      )
      .catch((error) => console.log(error));

    this.updateSize();
    window.addEventListener("resize", this.updateSize.bind(this));
    window.addEventListener("load", this.updateSize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateSize);
    window.removeEventListener("load", this.updateSize);
  }

  updateSize() {
    if (this.myRef && this.myRef.current) {
      if (this.myRef.current.clientWidth < 600) {
        this.setState({
          cols: 1,
        });
      } else {
        this.setState({
          cols: 4,
        });
      }
    }
  }

  render() {
    const IMAGE_DATA = this.state.data;

    return (
      <div className={BEM.block()} ref={this.myRef}>
        <ImageList
          rowHeight={200}
          className={BEM.element("list")}
          cols={this.state.cols}
        >
          {IMAGE_DATA.map((tile) => (
            <ImageListItem
              key={tile.img}
              cols={tile.cols || 1}
              className={BEM.element("item")}
            >
              <ImageModal src={tile.img} title={tile.title} />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    );
  }
}
