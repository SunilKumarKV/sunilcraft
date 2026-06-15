import React from "react";
import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa";
import "../styles/Footer.css";

const openToItems = [
  "Remote internships",
  "Part-time roles",
  "Freelance frontend/full-stack work",
];

const connectLinks = [
  { label: "GitHub", href: "https://github.com/SunilKumarKV", icon: <FaGithub /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sunilkumarkv44/", icon: <FaLinkedinIn /> },
  { label: "Email", href: "mailto:sunilkumarkv44@gmail.com", icon: <FaEnvelope /> },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-shell">
        <div className="footer-grid">
          <section className="footer-column footer-brand-column">
            <span className="footer-kicker">SunilCraft</span>
            <h2>Sunil Kumar K V</h2>
            <p>Building products and improving every day.</p>
          </section>

          <section className="footer-column">
            <h3>Open To</h3>
            <ul className="footer-link-list">
              {openToItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="footer-column">
            <h3>Connect</h3>
            <ul className="footer-link-list footer-connect-list">
              {connectLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target={item.href.startsWith("mailto:") ? undefined : "_blank"} rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}>
                    <span className="footer-link-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="footer-bottom">
          <p className="footer-text">© {new Date().getFullYear()} Sunil Kumar K V</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
