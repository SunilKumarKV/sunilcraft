import React from "react";
import { motion } from "framer-motion";
import AboutSection from "./AboutSection.jsx";
import ProjectsSection from "./ProjectsSection.jsx";
import SkillsSection from "./SkillsSection.jsx";
import ContactSection from "./ContactSection.jsx";
import HeroPic from "../assets/images/pic.png";
import "../styles/HeroSection.css";

export default function HeroSection() {
  return (
    <>
      <section className="hero" id="home">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="hero-subtitle">Hi, I'm</h4>
          <h1 className="hero-title">Sunil Kumar K V</h1>
          <p className="hero-description">
            UX Designer & Frontend Developer passionate about immersive
            experiences and clean, functional code.
          </p>
          <a href="#projects" className="hero-button">
            See My Work
          </a>

          <div className="scroll-indicator">
            <span></span>
          </div>
        </motion.div>

        <div className="hero-image">
          <img src={HeroPic} alt="Profile" />
        </div>
      </section>

      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
