import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { projectsData } from "../data/projects";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projectsData.find((item) => item.slug === slug);

  if (!project) {
    return (
      <main className="state-page">
        <h1>Project not found</h1>
        <Link to="/projects" className="hero-button">Back to Projects</Link>
      </main>
    );
  }

  return (
    <main className="project-detail-page">
      <Link to="/projects" className="problem-back">← Back to Projects</Link>
      <section className="project-detail-hero">
        <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" />
        <div>
          <span className="project-status">{project.status}</span>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <p className="project-category">{project.stack}</p>
          <div className="project-actions">
            <a href={project.live} className="project-link primary" target="_blank" rel="noreferrer">Live Demo <FaExternalLinkAlt /></a>
            <a href={project.github} className="project-link" target="_blank" rel="noreferrer">Code <FaGithub /></a>
          </div>
        </div>
      </section>
      <section className="section-panel">
        <h2>Highlights</h2>
        <div className="feature-grid">
          {project.highlights.map((item) => <article className="glass-card" key={item}>{item}</article>)}
        </div>
      </section>
    </main>
  );
}
