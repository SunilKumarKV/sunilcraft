import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  formatDate,
  getJournalProblems,
  getJournalProjects,
  getJournalStats,
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
    }));

    const byTag = problems.reduce((acc, problem) => {
      for (const tag of problem.tags || []) {
        acc[tag] = (acc[tag] || 0) + 1;
      }
      return acc;
    }, {});

    const tagCards = trackedTags.map((name) => ({
      name,
      count: byTag[name] || 0,
    }));

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
        description="A live snapshot of my developer activity across projects, problem solving, and verified code."
        align="left"
      />

      {!loading && !error ? (
        <SectionPanel
          eyebrow="Activity Overview"
          title="Activity Overview"
          description="Live calculations from the synced coding-journal feeds for problems, projects, verification, language usage, and GitHub metrics."
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
      ) : null}

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
