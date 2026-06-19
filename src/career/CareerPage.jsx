import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { profile } from "../data/profile";
import PageHeader from "../components/ui/PageHeader";
import SectionPanel from "../components/ui/SectionPanel";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import {
  formatDate,
  getJournalProblems,
  getJournalProjects,
  getJournalStats,
  getProblemLanguages,
  getProblemSolvedAt,
  getProblemTrackedCount,
  isPlatformProfileSummary,
  normalizePlatformName,
  toProjectSlug,
  uniqueValues,
} from "../lib/codingJournal";

function percent(value, total) {
  if (!total) return "0%";
  return `${Math.min(100, Math.round((value / total) * 100))}%`;
}

function useCareerData() {
  const [state, setState] = useState({
    stats: null,
    problems: [],
    projects: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    let ignore = false;

    Promise.all([getJournalStats(), getJournalProblems(), getJournalProjects()])
      .then(([statsData, problemsData, projectsData]) => {
        if (ignore) return;
        setState({
          stats: statsData ?? null,
          problems: Array.isArray(problemsData) ? problemsData : [],
          projects: Array.isArray(projectsData) ? projectsData : [],
          loading: false,
          error: "",
        });
      })
      .catch((fetchError) => {
        if (ignore) return;
        setState({
          stats: null,
          problems: [],
          projects: [],
          loading: false,
          error: fetchError.message || "Unable to load career data from coding-journal.",
        });
      });

    return () => {
      ignore = true;
    };
  }, []);

  return state;
}

