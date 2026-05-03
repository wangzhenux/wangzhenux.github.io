import React, { FormEvent } from "react";
import BemBuilder from "./utils/BemBuilder";
import {
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import WorkH2 from "./components/WorkH2";

const BEM = BemBuilder.create("lock");
const HELP_TEXT = "Please enter password to access.";
const ERROR_TEXT = "You entered wrong password, please re-enter.";

export interface LockProps {
  checkPassword: (pwd: string) => void;
  error: boolean;
}

export interface LockState {
  pwd: string;
  showPassword: boolean;
  helpText: string;
}

class Lock extends React.Component<LockProps, LockState> {
  constructor(props: LockProps) {
    super(props);
    this.state = {
      pwd: "",
      showPassword: false,
      helpText: this.props.error ? ERROR_TEXT : HELP_TEXT,
    };
  }

  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.checkPassword(this.state.pwd);
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    return (
      <div className={BEM.block()}>
        <header className={BEM.element("header")}>
          <img src="logo.png" className={BEM.element("logo")} alt="logo" />
        </header>
        <form onSubmit={this.handleSubmit} className={BEM.element("form")}>
          <Typography variant="body1">Welcome to</Typography>
          <WorkH2 space>Zhen Wang's Portfolio</WorkH2>
          <FormControl
            error={this.props.error}
            className={BEM.element("input")}
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type={this.state.showPassword ? "text" : "password"}
              aria-describedby="password"
              onChange={(e) => this.setState({ pwd: e.target.value })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    className={BEM.element("btn")}
                    aria-label="toggle password visibility"
                    onClick={this.handleClickShowPassword}
                    disableFocusRipple
                    disableRipple
                  >
                    {this.state.showPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                  <IconButton
                    type="submit"
                    color="primary"
                    className={BEM.element("submit-btn")}
                  >
                    <ArrowForwardOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText id="password">{this.state.helpText}</FormHelperText>
            <FormHelperText id="password">
              If you have any issues to access, please{" "}
              <a href="mailto:wangzhen614@gmail.com?subject=Request Access to Zhen Wang's Portfolio">
                contact me
              </a>
              .
            </FormHelperText>
          </FormControl>
        </form>
      </div>
    );
  }
}

export default Lock;
