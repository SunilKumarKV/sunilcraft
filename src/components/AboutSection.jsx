import React from "react";
import { motion } from "framer-motion";
import { profile, services } from "../data/profile";
import Badge from "./ui/Badge";
import "../styles/AboutSection.css";
import profilePic from "/assets/images/SunilKumar.JPG";

const AboutSection = () => {
  return (
    <section className="about" id="about">
      <motion.div
        className="about-content"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="card-row about-badges">
          <Badge tone="accent">{profile.location}</Badge>
          <Badge>MCA at Bangalore University</Badge>
          <Badge tone="success">Open to remote work</Badge>
        </div>
        <h2 className="about-title">I build practical web apps while growing into stronger frontend and full-stack work</h2>

        <p className="about-description">
          I&apos;m <strong>{profile.name}</strong>, an MCA student at Bangalore University who moved from a non-software work background into web development through steady project building, coding practice, and learning in public. SunilCraft is where that work is documented in a way recruiters and clients can actually inspect.
        </p>
        <p className="about-description">
          I enjoy frontend implementation, UI cleanup, responsive layout work, React architecture, API integration, debugging, and the kind of product thinking that turns a rough idea into something usable. I&apos;m currently looking for remote internships, part-time roles, and freelance web app work where I can keep shipping and improving.
        </p>

        <div className="about-pillars">
          {services.slice(0, 4).map((service) => (
            <article className="about-pillar" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>

        <div className="about-details">
          <div className="about-card">
            <h3>React</h3>
            <p>Frontend systems, dashboards, and portfolio interfaces</p>
          </div>
          <div className="about-card">
            <h3>Node.js</h3>
            <p>Workflow APIs, data sync, and practical full-stack support</p>
          </div>
          <div className="about-card">
            <h3>GitHub + coding-journal</h3>
            <p>Real projects, verified solutions, and source-backed proof</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="about-image"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
      >
        <div className="about-image-frame">
          <img src={profilePic} alt="Sunil Kumar K V" />
          <div className="about-image-note">
            <strong>{profile.role}</strong>
            <span>Clean UI, reliable implementation, and real portfolio proof backed by synced project data.</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
