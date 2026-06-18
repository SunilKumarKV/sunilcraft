import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  formatDate,
  getJournalProblems,
  getJournalProjects,
  getJournalStats,
  getProblemLanguages,
  getProblemSolvedAt,
  toPlatformSegment,
  uniqueValues,
} from "../lib/codingJournal";
import PageHeader from "../components/ui/PageHeader";
import SectionPanel from "../components/ui/SectionPanel";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

function percent(value, total) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

function getDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getContributionLevel(count, maxCount) {
  if (!count || !maxCount) return 0;
  return Math.min(4, Math.ceil((count / maxCount) * 4));
}

function normalizeProfileLanguage(value) {
  if (!value) return "";
  const normalized = String(value).trim().toLowerCase();
  if (/^javascript?$/.test(normalized) || /^typescript?$/.test(normalized)) return "JavaScript";
  if (/^java$/.test(normalized)) return "Java";
  if (/^c($|[^a-z])/.test(normalized) || normalized === "c") return "C";
  return "Others";
}

function normalizePlatform(value) {
  const normalized = String(value || "").trim();
  if (!normalized) return "Others";
  if (/leetcode/i.test(normalized)) return "LeetCode";
  if (/codeforces/i.test(normalized)) return "Codeforces";
  if (/codechef/i.test(normalized)) return "CodeChef";
  if (/hackerrank/i.test(normalized)) return "HackerRank";
  return "Others";
}

function useCodingProfileData() {
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
          error:
            fetchError.message || "Unable to load coding profile data from coding-journal.",
        });
      });

    return () => {
      ignore = true;
    };
  }, []);

  return state;
}

