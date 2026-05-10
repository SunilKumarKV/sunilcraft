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
          Hello! I’m <strong>Sunil Kumar K V</strong>, a full-stack and front-end
          developer from India. I build clean, responsive, and user-friendly
          applications using React, JavaScript, Node.js, Express, and modern UI
          tools.
          <br />
          I am currently studying MCA and improving production-level project
          skills through real deployments like SunilCraft, ChessPlay, and
          DevWithSunil. My strengths are component-based architecture, UI/UX
          improvement, API integration, debugging, and learning in public.
          <br />
          <strong>Skills:</strong> React, JavaScript, HTML5, CSS3, Tailwind CSS,
          Node.js, Express, MongoDB, Git, Vite, Framer Motion.
        </p>
        <div className="about-details">
          <div className="about-card">
            <h3>10+</h3>
            <p>Projects Built</p>
          </div>
          <div className="about-card">
            <h3>3+</h3>
            <p>Live Deployments</p>
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
