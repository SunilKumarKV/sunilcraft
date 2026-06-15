import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroPic from "/assets/images/SunilKumar.JPG";
import { profile, services } from "../data/profile";
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
  const summary = useMemo(() => {
    const verified = problems.filter((problem) => problem.verified).length;
    const platforms = new Set(problems.map((problem) => problem.platform).filter(Boolean)).size;
    const languages = new Set(problems.map((problem) => problem.language).filter(Boolean)).size;

    return {
      repositories: projects.length,
      problems: problems.length,
      verified,
      platforms,
      languages,
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
          <h1 className="hero-title">I build React and full-stack web apps for real products, portfolios, and workflows.</h1>
          <p className="hero-description">
            MCA student at Bangalore University, open to remote internships, part-time roles, and freelance frontend/full-stack work. I build with React, Node.js, GitHub workflows, and verified project systems.
          </p>

          <div className="hero-actions" aria-label="Primary actions">
            <Link to="/contact" className="hero-button">Hire Me</Link>
            <Link to="/projects" className="hero-button secondary">View Work</Link>
            <Link to="/codebase" className="hero-button secondary">Explore Codebase</Link>
          </div>

          <div className="hero-trust">
            <Badge tone="success">Available for freelance</Badge>
            <Badge tone="accent">Remote / part-time ready</Badge>
            <Badge>Verified codebase</Badge>
            <Badge>GitHub synced work</Badge>
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
            <div className="hero-image-copy">
              <strong>{profile.role}</strong>
              <p className="hero-image-caption">Building in public through real projects.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell home-page-shell">
        <SectionPanel
          eyebrow="Role Fit"
          title="Where I can contribute right now"
          description="The portfolio is built to make fit clear quickly: frontend polish, React product work, full-stack implementation, and freelance delivery for practical web apps."
          className="showcase-panel"
        >
          <div className="feature-grid role-fit-grid">
            <article className="glass-card role-fit-card">
              <div className="card-row">
                <Badge tone="accent">Frontend Developer</Badge>
                <Badge>React</Badge>
              </div>
              <h3>{services[0]?.title || "Frontend Development"}</h3>
              <p>UI systems, responsive implementation, layout cleanup, and modern app surfaces that feel more production-ready on desktop and mobile.</p>
            </article>
            <article className="glass-card role-fit-card">
              <div className="card-row">
                <Badge tone="accent">React Developer</Badge>
                <Badge>Vite</Badge>
              </div>
              <h3>Clean component structure and routing</h3>
              <p>Reusable page systems, filtered data views, lazy-loaded routes, and the kind of implementation detail that keeps growth manageable.</p>
            </article>
            <article className="glass-card role-fit-card">
              <div className="card-row">
                <Badge tone="accent">Full Stack Developer</Badge>
                <Badge>Node.js</Badge>
              </div>
              <h3>{services[3]?.title || "Full-Stack Features"}</h3>
              <p>Workflow APIs, live JSON sync, source-backed content, and product features that connect frontend polish to practical data handling.</p>
            </article>
            <article className="glass-card role-fit-card">
              <div className="card-row">
                <Badge tone="success">Freelance Web Apps</Badge>
                <Badge>Remote Ready</Badge>
              </div>
              <h3>Useful support for projects that feel stuck</h3>
              <p>Portfolio upgrades, route fixes, UI cleanup, bug fixing, and build-safe frontend work for teams or founders who need momentum.</p>
            </article>
          </div>
        </SectionPanel>

        <SectionPanel
          eyebrow="Featured Work"
          title="Projects that best represent how I build"
          description="Real GitHub-synced work that shows product thinking, frontend polish, and practical full-stack implementation."
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
                      <Badge>{project.homepage ? "Live" : "GitHub"}</Badge>
                    </div>
                    <h2>{project.name}</h2>
                    <p>{project.description || "No repository description provided."}</p>
                    <p>Stars: {project.stars || 0} • Forks: {project.forks || 0} • {project.homepage ? "Homepage available" : "Source-first build"}</p>
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
                      {project.homepage ? (
                        <a href={project.homepage} className="project-link" target="_blank" rel="noreferrer">
                          Live
                        </a>
                      ) : null}
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
          eyebrow="Proof of Work"
          title="The proof is live, synced, and easy to inspect"
          description="Projects come from GitHub, problem and codebase entries come from coding-journal, and the portfolio updates from real work instead of manual claims."
          className="explorer-panel"
        >
          {loading ? (
            <LoadingState title="Loading proof of work" message="Pulling live repositories and verified coding entries from coding-journal." />
          ) : error ? (
            <ErrorState title="Unable to load proof of work" message={error} />
          ) : (
            <div className="feature-grid proof-grid">
              <article className="glass-card">
                <div className="card-row">
                  <Badge tone="accent">GitHub synced</Badge>
                  <Badge>{heroNumber(summary.repositories)} repos</Badge>
                </div>
                <h3>Projects backed by real repositories</h3>
                <p>Each project card is populated from the live GitHub and coding-journal feed instead of static portfolio text.</p>
              </article>
              <article className="glass-card">
                <div className="card-row">
                  <Badge tone="success">Verified codebase</Badge>
                  <Badge>{heroNumber(summary.verified)} verified</Badge>
                </div>
                <h3>Solutions with code, notes, and complexity</h3>
                <p>The codebase section shows how I solve problems, explain the approach, and keep the work easy to review.</p>
              </article>
              <article className="glass-card">
                <div className="card-row">
                  <Badge tone="accent">Problem solving</Badge>
                  <Badge>{heroNumber(summary.platforms)} platforms</Badge>
                </div>
                <h3>Consistency beyond just project demos</h3>
                <p>Problem records help show regular coding practice, verification, and the habit of documenting solutions instead of only storing code.</p>
              </article>
              <article className="glass-card">
                <div className="card-row">
                  <Badge>Workflow</Badge>
                  <Badge>{heroNumber(summary.languages)} solution languages</Badge>
                </div>
                <h3>A repeatable system, not a static portfolio</h3>
                <p>Solve, verify, publish, and reflect the work automatically. That keeps the portfolio grounded in what I am actually building.</p>
              </article>
            </div>
          )}
        </SectionPanel>

        <SectionPanel
          eyebrow="Codebase / Problem Solving"
          title="Verified solutions that are worth opening"
          description="This section stays technical on purpose: source code, explanation, complexity notes, and platform context from live coding-journal data."
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
                    <p>{(problem.tags || []).slice(0, 4).join(", ") || "Open the full entry for source code, explanation, and complexity notes."}</p>
                  </Link>
                ))}
              </div>
              <div className="home-section-actions">
                <Link to="/codebase" className="page-button">Open Codebase Library</Link>
                <Link to="/problems" className="page-button compact">Browse Problems</Link>
              </div>
            </>
          )}
        </SectionPanel>

        <SectionPanel
          eyebrow="Contact"
          title="Open to internships, part-time roles, and freelance web app work"
          description="If you need a React developer for UI polish, frontend implementation, portfolio upgrades, or product-focused web features, this is the best next step."
          className="contact-cta-panel"
        >
          <div className="cta-panel home-contact-cta">
            <div>
              <h3>Let’s talk about the role or the project</h3>
              <p>I’m currently looking for remote internships, part-time frontend or full-stack roles, and freelance opportunities where clean implementation and practical product thinking matter.</p>
            </div>
            <div className="hero-actions hero-actions-inline">
              <Link to="/contact" className="hero-button">Contact Me</Link>
              <a href={profile.linkedin} className="hero-button secondary" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={profile.github} className="hero-button secondary" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </SectionPanel>
      </div>
    </main>
  );
}
