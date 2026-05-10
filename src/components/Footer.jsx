import React from "react";
import { FaGithub, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "../styles/Footer.css";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/SunilKumarKV", icon: <FaGithub /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sunilkumarkv44/", icon: <FaLinkedinIn /> },
  { label: "X", href: "https://x.com/Sunil_KVB", icon: <FaTwitter /> },
  { label: "Instagram", href: "https://www.instagram.com/kaiser2op/", icon: <FaInstagram /> },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <p className="footer-brand">SunilCraft</p>
        <ul className="social-icon" aria-label="Social links">
          {socialLinks.map((item) => (
            <li className="social-icon__item" key={item.label}>
              <a className="social-icon__link" href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                {item.icon}
              </a>
            </li>
          ))}
        </ul>
        <p className="footer-text">© {new Date().getFullYear()} Sunil Kumar K V. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
