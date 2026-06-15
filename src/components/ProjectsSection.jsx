import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getJournalProjects, toProjectSlug } from "../lib/codingJournal";
import "../styles/ProjectsSection.css";

export default function ProjectsSection() {
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
        setError(fetchError.message || "Unable to load featured projects.");
        setProjects([]);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const featuredProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
        .slice(0, 6),
    [projects]
  );

  return (
    <section className="projects" id="projects">
      <div className="projects-header">
        <span className="section-eyebrow">Selected Work</span>
        <h2 className="projects-title">Featured Projects</h2>
        <p className="projects-subtitle">
          Live repositories from coding-journal, automatically updated as new projects and GitHub
          metadata change.
        </p>
      </div>

      {loading ? (
        <div className="project-list">
          <article className="project-card">
            <div className="project-info">
              <h3 className="project-title">Loading projects</h3>
              <p className="project-description">Fetching the latest featured repositories from coding-journal.</p>
            </div>
          </article>
        </div>
      ) : error ? (
        <div className="project-list">
          <article className="project-card">
            <div className="project-info">
              <h3 className="project-title">Unable to load projects</h3>
              <p className="project-description">{error}</p>
            </div>
          </article>
        </div>
      ) : !featuredProjects.length ? (
        <div className="project-list">
          <article className="project-card">
            <div className="project-info">
              <h3 className="project-title">No projects available</h3>
              <p className="project-description">coding-journal did not return any repositories.</p>
            </div>
          </article>
        </div>
      ) : (
        <>
          <div className="project-list">
            {featuredProjects.map((project) => (
              <article className="project-card" key={project.url}>
                <div className="project-info">
                  <p className="project-category">{project.language || "Unknown language"}</p>
                  <h3 className="project-title">{project.name}</h3>
                  <p className="project-description">
                    {project.description || "No repository description provided."}
                  </p>
                  <div className="project-actions">
                    <a href={project.url} className="project-link primary" target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                    {project.homepage ? (
                      <a href={project.homepage} className="project-link" target="_blank" rel="noreferrer">
                        Homepage
                      </a>
                    ) : null}
                    <Link to={`/projects/${toProjectSlug(project.name)}`} className="project-link">
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Link to="/projects" className="page-button">
            Explore All Projects
          </Link>
        </>
      )}
    </section>
  );
}
