import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DeveloperMetrics from "./DeveloperMetrics";
import {
  formatDate,
  getJournalProjects,
  toProjectSlug,
  uniqueValues,
} from "../lib/codingJournal";
import PageHeader from "./ui/PageHeader";
import SectionPanel from "./ui/SectionPanel";
import FilterBar from "./ui/FilterBar";
import LoadingState from "./ui/LoadingState";
import ErrorState from "./ui/ErrorState";
import EmptyState from "./ui/EmptyState";
import Badge from "./ui/Badge";

function sortProjects(a, b) {
  const featuredRank = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  if (featuredRank !== 0) return featuredRank;

  const priorityA = Number.isFinite(Number(a.priority)) ? Number(a.priority) : Number.MAX_SAFE_INTEGER;
  const priorityB = Number.isFinite(Number(b.priority)) ? Number(b.priority) : Number.MAX_SAFE_INTEGER;
  if (priorityA !== priorityB) return priorityA - priorityB;

  const starRank = (b.stars || 0) - (a.stars || 0);
  if (starRank !== 0) return starRank;

  const updatedRank = new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
  if (updatedRank !== 0) return updatedRank;

  return a.name.localeCompare(b.name);
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("All");
  const [topic, setTopic] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState("All Projects");
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

  const featuredProjects = useMemo(
    () => [...projects].filter((project) => project.featured).sort(sortProjects).slice(0, 3),
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
        const matchesFeatured =
          featuredFilter === "All Projects" ||
          (featuredFilter === "Featured Only" && project.featured);

        return matchesSearch && matchesLanguage && matchesTopic && matchesFeatured;
      })
      .sort(sortProjects);
  }, [featuredFilter, language, projects, query, topic]);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Work"
        title="Projects, featured builds, and repo explorer"
        description="Projects I’m actively building or maintaining, synced from my GitHub repositories."
        align="left"
      />

      <DeveloperMetrics title="Developer Metrics" />

      <SectionPanel
        eyebrow="Highlights"
        title="Featured Projects"
        description="Featured work rises to the top first, then the full repository feed stays available below."
      >
        {loading ? (
          <LoadingState title="Loading featured projects" message="Fetching priority projects from coding-journal." />
        ) : error ? (
          <ErrorState title="Unable to load featured projects" message={error} />
        ) : !featuredProjects.length ? (
          <EmptyState title="No featured projects found" message="Mark repositories as featured in coding-journal to surface them here." />
        ) : (
          <div className="problem-grid">
            {featuredProjects.map((project) => (
              <article className="problem-card" key={project.url}>
                <div className="card-row">
                  <Badge tone="accent">Featured</Badge>
                  <Badge>{project.language || "Unknown"}</Badge>
                </div>
                <h2>{project.name}</h2>
                <p>{project.description || "No repository description provided."}</p>
                <p>Priority: {project.priority ?? "Unranked"} • Stars: {project.stars || 0}</p>
                {(project.topics || []).length ? (
                  <div className="card-row">
                    {project.topics.slice(0, 4).map((topicName) => (
                      <Badge key={topicName}>{topicName}</Badge>
                    ))}
                  </div>
                ) : null}
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
      </SectionPanel>

      <SectionPanel
        eyebrow="Explorer"
        title="GitHub Repo Explorer"
        description="Search the synced GitHub feed by language, topic, or featured status."
      >
        <FilterBar>
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
          <select
            value={featuredFilter}
            onChange={(event) => setFeaturedFilter(event.target.value)}
            aria-label="Filter by featured projects"
          >
            <option value="All Projects">All Projects</option>
            <option value="Featured Only">Featured Only</option>
          </select>
        </FilterBar>

        {loading ? (
          <LoadingState title="Loading projects" message="Fetching live repositories from coding-journal." />
        ) : error ? (
          <ErrorState title="Unable to load projects" message={error} />
        ) : !projects.length ? (
          <EmptyState title="No repositories found" message="coding-journal returned an empty projects feed." />
        ) : !filteredProjects.length ? (
          <EmptyState title="No matching repositories" message="Try clearing one or more filters to see more projects." />
        ) : (
          <div className="problem-grid">
            {filteredProjects.map((project) => (
              <article className="problem-card" key={project.url}>
                <div className="card-row">
                  {project.featured ? <Badge tone="accent">Featured</Badge> : null}
                  <Badge>{project.language || "Unknown"}</Badge>
                </div>
                <h2>{project.name}</h2>
                <p>{project.description || "No repository description provided."}</p>
                <p>Stars: {project.stars || 0} • Forks: {project.forks || 0}</p>
                <p>Updated: {formatDate(project.updatedAt) || "Unknown"}</p>
                {(project.topics || []).length ? (
                  <div className="card-row">
                    {project.topics.slice(0, 5).map((topicName) => (
                      <Badge key={topicName}>{topicName}</Badge>
                    ))}
                  </div>
                ) : (
                  <p>Topics: None</p>
                )}
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
      </SectionPanel>
    </main>
  );
}
