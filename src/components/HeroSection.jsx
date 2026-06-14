import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroPic from "/assets/images/pic.png";
import { profile } from "../data/profile";
import DeveloperMetrics from "./DeveloperMetrics";
import {
  getJournalProblems,
  getJournalProjects,
  toPlatformSegment,
  toProjectSlug,
} from "../lib/codingJournal";
import SectionPanel from "./ui/SectionPanel";
import LoadingState from "./ui/LoadingState";
import ErrorState from "./ui/ErrorState";
import EmptyState from "./ui/EmptyState";
import Badge from "./ui/Badge";
import "../styles/HeroSection.css";

function sortProjects(a, b) {
  const featuredRank = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  if (featuredRank !== 0) return featuredRank;

  const priorityA = Number.isFinite(Number(a.priority)) ? Number(a.priority) : Number.MAX_SAFE_INTEGER;
  const priorityB = Number.isFinite(Number(b.priority)) ? Number(b.priority) : Number.MAX_SAFE_INTEGER;
  if (priorityA !== priorityB) return priorityA - priorityB;

  const starRank = (b.stars || 0) - (a.stars || 0);
  if (starRank !== 0) return starRank;

  return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
}

export default function HeroSection() {
  const [projects, setProjects] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    Promise.all([getJournalProjects(), getJournalProblems()])
      .then(([projectData, problemData]) => {
        if (ignore) return;
        setProjects(Array.isArray(projectData) ? projectData : []);
        setProblems(Array.isArray(problemData) ? problemData : []);
        setLoading(false);
      })
      .catch((fetchError) => {
        if (ignore) return;
        setError(fetchError.message || "Unable to load live portfolio previews from coding-journal.");
        setProjects([]);
        setProblems([]);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const featuredProjects = useMemo(() => [...projects].sort(sortProjects).slice(0, 3), [projects]);
  const verifiedProblems = useMemo(() => problems.filter((problem) => problem.verified).slice(0, 3), [problems]);
  const summary = useMemo(() => {
    const verified = problems.filter((problem) => problem.verified).length;
    const platforms = new Set(problems.map((problem) => problem.platform).filter(Boolean)).size;
    return {
      repositories: projects.length,
      problems: problems.length,
      verified,
      platforms,
    };
  }, [problems, projects]);

  return (
    <main className="home-shell">
      <section className="hero" id="home">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="availability-badge">● {profile.status}</span>
          <h4 className="hero-subtitle">Premium portfolio, live engineering data</h4>
          <h1 className="hero-title">{profile.name}</h1>
          <p className="hero-description">
            {profile.role}. SunilCraft brings together selected work, coding problem progress,
            verified solution entries, and developer analytics in one cleaner engineering surface.
          </p>
          <div className="hero-actions">
            <Link to="/projects" className="hero-button">Explore Work</Link>
            <Link to="/dashboard" className="hero-button secondary">Open Dashboard</Link>
            <a href={profile.github} className="hero-button secondary" target="_blank" rel="noreferrer">GitHub</a>
          </div>

          <div className="hero-stats" aria-label="Portfolio stats">
            <span><strong>{summary.repositories || "--"}</strong> Live Repos</span>
            <span><strong>{summary.problems || "--"}</strong> Problems</span>
            <span><strong>{summary.verified || "--"}</strong> Verified</span>
          </div>
        </motion.div>

        <div className="hero-image">
          <img src={HeroPic} alt="Sunil Kumar K V profile" loading="eager" />
        </div>
      </section>

      <div className="page-shell home-page-shell">
        <DeveloperMetrics />

        <SectionPanel
          eyebrow="Selected Work"
          title="Featured Projects"
          description="Top portfolio builds are surfaced first, while the full repository explorer stays available in the Work hub."
        >
          {loading ? (
            <LoadingState title="Loading featured projects" message="Fetching the latest work preview from coding-journal." />
          ) : error ? (
            <ErrorState title="Unable to load featured projects" message={error} />
          ) : !featuredProjects.length ? (
            <EmptyState title="No featured projects yet" message="coding-journal did not return any featured repositories." />
          ) : (
            <>
              <div className="problem-grid">
                {featuredProjects.map((project) => (
                  <article className="problem-card" key={project.url}>
                    <div className="card-row">
                      <Badge tone="accent">Featured</Badge>
                      <Badge>{project.language || "Unknown"}</Badge>
                    </div>
                    <h2>{project.name}</h2>
                    <p>{project.description || "No repository description provided."}</p>
                    <p>Stars: {project.stars || 0} • Forks: {project.forks || 0}</p>
                    <div className="project-actions">
                      <a href={project.url} className="project-link primary" target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                      <Link to={`/projects/${toProjectSlug(project.name)}`} className="project-link">
                        Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              <Link to="/projects" className="page-button">Go to Work</Link>
            </>
          )}
        </SectionPanel>

        <SectionPanel
          eyebrow="Problem Solving"
          title="Problem Solving Preview"
          description="A live summary of problem volume, verification progress, and direct paths into the explorer."
        >
          {loading ? (
            <LoadingState title="Loading problem preview" message="Preparing a live problem snapshot from coding-journal." />
          ) : error ? (
            <ErrorState title="Unable to load problem preview" message={error} />
          ) : !problems.length ? (
            <EmptyState title="No problems in the feed" message="coding-journal returned an empty problems feed." />
          ) : (
            <>
              <div className="feature-grid compact-grid">
                <article className="glass-card">
                  <h3>Total Solved</h3>
                  <p>{summary.problems}</p>
                </article>
                <article className="glass-card">
                  <h3>Verified</h3>
                  <p>{summary.verified}</p>
                </article>
                <article className="glass-card">
                  <h3>Platforms</h3>
                  <p>{summary.platforms}</p>
                </article>
              </div>
              <div className="problem-list preview-list">
                {verifiedProblems.map((problem) => (
                  <Link
                    key={`${problem.platform}-${problem.slug}`}
                    className="problem-card"
                    to={`/problems/${toPlatformSegment(problem.platform)}/${problem.slug}`}
                  >
                    <div className="card-row">
                      <Badge tone="accent">{problem.platform}</Badge>
                      <Badge tone="success">Verified</Badge>
                    </div>
                    <h2>{problem.title}</h2>
                    <p>{problem.difficulty || "Unknown difficulty"} • {problem.language || "Unknown language"}</p>
                    <p>{(problem.tags || []).slice(0, 4).join(", ") || "No tags added yet."}</p>
                  </Link>
                ))}
              </div>
              <Link to="/problems" className="page-button">Open Problem Explorer</Link>
            </>
          )}
        </SectionPanel>

        <SectionPanel
          eyebrow="Verified Solutions"
          title="Codebase Preview"
          description="Solution notes, explanation-backed entries, and implementation details stay one click away."
        >
          {loading ? (
            <LoadingState title="Loading codebase preview" message="Fetching verified solution entries from coding-journal." />
          ) : error ? (
            <ErrorState title="Unable to load codebase preview" message={error} />
          ) : !verifiedProblems.length ? (
            <EmptyState title="No verified solutions yet" message="Verified solution cards will appear here as coding-journal grows." />
          ) : (
            <>
              <div className="problem-grid">
                {verifiedProblems.map((problem) => (
                  <Link
                    key={`code-${problem.platform}-${problem.slug}`}
                    className="problem-card"
                    to={`/codebase/${toPlatformSegment(problem.platform)}/${problem.slug}`}
                  >
                    <div className="card-row">
                      <Badge>{problem.language || "Unknown"}</Badge>
                      <Badge tone="success">Verified</Badge>
                    </div>
                    <h2>{problem.title}</h2>
                    <p>{problem.platform} • {problem.difficulty || "Unknown difficulty"}</p>
                    <p>Open the full entry for solution code, explanation, and complexity notes.</p>
                  </Link>
                ))}
              </div>
              <Link to="/codebase" className="page-button">Browse Verified Solutions</Link>
            </>
          )}
        </SectionPanel>

        <SectionPanel
          eyebrow="Next Step"
          title="Move from portfolio view to engineering dashboard"
          description="Use SunilCraft to review flagship work, inspect verified problem solving, and track progress across the coding-journal pipeline."
        >
          <div className="cta-panel">
            <div>
              <h3>Everything stays connected</h3>
              <p>Projects, problems, journey milestones, and achievements stay synced from coding-journal without adding clutter back into the main navigation.</p>
            </div>
            <div className="hero-actions">
              <Link to="/dashboard" className="hero-button">View Dashboard</Link>
              <Link to="/contact" className="hero-button secondary">Contact</Link>
            </div>
          </div>
        </SectionPanel>
      </div>
    </main>
  );
}
