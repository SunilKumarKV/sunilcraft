import React from "react";
import { motion } from "framer-motion";
import { profile, services } from "../data/profile";
import Badge from "./ui/Badge";
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
        <div className="card-row about-badges">
          <Badge tone="accent">{profile.location}</Badge>
          <Badge>MCA Journey</Badge>
          <Badge tone="success">Production Focus</Badge>
        </div>
        <h2 className="about-title">Building thoughtful interfaces with engineering depth</h2>

        <p className="about-description">
          Hello! I&apos;m <strong>{profile.name}</strong>, a developer from India who likes turning
          ambitious ideas into clean interfaces, practical full-stack features, and transparent
          developer systems. SunilCraft now sits at the center of that work: portfolio storytelling,
          coding-journal sync, verified solutions, and engineering dashboards in one place.
        </p>
        <p className="about-description">
          My strongest areas are frontend architecture, UI/UX refinement, routing and state cleanup,
          API integration, debugging, and shipping improvements that make products feel calmer and
          more intentional. I&apos;m especially motivated by projects that need both polish and
          structure.
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
            <h3>10+</h3>
            <p>Projects built and iterated</p>
          </div>
          <div className="about-card">
            <h3>3+</h3>
            <p>Live deployments maintained</p>
          </div>
          <div className="about-card">
            <h3>2+</h3>
            <p>Years of hands-on growth</p>
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
          <img src={profilePic} alt="About Me" />
          <div className="about-image-note">
            <strong>{profile.role}</strong>
            <span>Clean UI, reliable routing, live developer data, and product-minded iteration.</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