export default function CodingProfilePage() {
  const { stats, problems, projects, loading, error } = useCodingProfileData();

  const analytics = useMemo(() => {
    const totalProblems = stats?.totalProblems ?? problems.length;
    const verifiedSolutions = stats?.verifiedProblems ?? problems.filter((problem) => problem.verified).length;

    const problemLanguages = problems.flatMap((problem) => {
      const languages = getProblemLanguages(problem);
      if (languages.length) return languages;
      return problem.language ? [problem.language] : [];
    });

    const languageUsedSet = uniqueValues(problemLanguages.map((language) => normalizeProfileLanguage(language)));
    const languagesUsed = languageUsedSet.filter(Boolean).length;
    const platformUsedSet = uniqueValues(problems.map((problem) => normalizePlatform(problem.platform)));
    const platformsUsed = platformUsedSet.filter(Boolean).length;

    const difficultyCounts = problems.reduce(
      (acc, problem) => {
        const key = problem.difficulty || "Unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {}
    );

    const difficultyCards = ["Easy", "Medium", "Hard"].map((name) => ({
      name,
      count: difficultyCounts[name] || 0,
      percentage: percent(difficultyCounts[name] || 0, totalProblems),
    }));

    const languageCounts = problemLanguages.reduce((acc, language) => {
      const key = normalizeProfileLanguage(language);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const languageCards = [
      { name: "JavaScript", count: languageCounts["JavaScript"] || 0 },
      { name: "Java", count: languageCounts["Java"] || 0 },
      { name: "C", count: languageCounts["C"] || 0 },
      { name: "Others", count: languageCounts["Others"] || 0 },
    ];

    const platformCounts = problems.reduce((acc, problem) => {
      const key = normalizePlatform(problem.platform);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const platformCards = [
      { name: "LeetCode", count: platformCounts["LeetCode"] || 0 },
      { name: "Codeforces", count: platformCounts["Codeforces"] || 0 },
      { name: "CodeChef", count: platformCounts["CodeChef"] || 0 },
      { name: "HackerRank", count: platformCounts["HackerRank"] || 0 },
      { name: "Others", count: platformCounts["Others"] || 0 },
    ];

    const contributions = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysCount = 365;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (daysCount - 1));

    const recordEvent = (rawDate) => {
      if (!rawDate) return;
      const eventDate = new Date(rawDate);
      if (Number.isNaN(eventDate.getTime())) return;
      eventDate.setHours(0, 0, 0, 0);
      if (eventDate < startDate || eventDate > today) return;
      const key = getDateKey(eventDate);
      contributions[key] = (contributions[key] || 0) + 1;
    };

    problems.forEach((problem) => recordEvent(getProblemSolvedAt(problem)));
    projects.forEach((project) => recordEvent(project.updatedAt));

    const heatmapDays = Array.from({ length: daysCount }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      const key = getDateKey(date);
      return {
        key,
        date,
        count: contributions[key] || 0,
      };
    });

    const maxHeatCount = Math.max(...heatmapDays.map((day) => day.count), 1);
    const contributionWeeks = Array.from(
      { length: Math.ceil(heatmapDays.length / 7) },
      (_, weekIndex) => heatmapDays.slice(weekIndex * 7, weekIndex * 7 + 7)
    );

    const totalActivityEvents = heatmapDays.reduce((total, day) => total + day.count, 0);
    const activeDays = heatmapDays.filter((day) => day.count > 0).length;
    const currentStreak = (() => {
      let streak = 0;
      for (let i = heatmapDays.length - 1; i >= 0; i -= 1) {
        if (heatmapDays[i].count > 0) streak += 1;
        else break;
      }
      return streak;
    })();

    const longestStreak = heatmapDays.reduce(
      (state, day) => {
        if (day.count > 0) {
          const current = state.current + 1;
          return {
            current,
            longest: Math.max(state.longest, current),
          };
        }
        return { current: 0, longest: state.longest };
      },
      { current: 0, longest: 0 }
    ).longest;

    const recentSolves = [...problems]
      .filter((problem) => getProblemSolvedAt(problem))
      .sort((a, b) => new Date(getProblemSolvedAt(b)) - new Date(getProblemSolvedAt(a)))
      .slice(0, 8)
      .map((problem) => ({
        ...problem,
        solvedAt: getProblemSolvedAt(problem),
        solutionLanguages: getProblemLanguages(problem).length
          ? getProblemLanguages(problem)
          : problem.language
          ? [problem.language]
          : [],
      }));

    const multiLanguageProblems = [...problems]
      .map((problem) => {
        const solutionLanguages = getProblemLanguages(problem).length
          ? getProblemLanguages(problem)
          : problem.language
          ? [problem.language]
          : [];
        return {
          ...problem,
          solutionLanguages: uniqueValues(solutionLanguages),
          activityDate: getProblemSolvedAt(problem) || problem.updatedAt || problem.createdAt || problem.addedAt,
        };
      })
      .filter((problem) => problem.solutionLanguages.length > 1)
      .sort((a, b) => new Date(b.activityDate) - new Date(a.activityDate))
      .slice(0, 6);

    const timelineEvents = [...problems]
      .flatMap((problem) => {
        const solvedDate = problem.solvedAt ? new Date(problem.solvedAt) : null;
        const updatedDate = problem.updatedAt ? new Date(problem.updatedAt) : null;
        const events = [];

        if (solvedDate && !Number.isNaN(solvedDate.getTime())) {
          events.push({
            date: solvedDate,
            title: `${problem.title} solved`,
            description: `${normalizePlatform(problem.platform)} problem solved (${problem.difficulty || "Unknown"}).`,
            verified: Boolean(problem.verified),
            link: `/problems/${toPlatformSegment(problem.platform)}/${problem.slug}`,
          });
        }

        if (!problem.solvedAt && updatedDate && !Number.isNaN(updatedDate.getTime())) {
          events.push({
            date: updatedDate,
            title: `${problem.title} updated`,
            description: `Problem record updated in coding-journal.`,
            verified: Boolean(problem.verified),
            link: `/problems/${toPlatformSegment(problem.platform)}/${problem.slug}`,
          });
        }

        return events;
      })
      .sort((a, b) => b.date - a.date)
      .slice(0, 10);

    return {
      heroStats: [
        { label: "Total Problems", value: totalProblems },
        { label: "Verified Solutions", value: verifiedSolutions },
        { label: "Languages Used", value: languagesUsed },
        { label: "Platforms", value: platformsUsed },
      ],
      difficultyCards,
      languageCards,
      platformCards,
      recentSolves,
      multiLanguageProblems,
      timelineEvents,
      heatmap: {
        weeks: contributionWeeks,
        totalActivityEvents,
        activeDays,
        currentStreak,
        longestStreak,
        maxCount: maxHeatCount,
      },
    };
  }, [problems, projects, stats]);

  const hasProblemData = problems.length > 0;

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Coding Profile"
        title="Coding Profile"
        description="A public coding hub for problem-solving progress, verified solutions, language breadth, and recent activity captured from coding-journal."
        align="left"
      />

      {!loading && !error && hasProblemData ? (
        <>
          <SectionPanel
            eyebrow="Coding Hub"
            title="Start from the right coding view"
            description="Use Coding as the overview, then jump into the tracker, the solution library, or the full analytics center depending on what you want to inspect."
          >
            <div className="coding-profile-grid">
              <article className="glass-card">
                <span className="section-eyebrow">Problems Tracker</span>
                <h3>Problem history and progress</h3>
                <p>Open the tracker for solved lists, difficulty coverage, platforms, tags, and recent progress.</p>
                <div className="card-row" style={{ marginTop: "16px" }}>
                  <Link className="page-button compact" to="/problems">
                    Open Problems Tracker
                  </Link>
                </div>
              </article>
              <article className="glass-card">
                <span className="section-eyebrow">Codebase Library</span>
                <h3>Solution articles and code</h3>
                <p>Go deeper into explanations, language tabs, complexity notes, and verified implementation detail.</p>
                <div className="card-row" style={{ marginTop: "16px" }}>
                  <Link className="page-button compact" to="/codebase">
                    Open Codebase Library
                  </Link>
                </div>
              </article>
              <article className="glass-card">
                <span className="section-eyebrow">Developer Dashboard</span>
                <h3>Analytics and activity center</h3>
                <p>See broader engineering signals across projects, coding activity, verification, and portfolio metrics.</p>
                <div className="card-row" style={{ marginTop: "16px" }}>
                  <Link className="page-button compact" to="/dashboard">
                    Open Developer Dashboard
                  </Link>
                </div>
              </article>
            </div>
          </SectionPanel>

          <SectionPanel
            eyebrow="Proof Profile"
            title="Coding journey snapshot"
            description="High-level proof of coding consistency, verification, language coverage, and platform breadth."
          >
            <div className="coding-hero-grid">
              {analytics.heroStats.map((item) => (
                <article className="glass-card" key={item.label}>
                  <span className="section-eyebrow">{item.label}</span>
                  <h3>{item.value}</h3>
                </article>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel
            eyebrow="Activity Heatmap"
            title="Recent coding consistency"
            description="A year of coding-journal activity from solved problems and project updates, shown as a contribution-style timeline."
          >
            <div className="feature-grid">
              <article className="glass-card">
                <div className="coding-card-row" style={{ gap: "18px" }}>
                  <div>
                    <h3>{analytics.heatmap.totalActivityEvents}</h3>
                    <p>Total activity events</p>
                  </div>
                  <div>
                    <h3>{analytics.heatmap.activeDays}</h3>
                    <p>Active days</p>
                  </div>
                  <div>
                    <h3>{analytics.heatmap.currentStreak}</h3>
                    <p>Current streak</p>
                  </div>
                  <div>
                    <h3>{analytics.heatmap.longestStreak}</h3>
                    <p>Longest streak</p>
                  </div>
                </div>

                <div className="contribution-heatmap-container">
                  <div className="contribution-heatmap-grid" role="grid" aria-label="Coding activity heatmap">
                    {analytics.heatmap.weeks.map((week, weekIndex) => (
                      <div className="contribution-week" key={`heat-week-${weekIndex}`}>
                        {week.map((day) => (
                          <div
                            key={day.key}
                            className={`contribution-cell level-${getContributionLevel(day.count, analytics.heatmap.maxCount)}`}
                            title={`${formatDate(day.date)} — ${day.count} event${day.count === 1 ? "" : "s"}`}
                            aria-label={`${formatDate(day.date)}: ${day.count} event${day.count === 1 ? "" : "s"}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </SectionPanel>

          <SectionPanel eyebrow="Difficulty" title="Difficulty breakdown" description="Difficulty spread across the problems captured in this coding profile.">
            <div className="feature-grid">
              <article className="glass-card">
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
            </div>
          </SectionPanel>

          <SectionPanel eyebrow="Languages" title="Language breakdown" description="Languages represented across submitted and stored solutions.">
            <div className="feature-grid">
              {analytics.languageCards.map((item) => (
                <article className="glass-card" key={item.name}>
                  <h3>{item.name}</h3>
                  <p>{item.count} references</p>
                </article>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel eyebrow="Platforms" title="Platform breakdown" description="Where the current problem-solving record is coming from.">
            <div className="feature-grid">
              {analytics.platformCards.map((item) => (
                <article className="glass-card" key={item.name}>
                  <h3>{item.name}</h3>
                  <p>{item.count} problems</p>
                </article>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel eyebrow="Recent Solves" title="Recent accepted solves" description="Latest accepted or captured problem records, with quick paths into the tracker and code library.">
            {analytics.recentSolves.length ? (
              <div className="coding-profile-grid">
                {analytics.recentSolves.map((problem) => (
                  <article className="glass-card" key={problem.slug || problem.title}>
                    <div className="coding-card-row" style={{ justifyContent: "space-between" }}>
                      <span>{normalizePlatform(problem.platform)}</span>
                      <span>{problem.difficulty || "Unknown"}</span>
                    </div>
                    <h3>{problem.title}</h3>
                    <p>{problem.solutionLanguages.length} language{problem.solutionLanguages.length === 1 ? "" : "s"}</p>
                    <div className="coding-card-meta">
                      {problem.solutionLanguages.slice(0, 3).map((language) => (
                        <span className="coding-tag" key={`${problem.slug}-${language}`}>{language}</span>
                      ))}
                    </div>
                    <div className="card-row" style={{ gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
                      <span className={`ui-badge ${problem.verified ? "success" : "secondary"}`}>
                        {problem.verified ? "Verified" : "Captured"}
                      </span>
                      <span className="ui-badge accent">{formatDate(problem.solvedAt)}</span>
                    </div>
                    <div className="card-row" style={{ gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
                      <Link className="page-button compact" to={`/problems/${toPlatformSegment(problem.platform)}/${problem.slug}`}>
                        View Problem
                      </Link>
                      <Link className="page-button compact" to={`/codebase/${toPlatformSegment(problem.platform)}/${problem.slug}`}>
                        View Codebase
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No recent solves yet"
                message="Recent solved entries will appear here as coding-journal captures dated problem activity."
                compact
              />
            )}
          </SectionPanel>

          <SectionPanel eyebrow="Solutions" title="Latest multi-language solutions" description="Problems that already have more than one stored implementation language.">
            {analytics.multiLanguageProblems.length ? (
              <div className="coding-profile-grid">
                {analytics.multiLanguageProblems.map((problem) => (
                  <article className="glass-card" key={problem.slug || problem.title}>
                    <h3>{problem.title}</h3>
                    <p>{problem.solutionLanguages.join(", ")}</p>
                    <p>{problem.solutionLanguages.length} solution language{problem.solutionLanguages.length === 1 ? "" : "s"}</p>
                    <div className="card-row" style={{ gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
                      <Link className="page-button compact" to={`/codebase/${toPlatformSegment(problem.platform)}/${problem.slug}`}>
                        View Codebase
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No multi-language solutions yet"
                message="This section will populate automatically when a problem has solutions tracked in more than one language."
                compact
              />
            )}
          </SectionPanel>

          <SectionPanel eyebrow="Timeline" title="Learning timeline" description="Real solved and updated coding events, ordered from newest to oldest.">
            <div className="feature-grid">
              {analytics.timelineEvents.length ? (
                analytics.timelineEvents.map((event) => (
                  <article className="glass-card" key={`${event.title}-${String(event.date)}`}>
                    <div className="card-row" style={{ justifyContent: "space-between", gap: "12px" }}>
                      <h3>{event.title}</h3>
                      <span className={`ui-badge ${event.verified ? "success" : "accent"}`}>
                        {event.verified ? "Verified" : "Recorded"}
                      </span>
                    </div>
                    <p>{event.description}</p>
                    <span className="section-eyebrow">{formatDate(event.date)}</span>
                    <div style={{ marginTop: "16px" }}>
                      <Link className="page-button compact" to={event.link}>
                        View Problem
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <article className="glass-card">
                  <h3>No timeline events available</h3>
                  <p>
                    The live coding-journal feed does not contain enough dated problem events to build a profile timeline.
                  </p>
                </article>
              )}
            </div>
          </SectionPanel>
        </>
      ) : !loading && !error ? (
        <SectionPanel eyebrow="Empty" title="No Coding Data Yet">
          <EmptyState
            title="Coding profile is waiting for synced problem data"
            message="Once coding-journal publishes solved problems with dates and metadata, this page will fill in automatically."
          />
        </SectionPanel>
      ) : null}

      {loading ? (
        <SectionPanel eyebrow="Loading" title="Preparing Profile">
          <LoadingState title="Loading coding profile" message="Fetching live coding-journal data." />
        </SectionPanel>
      ) : error ? (
        <SectionPanel eyebrow="Issue" title="Profile Unavailable">
          <ErrorState title="Unable to load coding profile" message={error} />
        </SectionPanel>
      ) : null}
    </main>
  );
}
