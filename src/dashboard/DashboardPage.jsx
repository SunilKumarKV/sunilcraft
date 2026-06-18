import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  formatDate,
  getJournalProblems,
  getJournalProjects,
  getJournalStats,
  getProblemLanguages,
  toPlatformSegment,
  toProjectSlug,
  sumNumber,
  uniqueValues,
} from "../lib/codingJournal";
import PageHeader from "../components/ui/PageHeader";
import SectionPanel from "../components/ui/SectionPanel";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";

const platformOrder = [
  "LeetCode",
  "HackerRank",
  "CodeChef",
  "Codeforces",
  "Custom",
];

const languageOrder = [
  "JavaScript",
  "TypeScript",
  "Java",
  "Python",
];

const difficultyOrder = ["Easy", "Medium", "Hard"];
const trackedTags = ["Array", "Hash Map", "String", "Tree", "Graph", "DP"];

const technologyAliases = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  react: "React",
  reactjs: "React",
  node: "Node.js",
  "node.js": "Node.js",
  nodejs: "Node.js",
  "c lang": "C",
  c: "C",
};

function normalizeTechnology(value) {
  if (!value || typeof value !== "string") return "";
  const normalized = value.trim().toLowerCase();
  return technologyAliases[normalized] || value.trim();
}

function percent(value, total) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

function useDashboardData() {
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
          error: fetchError.message || "Unable to load developer analytics from coding-journal.",
        });
      });

    return () => {
      ignore = true;
    };
  }, []);

  return state;
}

