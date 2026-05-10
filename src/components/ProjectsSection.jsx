import React from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { projectsData } from "../data/projects";
import "../styles/ProjectsSection.css";

const filters = ["All", "React", "Full-stack", "JavaScript", "UI"];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" } }),
};

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const filteredProjects = useMemo(
    () => activeFilter === "All" ? projectsData : projectsData.filter((project) => project.category === activeFilter),
    [activeFilter]
  );

  return (
    <section className="projects" id="projects">
      <div className="projects-header">
        <span className="section-eyebrow">Selected Work</span>
        <h2 className="projects-title">Featured Projects</h2>
        <p className="projects-subtitle">Real deployed URLs, responsive layouts, clean interfaces, and practical full-stack/front-end implementation.</p>
      </div>

      <div className="featured-banner">
        <span>Featured</span>
        <strong>ChessPlay</strong>
        <p>React + Node + Socket.IO + MongoDB + Stockfish chess platform.</p>
        <a href="https://chessplay1.vercel.app/" target="_blank" rel="noreferrer">Open ChessPlay</a>
      </div>

      <div className="filter-tabs" aria-label="Project filters">
        {filters.map((filter) => (
          <button key={filter} type="button" className={activeFilter === filter ? "active" : ""} onClick={() => setActiveFilter(filter)}>{filter}</button>
        ))}
      </div>

      <div className="project-list">
        {filteredProjects.map((proj, idx) => (
          <motion.article className="project-card" key={proj.title} custom={idx} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={cardVariants} whileHover={{ y: -8 }}>
            <div className="project-image-wrap">
              <img src={proj.image} alt={`${proj.title} preview screenshot`} className="project-image" loading="lazy" />
              <span className="project-status">{proj.status}</span>
            </div>
            <div className="project-info">
              <p className="project-category">{proj.stack}</p>
              <h3 className="project-title">{proj.title}</h3>
              <p className="project-description">{proj.description}</p>
              <div className="project-actions">
                <a href={proj.live} className="project-link primary" target="_blank" rel="noreferrer">Live Demo <FaExternalLinkAlt aria-hidden="true" /></a>
                <a href={proj.github} className="project-link" target="_blank" rel="noreferrer">Code <FaGithub aria-hidden="true" /></a>
                <Link to={`/projects/${proj.slug}`} className="project-link">Details</Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
