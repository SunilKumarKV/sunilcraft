import React from "react";
import { motion } from "framer-motion";
import "../styles/AboutSection.css";
import profilePic from "/assets/images/profile.png";

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
        <h2 className="about-title">About Me</h2>

        <p className="about-description">
          Hello! I’m <strong>Sunil Kumar</strong>, a passionate front-end React
          developer from India. I love building clean, responsive, and
          user-friendly web applications with React, JavaScript, and modern UI
          frameworks.
          <br />
          My strengths are in pixel-perfect UI design, component-based
          architecture, and integrating APIs for dynamic data-driven apps. I’m
          constantly learning and experimenting with new technologies.
          <br />
          <strong>Skills:</strong> React, JavaScript, HTML5, CSS3, Vite, Git,
          Framer Motion.
        </p>
        <div className="about-details">
          <div className="about-card">
            <h3>50+</h3>
            <p>Projects Completed</p>
          </div>
          <div className="about-card">
            <h3>30</h3>
            <p>Happy Clients</p>
          </div>
          <div className="about-card">
            <h3>2+</h3>
            <p>Years Experience</p>
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
        <img src={profilePic} alt="About Me" />
      </motion.div>
    </section>
  );
};

export default AboutSection;
