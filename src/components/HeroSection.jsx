import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroPic from "/assets/images/SunilKumar.JPG";
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
  const preferredOrder = ["rainbowcode", "chessplay", "sunilcraft", "coding-journal"];
  const normalizedA = String(a.name || "").toLowerCase();
  const normalizedB = String(b.name || "").toLowerCase();
  const preferredIndexA = preferredOrder.findIndex((item) => normalizedA.includes(item));
  const preferredIndexB = preferredOrder.findIndex((item) => normalizedB.includes(item));
  if (preferredIndexA !== preferredIndexB) {
    if (preferredIndexA === -1) return 1;
    if (preferredIndexB === -1) return -1;
    return preferredIndexA - preferredIndexB;
  }

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
  const latestProject = useMemo(
    () => [...projects].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))[0] || null,
    [projects]
  );
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

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [metricDisplay, setMetricDisplay] = useState({
    repositories: prefersReducedMotion ? summary.repositories : 0,
    problems: prefersReducedMotion ? summary.problems : 0,
    verified: prefersReducedMotion ? summary.verified : 0,
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      setMetricDisplay({
        repositories: summary.repositories,
        problems: summary.problems,
        verified: summary.verified,
      });
      return undefined;
    }

    let frameId = 0;
    const duration = 950;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);

      setMetricDisplay({
        repositories: Math.round(summary.repositories * eased),
        problems: Math.round(summary.problems * eased),
        verified: Math.round(summary.verified * eased),
      });

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(frameId);
  }, [prefersReducedMotion, summary.problems, summary.repositories, summary.verified]);

  const heroNumber = (value) => (loading ? "--" : value || 0);

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
          <h4 className="hero-subtitle">{profile.name}</h4>
          <h1 className="hero-title">I build web apps that turn learning, coding, and workflows into usable products.</h1>
          <p className="hero-description">
            MCA student at Bangalore University building developer tools, portfolio systems, coding workflows, and product-focused web applications with React and Node.js.
          </p>

          <div className="hero-actions" aria-label="Primary actions">
            <Link to="/projects" className="hero-button">Explore Work</Link>
            <Link to="/dashboard" className="hero-button secondary">Open Dashboard</Link>
            <a href={profile.github} className="hero-button secondary" target="_blank" rel="noreferrer">GitHub</a>
          </div>

          <div className="hero-trust">
            <Badge tone="accent">GitHub synced</Badge>
            <Badge tone="success">Verified solutions</Badge>
            <Badge>Live coding journal</Badge>
          </div>

          <div className="hero-stats" aria-label="Portfolio stats">
            <article className="hero-stat-card">
              <strong>{heroNumber(metricDisplay.repositories)}</strong>
              <span>Repositories</span>
            </article>
            <article className="hero-stat-card">
              <strong>{heroNumber(metricDisplay.problems)}</strong>
              <span>Problems Solved</span>
            </article>
            <article className="hero-stat-card">
              <strong>{heroNumber(metricDisplay.verified)}</strong>
              <span>Verified Solutions</span>
            </article>
          </div>
        </motion.div>

        <div className="hero-image">
          <div className="hero-image-card">
            <img src={HeroPic} alt="Sunil Kumar K V profile" loading="eager" />
            <p className="hero-image-caption">Building in public through real projects</p>
          </div>
        </div>
      </section>

      <div className="page-shell home-page-shell">
        <SectionPanel
          eyebrow="Selected Work"
          title="Featured Projects"
          description="Projects I’m actively building or maintaining, synced from my GitHub repositories."
          className="showcase-panel"
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
                    {(project.topics || []).length ? (
                      <div className="card-row">
                        {project.topics.slice(0, 4).map((topic) => (
                          <Badge key={topic}>{topic}</Badge>
                        ))}
                      </div>
                    ) : null}
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

        <DeveloperMetrics title="Developer Activity" />

        <SectionPanel
          eyebrow="Problem Solving"
          title="Verified Problem Solving"
          description="A verified record of coding problems I’ve solved, tested, and documented."
          className="explorer-panel"
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
                      <Badge>{problem.difficulty || "Unknown"}</Badge>
                      <Badge>{problem.language || "Unknown"}</Badge>
                    </div>
                    <h2>{problem.title}</h2>
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
          description="My personal solution library with source code, tests, explanations, and complexity notes."
          className="explorer-panel"
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
                      <Badge tone="accent">{problem.platform}</Badge>
                      <Badge tone="success">Verified</Badge>
                      <Badge>{problem.difficulty || "Unknown"}</Badge>
                      <Badge>{problem.language || "Unknown"}</Badge>
                    </div>
                    <h2>{problem.title}</h2>
                    <p>Open the full entry for solution code, explanation, and complexity notes.</p>
                  </Link>
                ))}
              </div>
              <Link to="/codebase" className="page-button">Browse Verified Solutions</Link>
            </>
          )}
        </SectionPanel>

        <SectionPanel
          eyebrow="Building Journey"
          title="What is actively taking shape"
          description="Projects, verified solutions, and coding-journal activity keep moving together, so the portfolio reflects real work instead of static snapshots."
          className="timeline-panel"
        >
          <div className="dashboard-grid">
            <article className="glass-card widget-card">
              <h3>Latest project motion</h3>
              <p>{latestProject ? `${latestProject.name} is the most recently updated synced project in the portfolio feed.` : "Project updates appear here as soon as coding-journal data loads."}</p>
            </article>
            <article className="glass-card widget-card">
              <h3>Verified momentum</h3>
              <p>{summary.verified} verified solutions are already tracked in the live coding journal.</p>
            </article>
            <article className="glass-card widget-card">
              <h3>Where to go next</h3>
              <p>Open Journey for the narrative timeline, or jump into Dashboard for a broader view of developer activity.</p>
            </article>
          </div>
          <div className="hero-actions hero-actions-inline">
            <Link to="/journey" className="hero-button secondary">View Journey</Link>
            <Link to="/dashboard" className="hero-button">Open Dashboard</Link>
          </div>
        </SectionPanel>

        <SectionPanel
          eyebrow="Contact"
          title="Let’s talk through the work"
          description="If the mix of product polish, verified coding work, and real GitHub activity looks like a fit, the next step is a simple conversation."
          className="contact-cta-panel"
        >
          <div className="cta-panel">
            <div>
              <h3>Built in public, explained clearly</h3>
              <p>SunilCraft is meant to show how I think, build, document, and improve products over time, not just list tools or numbers.</p>
            </div>
            <div className="hero-actions">
              <Link to="/contact" className="hero-button">Contact</Link>
              <a href={profile.github} className="hero-button secondary" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </SectionPanel>
      </div>
    </main>
  );
}