export default function CareerPage() {
  const { stats, problems, projects, loading, error } = useCareerData();

  const analytics = useMemo(() => {
    const profileSummaries = problems.filter((problem) => isPlatformProfileSummary(problem));
    const trackedProblems = problems.filter((problem) => !isPlatformProfileSummary(problem));
    const totalTrackedProblems =
      trackedProblems.length +
      profileSummaries.reduce((total, problem) => total + getProblemTrackedCount(problem), 0);
    const verifiedSolutions =
      stats?.verifiedProblems ?? trackedProblems.filter((problem) => problem.verified).length;
    const platforms = uniqueValues(problems.map((problem) => normalizePlatformName(problem.platform))).filter(Boolean);
    const languages = uniqueValues(
      trackedProblems.flatMap((problem) => getProblemLanguages(problem))
    ).filter(Boolean);
    const platformSnapshot = ["LeetCode", "HackerRank", "CodeChef", "Codeforces"].map((name) => ({
      name,
      count: problems.reduce((total, problem) => {
        if (normalizePlatformName(problem.platform) !== name) return total;
        return total + getProblemTrackedCount(problem);
      }, 0),
    }));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    const contributions = {};

    const addEvent = (rawDate) => {
      if (!rawDate) return;
      const date = new Date(rawDate);
      if (Number.isNaN(date.getTime())) return;
      date.setHours(0, 0, 0, 0);
      if (date < startDate || date > today) return;
      const key = date.toISOString().slice(0, 10);
      contributions[key] = (contributions[key] || 0) + 1;
    };

    trackedProblems.forEach((problem) => addEvent(getProblemSolvedAt(problem)));
    projects.forEach((project) => addEvent(project.updatedAt));

    const heatmapDays = Array.from({ length: 365 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      const key = date.toISOString().slice(0, 10);
      return contributions[key] || 0;
    });

    const currentStreak = (() => {
      let streak = 0;
      for (let i = heatmapDays.length - 1; i >= 0; i -= 1) {
        if (heatmapDays[i] > 0) streak += 1;
        else break;
      }
      return streak;
    })();

    const longestStreak = heatmapDays.reduce(
      (state, count) => {
        if (count > 0) {
          const current = state.current + 1;
          return { current, longest: Math.max(state.longest, current) };
        }
        return { current: 0, longest: state.longest };
      },
      { current: 0, longest: 0 }
    ).longest;

    const technologyPool = [
      ...projects.flatMap((project) => [project.language, ...(project.topics || [])]),
      ...trackedProblems.flatMap((problem) => getProblemLanguages(problem)),
      ...trackedProblems.flatMap((problem) => problem.tags || []),
    ]
      .filter(Boolean)
      .map((item) => String(item).toLowerCase());

    const countMatches = (patterns) =>
      technologyPool.filter((item) => patterns.some((pattern) => item.includes(pattern))).length;

    const skillsMatrix = [
      {
        name: "Frontend",
        detail: "React, UI systems, responsive implementation",
        count: countMatches(["react", "javascript", "typescript", "frontend", "css", "html"]),
      },
      {
        name: "Backend",
        detail: "Node.js workflows, APIs, and automation tooling",
        count: countMatches(["node", "api", "backend", "server", "express"]),
      },
      {
        name: "Problem Solving",
        detail: "DSA practice, platform breadth, and verified solutions",
        count: totalTrackedProblems,
      },
      {
        name: "Git / GitHub",
        detail: "Repository history, release hygiene, and synced work",
        count: projects.length + countMatches(["git", "github"]),
      },
      {
        name: "Databases",
        detail: "Data modeling exposure and full-stack project workflows",
        count: countMatches(["database", "mongodb", "sql", "postgres", "mysql"]),
      },
    ];

    const maxSkillCount = Math.max(...skillsMatrix.map((item) => item.count), 1);
    const normalizedSkills = skillsMatrix.map((item) => ({
      ...item,
      percentage: percent(item.count, maxSkillCount),
    }));

    const achievements = [];
    if (verifiedSolutions >= 1) {
      achievements.push({
        date: trackedProblems
          .filter((problem) => problem.verified)
          .map((problem) => new Date(getProblemSolvedAt(problem) || problem.updatedAt || 0))
          .filter((date) => !Number.isNaN(date.getTime()))
          .sort((a, b) => a - b)[0] || null,
        title: "First verified solution",
        description: `${verifiedSolutions} verified solutions are now tracked in coding-journal.`,
      });
    }
    if (totalTrackedProblems >= 10) {
      achievements.push({
        date: null,
        title: "10 tracked problems",
        description: `${totalTrackedProblems} tracked problems across coding platforms.`,
      });
    }
    if (projects.length >= 1) {
      achievements.push({
        date: new Date(
          projects
            .map((project) => new Date(project.updatedAt || 0))
            .filter((date) => !Number.isNaN(date.getTime()))
            .sort((a, b) => a - b)[0] || 0
        ),
        title: "Active GitHub project history",
        description: `${projects.length} synced GitHub repositories support the portfolio.`,
      });
    }

    const timelineEvents = [
      ...projects
        .filter((project) => project.updatedAt)
        .map((project) => ({
          date: new Date(project.updatedAt),
          title: `${project.name} updated`,
          description: "Repository update captured from the live GitHub-synced project feed.",
          link: `/projects/${toProjectSlug(project.name)}`,
          badge: project.language || "Project",
        })),
      ...trackedProblems
        .filter((problem) => getProblemSolvedAt(problem))
        .map((problem) => ({
          date: new Date(getProblemSolvedAt(problem)),
          title: `${problem.title} solved`,
          description: `${normalizePlatformName(problem.platform)} activity recorded in coding-journal.`,
          link: `/coding`,
          badge: normalizePlatformName(problem.platform),
        })),
      ...achievements
        .filter((achievement) => achievement.date && !Number.isNaN(achievement.date.getTime()))
        .map((achievement) => ({
          date: achievement.date,
          title: achievement.title,
          description: achievement.description,
          link: "/career",
          badge: "Achievement",
        })),
    ]
      .filter((event) => event.date && !Number.isNaN(event.date.getTime()))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 8);

    return {
      totalTrackedProblems,
      verifiedSolutions,
      platforms,
      languages,
      githubProjects: stats?.totalProjects ?? projects.length,
      platformSnapshot,
      skillsMatrix: normalizedSkills,
      currentStreak,
      longestStreak,
      timelineEvents,
    };
  }, [problems, projects, stats]);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Career Mode"
        title="Career"
        description="A recruiter-facing profile built from live coding-journal and GitHub data."
        align="left"
      />

      {loading ? (
        <SectionPanel eyebrow="Loading" title="Preparing Career Profile">
          <LoadingState title="Loading career profile" message="Fetching live project and coding data." />
        </SectionPanel>
      ) : error ? (
        <SectionPanel eyebrow="Issue" title="Career Profile Unavailable">
          <ErrorState title="Unable to load career profile" message={error} />
        </SectionPanel>
      ) : !problems.length && !projects.length ? (
        <SectionPanel eyebrow="Empty" title="No Career Data Yet">
          <EmptyState title="Career data is not available yet" message="coding-journal and GitHub data will populate this page automatically." />
        </SectionPanel>
      ) : (
        <>
          <SectionPanel
            eyebrow="Career Hero"
            title={profile.name}
            description="MCA Student | Frontend Developer | Full Stack Developer"
          >
            <div className="feature-grid">
              <article className="glass-card">
                <div className="card-row">
                  <span className="section-eyebrow">Open To Work</span>
                  <span className="ui-badge success">Available</span>
                </div>
                <h3>{profile.role}</h3>
                <p>{profile.status}</p>
                <p>{profile.location}</p>
              </article>
              <article className="glass-card">
                <div className="card-row">
                  <span className="section-eyebrow">Current Focus</span>
                </div>
                <h3>MCA @ Bangalore University</h3>
                <p>Building recruiter-trustworthy frontend and full-stack work through live projects, coding practice, and public proof systems.</p>
              </article>
            </div>
          </SectionPanel>

          <SectionPanel
            eyebrow="Recruiter Summary"
            title="Live recruiter snapshot"
            description="A quick summary of tracked coding volume, verification, platform breadth, language coverage, and GitHub project output."
          >
            <div className="page-meta-strip compact">
              <article className="meta-strip-card">
                <span>Total Tracked Problems</span>
                <strong>{analytics.totalTrackedProblems}</strong>
              </article>
              <article className="meta-strip-card">
                <span>Verified Solutions</span>
                <strong>{analytics.verifiedSolutions}</strong>
              </article>
              <article className="meta-strip-card">
                <span>Platforms</span>
                <strong>{analytics.platforms.length}</strong>
              </article>
              <article className="meta-strip-card">
                <span>Languages</span>
                <strong>{analytics.languages.length}</strong>
              </article>
              <article className="meta-strip-card">
                <span>GitHub Projects</span>
                <strong>{analytics.githubProjects}</strong>
              </article>
            </div>
          </SectionPanel>

          <SectionPanel
            eyebrow="Coding Snapshot"
            title="Platform profile snapshot"
            description="Coding activity summarized by platform so recruiters can see breadth at a glance."
          >
            <div className="feature-grid">
              {analytics.platformSnapshot.map((item) => (
                <article className="glass-card" key={item.name}>
                  <div className="card-row">
                    <span className="section-eyebrow">{item.name}</span>
                    <span className="ui-badge accent">{item.count}</span>
                  </div>
                  <h3>{item.count} tracked</h3>
                  <p>{item.count ? "Live coding-journal activity is available for this platform." : "No synced activity yet for this platform."}</p>
                </article>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel
            eyebrow="Skills Matrix"
            title="Working strengths"
            description="A practical skills view inferred from current projects, coding languages, and workflow data."
            className="dashboard-progress"
          >
            <div className="feature-grid">
              <article className="glass-card">
                <div className="progress-stack">
                  {analytics.skillsMatrix.map((skill) => (
                    <div className="progress-row" key={skill.name}>
                      <div className="progress-label">
                        <span>{skill.name}</span>
                        <span>{skill.percentage}</span>
                      </div>
                      <div className="progress-bar" aria-label={`${skill.name} strength`}>
                        <span style={{ width: skill.percentage }} />
                      </div>
                      <p>{skill.detail}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </SectionPanel>

          <SectionPanel
            eyebrow="Open To Work"
            title="Where I can contribute"
            description="Current roles and project types that match the work already visible in the portfolio."
          >
            <div className="feature-grid">
              {[
                {
                  title: "Remote Internship",
                  detail: "A strong fit for frontend, product implementation, and developer-tool workflows.",
                },
                {
                  title: "Frontend Developer",
                  detail: "React UI systems, responsive implementation, dashboard views, and premium portfolio polish.",
                },
                {
                  title: "Full Stack Developer",
                  detail: "Frontend delivery plus Node.js workflows, synced content, and practical product features.",
                },
                {
                  title: "Freelance Projects",
                  detail: "Portfolio upgrades, coding dashboards, route fixes, UI cleanup, and build-safe feature work.",
                },
              ].map((item) => (
                <article className="glass-card" key={item.title}>
                  <div className="card-row">
                    <span className="section-eyebrow">Open</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel
            eyebrow="Resume"
            title="Resume and contact"
            description="Direct next steps for recruiters, hiring teams, and clients."
          >
            <div className="cta-panel">
              <div>
                <h3>Download the resume or reach out directly</h3>
                <p>Use the resume for a quick overview, or get in touch for internship, frontend, full-stack, or freelance opportunities.</p>
              </div>
              <div className="problem-actions-row">
                <a className="page-button compact" href={profile.resumeUrl} target="_blank" rel="noreferrer">
                  Download Resume
                </a>
                <Link className="page-button compact" to="/contact">
                  Contact Me
                </Link>
              </div>
            </div>
          </SectionPanel>

          <SectionPanel
            eyebrow="Career Timeline"
            title="Recent momentum"
            description="A live timeline built from project updates, coding activity, and milestone-style achievements."
          >
            <div className="timeline-list">
              {analytics.timelineEvents.length ? (
                analytics.timelineEvents.map((event) => (
                  <article className="timeline-item glass-card" key={`${event.title}-${String(event.date)}`}>
                    <span>{formatDate(event.date)}</span>
                    <div>
                      <div className="card-row" style={{ justifyContent: "space-between", gap: "12px" }}>
                        <h3>{event.title}</h3>
                        <span className="ui-badge accent">{event.badge}</span>
                      </div>
                      <p>{event.description}</p>
                      <Link className="page-button compact" to={event.link}>
                        View Details
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <article className="glass-card">
                  <h3>No recent career timeline events yet</h3>
                  <p>The timeline will populate automatically from coding-journal and project updates.</p>
                </article>
              )}
            </div>
          </SectionPanel>

          <SectionPanel
            eyebrow="Recruiter CTA"
            title="Let's build something together"
            description="If the mix of frontend execution, coding discipline, and practical product work fits your role, this is the best next step."
          >
            <div className="cta-panel">
              <div>
                <h3>Open to internships, developer roles, and freelance work</h3>
                <p>I’m looking for opportunities where clean implementation, live proof of work, and steady engineering progress matter.</p>
              </div>
              <div className="problem-actions-row">
                <Link className="page-button compact" to="/contact">
                  Contact Me
                </Link>
                <Link className="page-button compact" to="/projects">
                  View Projects
                </Link>
              </div>
            </div>
          </SectionPanel>
        </>
      )}
    </main>
  );
}
