import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa";
import "../styles/Footer.css";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/SunilKumarKV", icon: <FaGithub /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sunilkumarkv44/", icon: <FaLinkedinIn /> },
  { label: "Email", href: "mailto:sunilkumarkv9535@gmail.com", icon: <FaEnvelope /> },
];

const quickLinks = [
  { label: "Work", to: "/projects" },
  { label: "Projects", to: "/projects" },
  { label: "Problems", to: "/problems" },
  { label: "Codebase", to: "/codebase" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const focusItems = [
  "MCA @ Bangalore University",
  "React",
  "Node.js",
  "TypeScript",
  "Frontend Engineering",
];

const openToItems = [
  "Remote Internships",
  "Part-Time Roles",
  "Freelance Projects",
];

const contactLinks = [
  { label: "Email", href: "mailto:sunilkumarkv9535@gmail.com", icon: <FaEnvelope /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sunilkumarkv44/", icon: <FaLinkedinIn /> },
  { label: "GitHub", href: "https://github.com/SunilKumarKV", icon: <FaGithub /> },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-shell">
        <div className="footer-grid">
          <section className="footer-column footer-brand-column">
            <span className="footer-kicker">SunilCraft</span>
            <h2>SunilCraft</h2>
            <div className="footer-role-list" aria-label="Role focus">
              <span>Frontend Developer</span>
              <span>React Developer</span>
              <span>Full Stack Developer</span>
            </div>
            <p>Building products, solving problems, and sharing my journey publicly.</p>
            <div className="footer-social-row">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
                  className="footer-social-chip"
                >
                  <span className="footer-link-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-link-list">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="footer-nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="footer-column">
            <h3>Current Focus</h3>
            <ul className="footer-link-list footer-focus-list">
              {focusItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="footer-column">
            <h3>Open To</h3>
            <ul className="footer-link-list footer-open-list">
              {openToItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ul className="footer-link-list footer-connect-list">
              {contactLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
                  >
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
