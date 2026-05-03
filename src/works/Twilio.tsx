import * as React from "react";
import Spinning from "../components/Spinning";
import WorkHeader from "../components/WorkHeader";
import { WORKBEM } from "../components/WorkWithDetails";
import WorkImage from "../components/WorkImage";
import { AntTabs, AntTab } from "../components/StyledTab";
import TwilioOnboarding from "./TwilioOnboarding";
import TwilioOthers from './TwilioOthers';

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
    label: "Onboarding",
    value: "onboarding",
    work: <TwilioOnboarding />,
  },
  {
    label: "Other works",
    value: "more",
    work: <TwilioOthers />,
  },
];

interface TwilioProps {}

class Twilio extends React.Component<TwilioProps, State> {
  constructor(props: TwilioProps) {
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
        <div className={WORKBEM.block("twilio")}>
          <WorkHeader
            style={{
              color: "initial",
              padding: "8em 0"
              // backgroundImage:
              //   "linear-gradient(to top, #ffffff, #effcff, #d0fdff, #b9fef3, #c3f9c9)"
            }}
            logo={
              <WorkImage
                src="twilio/Twilio-logo-red.png"
                title="Twilio Logo"
                spaced
                style={{ width: 200 }}
              />
            }
            subtitle={
              <div>
                At Twilio, I dedicated my effort to delivering an excellent global user experience through initiatives such as regional/international onboarding and expanding the availability of Twilio Regions for more products.
              </div>
            }
            roles="Product Designer"
            practices="Strategic Thinking • Workshops • RAPID • Cross-team Collaboration"
            headerImage={
              <WorkImage src="twilio/twilio_cover.svg" title="Twilio Cover" />
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

export default Twilio;
