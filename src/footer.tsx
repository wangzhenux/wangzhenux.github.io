import React from "react";
import { Container } from "@mui/material";
import BemBuilder from "./utils/BemBuilder";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faWindowMaximize,
} from "@fortawesome/free-solid-svg-icons";

interface SOCIAL {
  id: string;
  url: string;
  icon: React.ReactNode;
}
const BEM = BemBuilder.create("footer");
const SOCIALS: SOCIAL[] = [
  {
    id: "Email",
    url: "mailto:wangzhen614@gmail.com",
    icon: <FontAwesomeIcon icon={faEnvelope} />,
  },
  {
    id: "Portfolio",
    url: "/",
    icon: <FontAwesomeIcon icon={faWindowMaximize} />,
  },
  {
    id: "LinkedIn",
    url: "https://www.linkedin.com/in/zhenwang614",
    icon: <FontAwesomeIcon icon={faLinkedin} />,
  },
  {
    id: "Instagram",
    url: "https://www.instagram.com/zhen.wang/",
    icon: <FontAwesomeIcon icon={faInstagram} />,
  },
];
export interface FooterProps {}

class Footer extends React.Component<FooterProps> {
  render() {
    return (
      <footer className={BEM.block()}>
        <Container>
          <div className={BEM.element("logo")}>
            <img src="logo-white.png" className={BEM.element("footer-logo")} />
          </div>
          <div className={BEM.element("copyright-text")}>
            Copyright © {new Date().getFullYear()}{" "}
            <Link to="/" className={BEM.element("link")}>
              Zhen Wang
            </Link>
          </div>
          <div className={BEM.element("socials")}>
            {SOCIALS.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                title={s.id}
                className={BEM.element("social")}
              >
                <span>{s.icon}</span>
              </a>
            ))}
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
