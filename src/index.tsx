import React from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes, HashRouter } from "react-router-dom";
import "./style/index.scss";
import "react-multi-carousel/lib/styles.css";
import Portfolio from "./Portfolio";
import TechScene from "./works/techscene";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { blue, grey } from "@mui/material/colors";
import Rackspace from "./works/Rackspace";
import Team from "./works/Team";
import ParkEngagement from "./works/ParkEngagement";
import PlotGuru from "./works/PlotGuru";
import ILab from "./works/ILab";
import Citportal from "./works/Citportal";
import Design from "./works/Design";
import Tasktop from "./works/Tasktop";
import ReactGA from "react-ga4";
import Lock from "./Lock";
import Twilio from "./works/Twilio";

ReactGA.initialize("UA-61229289-1");

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: grey,
  },
  // shadows: Shadows.fill("none", 0, 25),
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        body1: {
          opacity: 0.85,
        },
        body2: {
          opacity: 0.85,
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          paddingLeft: "9px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#ffffff",
          borderRadius: "4px",
          boxShadow: "10px 10px 30px #d9d9d9, -10px -10px 30px #ffffff",
        },
      },
    },
  },
});

export interface HomeProps { }

interface State {
  isLocked: boolean;
  error: boolean;
}

class Home extends React.Component<HomeProps, State> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      isLocked: false, //localStorage.getItem("isZWPortfolioLocked") == undefined,
      error: false,
    };
  }

  checkPassword = (pwd: string) => {
    if (pwd.toLowerCase() === "zw-ux-portfolio-91") {
      localStorage.setItem("isZWPortfolioLocked", "true");
      this.setState({ isLocked: false, error: false });
    } else {
      this.setState({ isLocked: true, error: true });
    }
  };

  onUnload = (e) => {
    e.preventDefault();
    localStorage.clear();
  };

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onUnload);
  }


  render() {
    if (this.state.isLocked) {
      return (
        <ThemeProvider theme={theme}>
          <Lock error={this.state.error} checkPassword={this.checkPassword} />
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/techscene" element={<TechScene />} />
            <Route path="/rackspace" element={<Rackspace />} />
            <Route path="/team" element={<Team />} />
            <Route path="/park-engagement" element={<ParkEngagement />} />
            <Route path="/plotGuru" element={<PlotGuru />} />
            <Route path="/ilab" element={<ILab />} />
            <Route path="/citportal" element={<Citportal />} />
            <Route path="/design-misc" element={<Design />} />
            <Route path="/tasktop" element={<Tasktop />} />
            <Route path="/twilio" element={<Twilio />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    );
  }
}

export default Home;

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<Home />);
