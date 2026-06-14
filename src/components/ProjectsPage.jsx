import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DeveloperMetrics from "./DeveloperMetrics";
import {
  formatDate,
  getJournalProjects,
  toProjectSlug,
  uniqueValues,
} from "../lib/codingJournal";

const sortOptions = {
  newest: (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
  stars: (a, b) => (b.stars || 0) - (a.stars || 0) || a.name.localeCompare(b.name),
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("All");
  const [topic, setTopic] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
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
        setError(fetchError.message || "Unable to load projects from coding-journal.");
        setProjects([]);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const languages = useMemo(
    () => ["All", ...uniqueValues(projects.map((project) => project.language)).sort()],
    [projects]
  );

  const topics = useMemo(
    () => ["All", ...uniqueValues(projects.flatMap((project) => project.topics || [])).sort()],
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...projects]
      .filter((project) => {
        const matchesSearch = [
          project.name,
          project.description,
          project.language,
          ...(project.topics || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
        const matchesLanguage = language === "All" || project.language === language;
        const matchesTopic = topic === "All" || (project.topics || []).includes(topic);

        return matchesSearch && matchesLanguage && matchesTopic;
      })
      .sort(sortOptions[sortBy]);
  }, [language, projects, query, sortBy, topic]);

  return (
    <main className="page-shell">
      <div className="page-header">
        <span className="section-eyebrow">Live Repository Feed</span>
        <h1>Projects</h1>
        <p>
          Production repositories, GitHub metadata, and portfolio-ready project discovery powered
          directly by coding-journal.
        </p>
      </div>

      <DeveloperMetrics />

      <section className="section-panel">
        <span className="section-eyebrow">Repository Explorer</span>
        <h2>Browse Projects</h2>

        <div className="problem-toolbar problem-toolbar-wrap">
          <input
            type="search"
            placeholder="Search repositories..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search projects"
          />
          <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Filter by language">
            {languages.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select value={topic} onChange={(event) => setTopic(event.target.value)} aria-label="Filter by topic">
            {topics.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort projects">
            <option value="newest">Newest</option>
            <option value="stars">Stars</option>
            <option value="name">Name</option>
          </select>
        </div>

        {loading ? (
          <article className="glass-card">
            <h3>Loading projects</h3>
            <p>Fetching live repositories from coding-journal.</p>
          </article>
        ) : error ? (
          <article className="glass-card">
            <h3>Unable to load projects</h3>
            <p>{error}</p>
          </article>
        ) : !projects.length ? (
          <article className="glass-card">
            <h3>No repositories found</h3>
            <p>coding-journal returned an empty projects feed.</p>
          </article>
        ) : !filteredProjects.length ? (
          <article className="glass-card">
            <h3>No matching repositories</h3>
            <p>Try clearing one or more filters to see more projects.</p>
          </article>
        ) : (
          <div className="problem-grid">
            {filteredProjects.map((project) => (
              <article className="problem-card" key={project.url}>
                <span className="problem-stat">{project.language || "Unknown"}</span>
                <h2>{project.name}</h2>
                <p>{project.description || "No repository description provided."}</p>
                <p>Stars: {project.stars || 0} • Forks: {project.forks || 0}</p>
                <p>Updated: {formatDate(project.updatedAt) || "Unknown"}</p>
                <p>Topics: {(project.topics || []).length ? project.topics.join(", ") : "None"}</p>
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
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
