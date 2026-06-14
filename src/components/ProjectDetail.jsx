import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  formatDate,
  getJournalProjects,
  toProjectSlug,
} from "../lib/codingJournal";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    getJournalProjects()
      .then((data) => {
        if (ignore) return;
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((fetchError) => {
        if (ignore) return;
        setError(fetchError.message || "Unable to load project detail from coding-journal.");
        setProjects([]);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const project = useMemo(
    () => projects.find((item) => toProjectSlug(item.name) === slug) || null,
    [projects, slug]
  );

  if (loading) {
    return (
      <main className="state-page">
        <h1>Loading project detail</h1>
        <Link to="/projects" className="hero-button">Back to Projects</Link>
      </main>
    );
  }

  if (error) {
    return (
      <main className="state-page">
        <h1>Unable to load project</h1>
        <p>{error}</p>
        <Link to="/projects" className="hero-button">Back to Projects</Link>
      </main>
    );
  }

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
        <div>
          <span className="project-status">{project.language || "Unknown"}</span>
          <h1>{project.name}</h1>
          <p>{project.description || "No repository description provided."}</p>
          <p className="project-category">
            Stars: {project.stars || 0} • Forks: {project.forks || 0} • Updated: {formatDate(project.updatedAt) || "Unknown"}
          </p>
          <div className="project-actions">
            <a href={project.url} className="project-link primary" target="_blank" rel="noreferrer">GitHub</a>
            {project.homepage ? (
              <a href={project.homepage} className="project-link" target="_blank" rel="noreferrer">Homepage</a>
            ) : null}
          </div>
        </div>
      </section>
      <section className="section-panel">
        <h2>Topics</h2>
        <div className="feature-grid">
          {(project.topics || []).length ? (
            project.topics.map((item) => (
              <article className="glass-card" key={item}>
                <h3>{item}</h3>
                <p>Live repository topic synced from coding-journal.</p>
              </article>
            ))
          ) : (
            <article className="glass-card">
              <h3>No topics added</h3>
              <p>This repository does not currently expose GitHub topics in coding-journal.</p>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
