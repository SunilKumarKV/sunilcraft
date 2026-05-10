import React from "react";
import { motion } from "framer-motion";
import AboutSection from "./AboutSection.jsx";
import ProjectsSection from "./ProjectsSection.jsx";
import SkillsSection from "./SkillsSection.jsx";
import ServicesSection from "./ServicesSection.jsx";
import TimelineSection from "./TimelineSection.jsx";
import TestimonialsSection from "./TestimonialsSection.jsx";
import ContactSection from "./ContactSection.jsx";
import HeroPic from "/assets/images/pic.png";
import { profile } from "../data/profile";
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
          <span className="availability-badge">● {profile.status}</span>
          <h4 className="hero-subtitle">Hi, I'm</h4>
          <h1 className="hero-title">{profile.name}</h1>
          <p className="hero-description">
            {profile.role}. I build production-ready React apps, clean UI/UX,
            learning platforms, coding problem pages, and real-world full-stack projects.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="hero-button">See My Work</a>
            <a href={profile.resumeUrl} className="hero-button secondary" download>Download Resume</a>
            <a href={profile.github} className="hero-button secondary" target="_blank" rel="noreferrer">GitHub</a>
          </div>

          <div className="hero-stats" aria-label="Portfolio stats">
            <span><strong>6+</strong> Projects</span>
            <span><strong>60+</strong> Problems</span>
            <span><strong>MCA</strong> Student</span>
          </div>
        </motion.div>

        <div className="hero-image">
          <img src={HeroPic} alt="Sunil Kumar K V profile" loading="eager" />
        </div>
      </section>

      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <SkillsSection />
      <TimelineSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
