import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getJournalProblems,
  toPlatformSegment,
  uniqueValues,
} from "../lib/codingJournal";

export default function CodebasePage() {
  const [problems, setProblems] = useState([]);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [verified, setVerified] = useState("All");
  const [tag, setTag] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    getJournalProblems()
      .then((data) => {
        if (ignore) return;
        setProblems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((fetchError) => {
        if (ignore) return;
        setError(fetchError.message || "Unable to load codebase entries from coding-journal.");
        setProblems([]);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const languages = useMemo(
    () => ["All", ...uniqueValues(problems.map((problem) => problem.language)).sort()],
    [problems]
  );

  const platforms = useMemo(
    () => ["All", ...uniqueValues(problems.map((problem) => problem.platform)).sort()],
    [problems]
  );

  const tags = useMemo(
    () => ["All", ...uniqueValues(problems.flatMap((problem) => problem.tags || [])).sort()],
    [problems]
  );

  const filteredProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return problems.filter((problem) => {
      const matchesSearch = [
        problem.title,
        problem.platform,
        problem.language,
        ...(problem.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesLanguage = language === "All" || problem.language === language;
      const matchesPlatform = platform === "All" || problem.platform === platform;
      const matchesVerified =
        verified === "All" ||
        (verified === "Verified" && problem.verified) ||
        (verified === "Unverified" && !problem.verified);
      const matchesTag = tag === "All" || (problem.tags || []).includes(tag);

      return (
        matchesSearch &&
        matchesLanguage &&
        matchesPlatform &&
        matchesVerified &&
        matchesTag
      );
    });
  }, [language, platform, problems, query, tag, verified]);

  const groupedMetrics = useMemo(() => {
    const byLanguage = problems.reduce((acc, problem) => {
      const key = problem.language || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const byPlatform = problems.reduce((acc, problem) => {
      const key = problem.platform || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const byTag = problems.reduce((acc, problem) => {
      for (const item of problem.tags || []) {
        acc[item] = (acc[item] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      languages: Object.entries(byLanguage),
      platforms: Object.entries(byPlatform),
      tags: Object.entries(byTag),
    };
  }, [problems]);

  const workflowSteps = [
    "Solve problem",
    "Run `cj add <platform> <slug>`",
    "Add solution + tests + explanation",
    "Run `cj verify`",
    "Run `cj publish`",
    "Portfolio updates automatically",
  ];

  const syncBadges = [
    "Verified by tests",
    "Powered by coding-journal",
    "No mock data",
    "Multi-platform ready",
  ];

  return (
    <main className="page-shell">
      <div className="page-header">
        <span className="section-eyebrow">Coding Journal Codebase</span>
        <h1>Codebase</h1>
        <p>
          Browse solved code grouped by language, tags, and platform with live entries pulled
          directly from coding-journal.
        </p>
      </div>

      <section className="section-panel">
        <span className="section-eyebrow">Workflow Guide</span>
        <h2>How this Codebase updates</h2>
        <div className="feature-grid">
          {workflowSteps.map((step, index) => (
            <article className="glass-card" key={step}>
              <h3>Step {index + 1}</h3>
              <p>{step}</p>
            </article>
          ))}
        </div>

        <div className="problem-grid" style={{ marginTop: "24px" }}>
          {syncBadges.map((badge) => (
            <article className="problem-card" key={badge}>
              <span className="problem-stat">Codebase</span>
              <h2>{badge}</h2>
            </article>
          ))}
        </div>
      </section>

      <section className="section-panel">
        <span className="section-eyebrow">Code Groups</span>
        <h2>By Language, Platform, and Tag</h2>

        {loading ? (
          <article className="glass-card">
            <h3>Loading code groups</h3>
            <p>Fetching grouped codebase data from coding-journal.</p>
          </article>
        ) : error ? (
          <article className="glass-card">
            <h3>Unable to load code groups</h3>
            <p>{error}</p>
          </article>
        ) : !problems.length ? (
          <article className="glass-card">
            <h3>No code entries found</h3>
            <p>coding-journal returned an empty problems feed.</p>
          </article>
        ) : (
          <div className="feature-grid">
            <article className="glass-card">
              <h3>Languages</h3>
              <p>{groupedMetrics.languages.map(([name, count]) => `${name} (${count})`).join(", ")}</p>
            </article>
            <article className="glass-card">
              <h3>Platforms</h3>
              <p>{groupedMetrics.platforms.map(([name, count]) => `${name} (${count})`).join(", ")}</p>
            </article>
            <article className="glass-card">
              <h3>Tags</h3>
              <p>{groupedMetrics.tags.map(([name, count]) => `${name} (${count})`).join(", ")}</p>
            </article>
          </div>
        )}
      </section>

      <section className="section-panel">
        <span className="section-eyebrow">Explorer</span>
        <h2>Browse Solved Code</h2>

        <div className="problem-toolbar problem-toolbar-wrap">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, language, platform, or tag..."
            aria-label="Search codebase"
          />
          <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Filter by language">
            {languages.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select value={platform} onChange={(event) => setPlatform(event.target.value)} aria-label="Filter by platform">
            {platforms.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select value={verified} onChange={(event) => setVerified(event.target.value)} aria-label="Filter by verification">
            <option value="All">All</option>
            <option value="Verified">Verified</option>
            <option value="Unverified">Unverified</option>
          </select>
          <select value={tag} onChange={(event) => setTag(event.target.value)} aria-label="Filter by tag">
            {tags.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <article className="glass-card">
            <h3>Loading codebase</h3>
            <p>Fetching solved code entries from coding-journal.</p>
          </article>
        ) : error ? (
          <article className="glass-card">
            <h3>Unable to load codebase</h3>
            <p>{error}</p>
          </article>
        ) : !filteredProblems.length ? (
          <article className="glass-card">
            <h3>No matching code entries</h3>
            <p>Try clearing one or more filters to see more solved code.</p>
          </article>
        ) : (
          <div className="problem-grid">
            {filteredProblems.map((problem) => (
              <Link
                key={`${problem.platform}-${problem.slug}`}
                className="problem-card"
                to={`/codebase/${toPlatformSegment(problem.platform)}/${problem.slug}`}
              >
                <span className="problem-stat">{problem.language || "Unknown"}</span>
                <h2>{problem.title}</h2>
                <p>Platform: {problem.platform}</p>
                <p>Difficulty: {problem.difficulty || "Unknown"}</p>
                <p>Verified: {problem.verified ? "Yes" : "No"}</p>
                <strong>{(problem.tags || []).length ? problem.tags.join(", ") : "Open Code"}</strong>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
