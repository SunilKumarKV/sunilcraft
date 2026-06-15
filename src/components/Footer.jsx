import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa";
import "../styles/Footer.css";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/projects" },
  { label: "Problems", to: "/problems" },
  { label: "Codebase", to: "/codebase" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const projectLinks = [
  { label: "SunilCraft", to: "/projects" },
  { label: "coding-journal", to: "/projects" },
  { label: "ChessPlay", to: "/projects" },
  { label: "RainbowCode", to: "/projects" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/SunilKumarKV", icon: <FaGithub /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sunilkumarkv44/", icon: <FaLinkedinIn /> },
  { label: "Email", href: "mailto:sunilkumarkv44@gmail.com", icon: <FaEnvelope /> },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-panel">
        <div className="footer-grid">
          <section className="footer-column footer-brand-column">
            <span className="footer-kicker">SunilCraft</span>
            <h2>Building products and improving every day.</h2>
            <p>Frontend-focused full-stack work, verified code, and real GitHub-backed progress presented in one portfolio system.</p>
          </section>

          <nav className="footer-column" aria-label="Footer navigation">
            <h3>Navigation</h3>
            <ul className="footer-link-list">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="footer-column">
            <h3>Projects</h3>
            <ul className="footer-link-list">
              {projectLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="footer-column">
            <h3>Contact</h3>
            <ul className="footer-link-list footer-contact-list">
              <li><a href="mailto:sunilkumarkv44@gmail.com">sunilkumarkv44@gmail.com</a></li>
              <li><a href="https://www.linkedin.com/in/sunilkumarkv44/" target="_blank" rel="noreferrer">LinkedIn Profile</a></li>
              <li><a href="https://github.com/SunilKumarKV" target="_blank" rel="noreferrer">GitHub Profile</a></li>
            </ul>
          </section>
        </div>

        <div className="footer-bottom">
          <p className="footer-text">© {new Date().getFullYear()} Sunil Kumar K V. All rights reserved.</p>
          <ul className="social-icon" aria-label="Social links">
            {socialLinks.map((item) => (
              <li className="social-icon__item" key={item.label}>
                <a className="social-icon__link" href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
