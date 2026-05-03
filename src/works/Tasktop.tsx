import * as React from "react";
import Spinning from "../components/Spinning";
import WorkHeader from "../components/WorkHeader";
import WorkSection from "../components/WorkSection";
import { WORKBEM } from "../components/WorkWithDetails";
import WorkImage from "../components/WorkImage";
import { AntTabs, AntTab } from "../components/StyledTab";
import TasktopOthers from "./TasktopOthers";
import TasktopViz from "./TasktopViz";
import TasktopHub from "./TasktopHub";
import DesignIcon from "../components/DesignIcon";
import PrototypeIcon from "../components/PrototypeIcon";
import VisualizationIcon from "../components/VisualizationIcon";
import CodingIcon from "../components/CodingIcon";
import WorkHeaderLists, { Item } from "../components/WorkHeaderLists";

interface WorkTab {
  label: string;
  value: string;
  work: React.ReactNode;
}

interface State {
  activeTab: WorkTab;
}

const TABS: WorkTab[] = [
  {
    label: "Hub",
    value: "hub",
    work: <TasktopHub />,
  },
  {
    label: "Viz",
    value: "viz",
    work: <TasktopViz />,
  },
  {
    label: "More",
    value: "more",
    work: <TasktopOthers />,
  },
];

const ROLES: Item[] = [
  {
    icon: <PrototypeIcon />,
    title: "Feature Design",
    description: (
      <span>
        Lead feature designer in charge of 2 main products from Tasktop (
        <a href="https://www.tasktop.com/integration-hub" target="_blank">
          Hub
        </a>{" "}
        &{" "}
        <a href="https://www.tasktop.com/viz" target="_blank">
          Viz
        </a>
        , both are enterprise software).
      </span>
    ),
  },
  {
    icon: <VisualizationIcon />,
    title: "Visualization / Illustration",
    description:
      "Visualize and illustrate the concepts to help users understand the product better in a more intuitive way.",
  },
  {
    icon: <DesignIcon />,
    title: "Presentation Design",
    description:
      "Collaborate with the leadership team to create and design presentations for various talks and conferences.",
  },
  {
    icon: <CodingIcon />,
    title: "Front-end Development",
    description:
      "Work with engineering to build the user interface of the new product, using React TypeScript, HTML, SCSS.",
  },
];

interface TasktopProps {}

class Tasktop extends React.Component<TasktopProps, State> {
  constructor(props: TasktopProps) {
    super(props);
  }

  myRef = React.createRef<HTMLDivElement>();

  state: State = {
    activeTab: TABS[0],
  };

  onTabChange = (value: string) => {
    this.scrollToMyRef();
    this.setState({
      activeTab: TABS.filter((t) => t.value === value)[0],
    });
  };

  scrollToMyRef = () =>
    window.scrollTo({ top: this.myRef.current!.offsetTop, behavior: "smooth" });

  render() {
    return (
      <Spinning>
        <div className={WORKBEM.block("tasktop")}>
          <WorkHeader
            style={{
              color: "initial",
              // backgroundImage:
              //   "linear-gradient(to top, #ffffff, #effcff, #d0fdff, #b9fef3, #c3f9c9)"
            }}
            logo={
              <WorkImage
                src="tasktop/tasktop_logo.png"
                title="Tasktop Logo"
                spaced
                style={{ width: 256 }}
              />
            }
            subtitle={
              <div>
                <WorkHeaderLists items={ROLES} />
              </div>
            }
            roles="Senior UX Designer • Design Lead • Front-end Developer •  UX Researcher"
            practices="Project Management • Team / Cross-team Cooperation • Product Delivery • CI/CD"
            headerImage={
              <WorkImage
                src="tasktop/illustration.svg"
                title="From undraw.co"
                showCaption
              />
            }
            noShadow
          />
          <AntTabs
            value={this.state.activeTab.value}
            centered={true}
            onChange={(_, v) => this.onTabChange(v)}
            className={WORKBEM.element("tabs")}
          >
            {TABS.map((t) => (
              <AntTab key={t.label} label={t.label} value={t.value} />
            ))}
          </AntTabs>
          <div ref={this.myRef}></div>
          {this.state.activeTab.work}
        </div>
      </Spinning>
    );
  }
}

export default Tasktop;
