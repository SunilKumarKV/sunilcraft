import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getJournalProblems,
  toPlatformSegment,
  uniqueValues,
} from "../lib/codingJournal";
import PageHeader from "../components/ui/PageHeader";
import SectionPanel from "../components/ui/SectionPanel";
import FilterBar from "../components/ui/FilterBar";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";

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

  const librarySummary = useMemo(
    () => ({
      entries: problems.length,
      verifiedCount: problems.filter((problem) => problem.verified).length,
      languages: Math.max(0, languages.length - 1),
      platforms: Math.max(0, platforms.length - 1),
    }),
    [languages.length, platforms.length, problems]
  );

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Coding Journal Codebase"
        title="Codebase"
        description="My personal solution library with source code, tests, explanations, and complexity notes."
        align="left"
        className="page-header-library"
      />

      <section className="page-meta-strip compact">
        <article className="meta-strip-card">
          <span>Entries</span>
          <strong>{librarySummary.entries}</strong>
        </article>
        <article className="meta-strip-card">
          <span>Verified</span>
          <strong>{librarySummary.verifiedCount}</strong>
        </article>
        <article className="meta-strip-card">
          <span>Languages</span>
          <strong>{librarySummary.languages}</strong>
        </article>
        <article className="meta-strip-card">
          <span>Platforms</span>
          <strong>{librarySummary.platforms}</strong>
        </article>
      </section>

      <SectionPanel eyebrow="Workflow Guide" title="How this Codebase updates" className="workflow-panel">
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
            <article className="problem-card compact-card" key={badge}>
              <span className="problem-stat">Codebase</span>
              <h2>{badge}</h2>
            </article>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel eyebrow="Code Groups" title="By Language, Platform, and Tag" className="library-groups-panel">
        {loading ? (
          <LoadingState title="Loading code groups" message="Fetching grouped codebase data from coding-journal." />
        ) : error ? (
          <ErrorState title="Unable to load code groups" message={error} />
        ) : !problems.length ? (
          <EmptyState title="No code entries found" message="coding-journal returned an empty problems feed." />
        ) : (
          <div className="feature-grid">
            <article className="glass-card">
              <h3>Languages</h3>
              <div className="card-row">
                {groupedMetrics.languages.map(([name, count]) => (
                  <Badge key={name}>{name} ({count})</Badge>
                ))}
              </div>
            </article>
            <article className="glass-card">
              <h3>Platforms</h3>
              <div className="card-row">
                {groupedMetrics.platforms.map(([name, count]) => (
                  <Badge key={name} tone="accent">{name} ({count})</Badge>
                ))}
              </div>
            </article>
            <article className="glass-card">
              <h3>Tags</h3>
              <div className="card-row">
                {groupedMetrics.tags.slice(0, 10).map(([name, count]) => (
                  <Badge key={name}>{name} ({count})</Badge>
                ))}
              </div>
            </article>
          </div>
        )}
      </SectionPanel>

      <SectionPanel
        eyebrow="Explorer"
        title="Browse Solved Code"
        description="Move from grouped insights into full source-backed entries with explanation and complexity notes."
        className="explorer-panel"
      >
        <FilterBar
          title="Solution library"
          description="Search by title, language, platform, verification state, or tags."
        >
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
        </FilterBar>

        {loading ? (
          <LoadingState title="Loading codebase" message="Fetching solved code entries from coding-journal." />
        ) : error ? (
          <ErrorState title="Unable to load codebase" message={error} />
        ) : !filteredProblems.length ? (
          <EmptyState title="No matching code entries" message="Try clearing one or more filters to see more solved code." />
        ) : (
          <div className="page-two-column explorer-two-column">
            <aside className="glass-card sidebar-panel code-focus-panel">
              <h3>What makes this different</h3>
              <p>This page is for source-backed entries with explanation notes, reusable implementation detail, and verification signals.</p>
              <div className="sidebar-stat-list">
                <div><span>Visible results</span><strong>{filteredProblems.length}</strong></div>
                <div><span>Verified entries</span><strong>{librarySummary.verifiedCount}</strong></div>
                <div><span>Languages used</span><strong>{librarySummary.languages}</strong></div>
              </div>
            </aside>

            <div className="problem-grid">
              {filteredProblems.map((problem) => (
                <Link
                  key={`${problem.platform}-${problem.slug}`}
                  className="problem-card"
                  to={`/codebase/${toPlatformSegment(problem.platform)}/${problem.slug}`}
                >
                  <div className="card-row">
                    <Badge tone="accent">{problem.platform}</Badge>
                    <Badge>{problem.difficulty || "Unknown"}</Badge>
                    <Badge>{problem.language || "Unknown"}</Badge>
                    {problem.verified ? <Badge tone="success">Verified</Badge> : null}
                  </div>
                  <h2>{problem.title}</h2>
                  {(problem.tags || []).length ? (
                    <div className="card-row">
                      {problem.tags.slice(0, 4).map((tagName) => (
                        <Badge key={tagName}>{tagName}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p>Open the entry for source code, notes, and verification details.</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </SectionPanel>
    </main>
  );
}