export default function DashboardPage() {
  const { stats, problems, projects, loading, error } = useDashboardData();

  const analytics = useMemo(() => {
    const totalProblems = stats?.totalProblems ?? problems.length;
    const verifiedProblems =
      stats?.verifiedProblems ?? problems.filter((problem) => problem.verified).length;
    const totalProjects = stats?.totalProjects ?? projects.length;
    const totalStars = stats?.totalStars ?? sumNumber(projects, "stars");
    const totalForks = stats?.totalForks ?? sumNumber(projects, "forks");
    const languagesUsed = uniqueValues([
      ...projects.map((project) => project.language),
      ...problems.map((problem) => problem.language),
    ]).length;

    const byPlatform = problems.reduce((acc, problem) => {
      const key = problem.platform || "Custom";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const platformCards = platformOrder.map((name) => ({
      name,
      count: byPlatform[name] || 0,
      percentage: percent(byPlatform[name] || 0, totalProblems),
    }));

    const byLanguage = problems.reduce((acc, problem) => {
      const key = problem.language || "Others";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const knownLanguages = new Set(languageOrder);
    const otherLanguageCount = Object.entries(byLanguage).reduce(
      (total, [name, count]) => total + (knownLanguages.has(name) ? 0 : count),
      0
    );

    const languageCards = [
      ...languageOrder.map((name) => ({
        name,
        count: byLanguage[name] || 0,
      })),
      { name: "Others", count: otherLanguageCount },
    ];

    const byDifficulty = problems.reduce((acc, problem) => {
      const key = problem.difficulty || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const difficultyCards = difficultyOrder.map((name) => ({
      name,
      count: byDifficulty[name] || 0,
      percentage: percent(byDifficulty[name] || 0, totalProblems),
    }));

    const byTag = problems.reduce((acc, problem) => {
      for (const tag of problem.tags || []) {
        acc[tag] = (acc[tag] || 0) + 1;
      }
      return acc;
    }, {});

    const tagCards = Object.entries(byTag)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));

    const technologyCandidates = [];

    projects.forEach((project) => {
      const projectLanguage = normalizeTechnology(project.language);
      if (projectLanguage) technologyCandidates.push(projectLanguage);

      (project.topics || []).forEach((topic) => {
        const normalizedTopic = normalizeTechnology(topic);
        if (normalizedTopic) technologyCandidates.push(normalizedTopic);
      });
    });

    problems.forEach((problem) => {
      const solutionLanguages = Array.isArray(problem.solutions)
        ? problem.solutions.map((solution) => normalizeTechnology(solution.language)).filter(Boolean)
        : [];

      if (solutionLanguages.length) {
        technologyCandidates.push(...solutionLanguages);
      } else {
        const fallbackLanguage = normalizeTechnology(problem.language);
        if (fallbackLanguage) technologyCandidates.push(fallbackLanguage);
      }
    });

    const technologyCounts = technologyCandidates.reduce((acc, tech) => {
      if (!tech) return acc;
      acc[tech] = (acc[tech] || 0) + 1;
      return acc;
    }, {});

    const technologyCards = Object.entries(technologyCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10)
      .map(([name, count]) => ({
        name,
        count,
        percentage: percent(count, technologyCandidates.length),
      }));

    const recentVerifiedProblems = [...problems]
      .filter((problem) => problem.verified)
      .sort((a, b) => {
        const dateA = new Date(a.solvedAt || a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.solvedAt || b.updatedAt || b.createdAt || 0).getTime();
        const hasDateA = Boolean(dateA);
        const hasDateB = Boolean(dateB);

        if (hasDateA && hasDateB) return dateB - dateA;
        if (hasDateA) return -1;
        if (hasDateB) return 1;
        return 0;
      })
      .slice(0, 6)
      .map((problem) => ({
        ...problem,
        languageCount: getProblemLanguages(problem).length,
        platformSegment: toPlatformSegment(problem.platform),
      }));

    const recentProjects = [...projects]
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || 0).getTime();
        const hasDateA = Boolean(dateA);
        const hasDateB = Boolean(dateB);

        if (hasDateA && hasDateB) return dateB - dateA;
        if (hasDateA) return -1;
        if (hasDateB) return 1;
        return 0;
      })
      .slice(0, 6)
      .map((project) => ({
        ...project,
        slug: toProjectSlug(project.name),
      }));

    const timelineEvents = [
      ...projects
        .filter((project) => project.updatedAt)
        .map((project) => ({
          type: "Project Updated",
          title: project.name,
          date: new Date(project.updatedAt),
          description: project.description
            ? `Updated project ${project.name} on coding-journal.`
            : `Updated project ${project.name}.`,
          link: `/projects/${toProjectSlug(project.name)}`,
          badge: project.language || "Project",
        })),
      ...problems
        .filter((problem) => problem.solvedAt || problem.updatedAt)
        .map((problem) => ({
          type: "Problem Solved",
          title: problem.title,
          date: new Date(problem.solvedAt || problem.updatedAt),
          description: `Solved on ${problem.platform || "a platform"} with ${problem.difficulty || "unknown"} difficulty.`,
          link: `/problems/${toPlatformSegment(problem.platform)}/${problem.slug}`,
          badge: problem.platform || "Problem",
        })),
      ...problems
        .filter((problem) => problem.verified && (problem.solvedAt || problem.updatedAt || problem.createdAt))
        .map((problem) => ({
          type: "Solution Verified",
          title: problem.title,
          date: new Date(problem.solvedAt || problem.updatedAt || problem.createdAt),
          description: `Verified solution for ${problem.title} on ${problem.platform || "a platform"}.`,
          link: `/problems/${toPlatformSegment(problem.platform)}/${problem.slug}`,
          badge: "Verified",
        })),
    ]
      .filter((event) => !Number.isNaN(event.date.getTime()))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 8);

    const problemsWithDate = problems.filter(
      (problem) => problem.addedAt || problem.createdAt || problem.updatedAt || problem.solvedAt
    );

    const timeline = problemsWithDate.reduce((acc, problem) => {
      const rawDate = problem.addedAt || problem.createdAt || problem.updatedAt || problem.solvedAt;
      const parsed = new Date(rawDate);
      if (Number.isNaN(parsed.getTime())) return acc;

      const label = new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
      }).format(parsed);

      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});

    const timelineCards = Object.entries(timeline).map(([month, count]) => ({
      month,
      count,
    }));

    const byStars = [...projects]
      .sort((a, b) => (b.stars || 0) - (a.stars || 0) || a.name.localeCompare(b.name))
      .slice(0, 3);

    const byForks = [...projects]
      .sort((a, b) => (b.forks || 0) - (a.forks || 0) || a.name.localeCompare(b.name))
      .slice(0, 3);

    const byUpdated = [...projects]
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .slice(0, 3);

    const achievements = [
      {
        title: "First Verified Problem",
        achieved: verifiedProblems >= 1,
        detail: verifiedProblems >= 1 ? `${verifiedProblems} verified problems tracked.` : "No verified problems yet.",
      },
      {
        title: "10 Problems Solved",
        achieved: totalProblems >= 10,
        detail: `${totalProblems} problems tracked in coding-journal.`,
      },
      {
        title: "25 Problems Solved",
        achieved: totalProblems >= 25,
        detail: `${totalProblems} problems tracked in coding-journal.`,
      },
      {
        title: "First Open Source Project",
        achieved: projects.length >= 1,
        detail: projects.length ? `${projects[0].name} is available in the synced project feed.` : "No synced projects yet.",
      },
    ];

    return {
      overview: [
        { label: "Total Problems", value: totalProblems },
        { label: "Verified Problems", value: verifiedProblems },
        { label: "Total Projects", value: totalProjects },
        { label: "Languages Used", value: languagesUsed },
        { label: "GitHub Stars", value: totalStars },
        { label: "GitHub Forks", value: totalForks },
      ],
      platformCards,
      languageCards,
      difficultyCards,
      tagCards,
      technologyCards,
      recentVerifiedProblems,
      recentProjects,
      timelineCards,
      projectInsights: {
        byStars,
        byForks,
        byUpdated,
      },
      achievements,
      availableLanguages: uniqueValues(projects.map((project) => project.language)),
    };
  }, [problems, projects, stats]);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Developer Analytics"
        title="Dashboard"
        description="A broader analytics view across projects, coding output, verification, and portfolio activity."
        align="left"
      />

      {!loading && !error ? (
        <>
          <SectionPanel
            eyebrow="Activity Overview"
            title="Activity Overview"
            description="Live calculations from coding-journal for projects, problems, verification, language usage, and GitHub-facing metrics."
          >
            <div className="dashboard-grid">
              {analytics.overview.map((metric) => (
                <article className="glass-card" key={metric.label}>
                  <span className="section-eyebrow">{metric.label}</span>
                  <h3>{metric.value}</h3>
                </article>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel
            className="dashboard-progress"
            eyebrow="Coding Progress"
            title="Coding Progress"
            description="Analytics across problem-solving performance, platform spread, difficulty mix, and topic distribution."
          >
            <div className="feature-grid">
            <article className="glass-card">
              <h3>Difficulty Progress</h3>
              <div className="progress-stack">
                {analytics.difficultyCards.map((item) => (
                  <div className="progress-row" key={item.name}>
                    <div className="progress-label">
                      <span>{item.name}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="progress-bar" aria-label={`${item.name} difficulty`}>
                      <span style={{ width: item.percentage }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-card">
              <h3>Platform Breakdown</h3>
              <div className="progress-stack">
                {analytics.platformCards.map((item) => (
                  <div className="progress-row" key={item.name}>
                    <div className="progress-label">
                      <span>{item.name}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="progress-bar" aria-label={`${item.name} platform count`}>
                      <span style={{ width: item.percentage }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-card">
              <h3>Top Topics</h3>
              <div className="tag-chip-list">
                {analytics.tagCards.map((item) => (
                  <span className="tag-chip" key={item.name}>
                    {item.name}
                    <strong>{item.count}</strong>
                  </span>
                ))}
              </div>
            </article>
          </div>
        </SectionPanel>

        <SectionPanel
          className="dashboard-progress"
          eyebrow="Technology Usage"
          title="Technology Usage"
          description="Live technology usage calculated from coding-journal project metadata, topics, and solution languages."
        >
          <div className="feature-grid">
            <article className="glass-card">
              <h3>Top Technologies</h3>
              <div className="progress-stack">
                {analytics.technologyCards.map((item) => (
                  <div className="progress-row" key={item.name}>
                    <div className="progress-label">
                      <span>{item.name}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="progress-bar" aria-label={`${item.name} usage`}>
                      <span style={{ width: item.percentage }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </SectionPanel>

        <SectionPanel
          eyebrow="Career Focus"
          title="Career Focus"
          description="Recruiter-friendly availability and current engineering priorities for internships, freelance work, and part-time roles."
        >
          <div className="feature-grid">
            <article className="glass-card">
              <h3>Current Focus</h3>
              <ul className="career-list">
                <li>MCA @ Bangalore University</li>
                <li>React Development</li>
                <li>Node.js APIs</li>
                <li>DSA Problem Solving</li>
                <li>Full Stack Projects</li>
                <li>coding-journal</li>
              </ul>
            </article>

            <article className="glass-card">
              <h3>Open To Work</h3>
              <ul className="career-list">
                <li>Remote Internship</li>
                <li>Part-Time Developer Roles</li>
                <li>Freelance Projects</li>
                <li>React Development</li>
                <li>Full Stack Development</li>
              </ul>
              <div className="card-row" style={{ marginTop: "18px" }}>
                <Link className="page-button" to="/contact">
                  Contact Me
                </Link>
                <Link className="page-button" to="/projects">
                  View Projects
                </Link>
              </div>
            </article>
          </div>
        </SectionPanel>

        <SectionPanel
          eyebrow="Recent Activity"
          title="Recent Problems"
          description="Verified problems from coding-journal, sorted by most recent solved dates and linked to the tracker detail page."
        >
          <div className="feature-grid">
            {analytics.recentVerifiedProblems.map((problem) => (
              <article className="glass-card" key={problem.slug}>
                <div className="card-row">
                  <span>{problem.platform}</span>
                  <span>{problem.difficulty || "Unknown"}</span>
                </div>
                <h3>{problem.title}</h3>
                <p>{problem.languageCount} solution language{problem.languageCount === 1 ? "" : "s"}</p>
                <div className="card-row" style={{ gap: "10px", flexWrap: "wrap" }}>
                  <span className="ui-badge success">Verified</span>
                  <Link className="page-button compact" to={`/problems/${problem.platformSegment}/${problem.slug}`}>
                    View Problem
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel
          eyebrow="Recent Activity"
          title="Recent Projects"
          description="Latest updated repositories from coding-journal, sorted by update date and linked to project detail pages."
        >
          <div className="feature-grid">
            {analytics.recentProjects.map((project) => (
              <article className="glass-card" key={project.slug}>
                <div className="card-row">
                  <span>{project.language || "Unknown"}</span>
                  <span>⭐ {project.stars || 0}</span>
                </div>
                <h3>{project.name}</h3>
                <p>{project.forks || 0} forks • Updated {formatDate(project.updatedAt) || "Unknown"}</p>
                <Link className="page-button compact" to={`/projects/${project.slug}`}>
                  View Project
                </Link>
              </article>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel
          eyebrow="Build In Public"
          title="Build In Public Timeline"
          description="Real timeline events generated from project updates, verified solutions, and solved problems in coding-journal."
        >
          <div className="timeline-list">
  {(analytics.timelineEvents || []).length ? (
    (analytics.timelineEvents || []).map((event) => (
      <article
        className="timeline-item glass-card"
        key={`${event.type}-${event.title}-${String(event.date)}`}
      >
        <span>{formatDate(event.date) || "Unknown"}</span>
        <div>
          <div className="card-row" style={{ justifyContent: "space-between", gap: "12px" }}>
            <h3>{event.title}</h3>
            <span className="ui-badge accent">{event.type}</span>
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
      <h3>No public build events available</h3>
      <p>
        There are currently not enough dated project or problem events in the live
        coding-journal feed to build a timeline.
      </p>
    </article>
  )}
</div>
        </SectionPanel>
      </> ) : null}

      {loading ? (
        <SectionPanel eyebrow="Loading" title="Preparing Dashboard">
          <LoadingState title="Loading dashboard" message="Fetching live analytics data from coding-journal." />
        </SectionPanel>
      ) : error ? (
        <SectionPanel eyebrow="Issue" title="Dashboard Unavailable">
          <ErrorState title="Unable to load dashboard" message={error} />
        </SectionPanel>
      ) : (
        <>
          <SectionPanel
            eyebrow="Navigation"
            title="Developer Platform"
            description="Use the dashboard as the top-level hub, then branch into deeper views only when you need them."
          >
            <div className="problem-grid">
              <Link className="problem-card" to="/journey">
                <span className="problem-stat">Journey</span>
                <h2>Timeline</h2>
                <p>Monthly developer activity grouped from problems, projects, and achievements.</p>
              </Link>
              <Link className="problem-card" to="/achievements">
                <span className="problem-stat">Achievements</span>
                <h2>Milestones</h2>
                <p>Unlocked and in-progress milestones calculated from coding-journal data.</p>
              </Link>
              <Link className="problem-card" to="/problems">
                <span className="problem-stat">Workflow</span>
                <h2>Problem Explorer</h2>
                <p>Move from metrics into the full problem feed and synced platform coverage.</p>
              </Link>
              <Link className="problem-card" to="/codebase">
                <span className="problem-stat">Workflow</span>
                <h2>Solution Library</h2>
                <p>Open verified code entries, explanations, and implementation detail pages.</p>
              </Link>
            </div>

            <div className="feature-grid" style={{ marginTop: "24px" }}>
              {[
                "1. Solve problem",
                "2. Run cj add <platform> <slug>",
                "3. Add solution + tests + explanation",
                "4. Run cj verify",
                "5. Run cj publish",
                "6. Portfolio updates automatically",
              ].map((step) => (
                <article className="glass-card" key={step}>
                  <h3>{step}</h3>
                </article>
              ))}
            </div>
          </SectionPanel>

          <section className="section-panel">
            <span className="section-eyebrow">Overview</span>
            <h2>Overview</h2>
            <div className="problem-grid">
              {analytics.overview.map((metric) => (
                <article className="problem-card" key={metric.label}>
                  <span className="problem-stat">{metric.label}</span>
                  <h2>{metric.value}</h2>
                </article>
              ))}
            </div>
          </section>

          <section className="section-panel">
            <span className="section-eyebrow">Platforms</span>
            <h2>Platforms</h2>
            <div className="feature-grid">
              {analytics.platformCards.map((item) => (
                <article className="glass-card" key={item.name}>
                  <h3>{item.name}</h3>
                  <p>{item.count} problems</p>
                  <p>{item.percentage} of total</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section-panel">
            <span className="section-eyebrow">Languages</span>
            <h2>Languages</h2>
            <div className="feature-grid">
              {analytics.languageCards.map((item) => (
                <article className="glass-card" key={item.name}>
                  <h3>{item.name}</h3>
                  <p>{item.count} problems</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section-panel">
            <span className="section-eyebrow">Difficulty</span>
            <h2>Difficulty Breakdown</h2>
            <div className="feature-grid">
              {analytics.difficultyCards.map((item) => (
                <article className="glass-card" key={item.name}>
                  <h3>{item.name}</h3>
                  <p>{item.count} problems</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section-panel">
            <span className="section-eyebrow">Tags</span>
            <h2>Tags Analysis</h2>
            <div className="feature-grid">
              {analytics.tagCards.map((item) => (
                <article className="glass-card" key={item.name}>
                  <h3>{item.name}</h3>
                  <p>{item.count} uses</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section-panel">
            <span className="section-eyebrow">Timeline</span>
            <h2>Activity Timeline</h2>
            {analytics.timelineCards.length ? (
              <div className="feature-grid">
                {analytics.timelineCards.map((item) => (
                  <article className="glass-card" key={item.month}>
                    <h3>{item.month}</h3>
                    <p>{item.count} problems added</p>
                  </article>
                ))}
              </div>
            ) : (
              <article className="glass-card">
                <h3>Activity timeline unavailable</h3>
                <p>
                  The current `coding-journal/data/problems.json` feed does not yet include per-problem
                  date fields, so monthly additions cannot be calculated truthfully.
                </p>
              </article>
            )}
          </section>

          <section className="section-panel">
            <span className="section-eyebrow">Projects</span>
            <h2>Project Insights</h2>
            <div className="feature-grid">
              <article className="glass-card">
                <h3>Top by Stars</h3>
                {analytics.projectInsights.byStars.map((project) => (
                  <p key={project.url}>{project.name} • {project.stars || 0} stars</p>
                ))}
              </article>
              <article className="glass-card">
                <h3>Top by Forks</h3>
                {analytics.projectInsights.byForks.map((project) => (
                  <p key={project.url}>{project.name} • {project.forks || 0} forks</p>
                ))}
              </article>
              <article className="glass-card">
                <h3>Latest Updated</h3>
                {analytics.projectInsights.byUpdated.map((project) => (
                  <p key={project.url}>{project.name} • {formatDate(project.updatedAt) || "Unknown"}</p>
                ))}
              </article>
            </div>
          </section>

          <section className="section-panel">
            <span className="section-eyebrow">Milestones</span>
            <h2>Achievements</h2>
            <div className="feature-grid">
              {analytics.achievements.map((achievement) => (
                <article className="glass-card" key={achievement.title}>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.achieved ? "Unlocked" : "In Progress"}</p>
                  <p>{achievement.detail}</p>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
