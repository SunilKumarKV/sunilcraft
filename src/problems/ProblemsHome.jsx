import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import SectionPanel from "../components/ui/SectionPanel";
import FilterBar from "../components/ui/FilterBar";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import {
  formatDate,
  getJournalProblems,
  getProblemLanguages,
  getProblemSolvedAt,
  hasProblemCode,
  isPlatformProfileSummary,
  normalizePlatformName,
  toPlatformSegment,
  uniqueValues,
} from "../lib/codingJournal";

function sortBySolvedDate(items) {
  return [...items].sort((a, b) => {
    const aDate = new Date(getProblemSolvedAt(a) || 0).getTime();
    const bDate = new Date(getProblemSolvedAt(b) || 0).getTime();

    if (aDate && bDate && aDate !== bDate) {
      return bDate - aDate;
    }
    if (aDate) return -1;
    if (bDate) return 1;
    return 0;
  });
}

function countBy(items, selector) {
  return items.reduce((acc, item) => {
    const key = selector(item);
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export default function ProblemsHome() {
  const [problems, setProblems] = useState([]);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
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
        setError(fetchError.message || "Unable to load problems from coding-journal.");
        setProblems([]);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const solvedProblems = useMemo(
    () =>
      problems.filter(
        (problem) => !isPlatformProfileSummary(problem) && (problem.status || "Solved") === "Solved"
      ),
    [problems]
  );

  const profileSummaries = useMemo(
    () => problems.filter((problem) => isPlatformProfileSummary(problem)),
    [problems]
  );

  const platforms = useMemo(
    () => ["All", ...uniqueValues(solvedProblems.map((problem) => normalizePlatformName(problem.platform))).sort()],
    [solvedProblems]
  );

  const difficulties = useMemo(
    () => ["All", ...uniqueValues(solvedProblems.map((problem) => problem.difficulty)).sort()],
    [solvedProblems]
  );

  const tags = useMemo(
    () => ["All", ...uniqueValues(solvedProblems.flatMap((problem) => problem.tags || [])).sort()],
    [solvedProblems]
  );

  const filteredProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return solvedProblems.filter((problem) => {
      const matchesSearch = [
        problem.title,
        normalizePlatformName(problem.platform),
        problem.difficulty,
        problem.rating,
        ...getProblemLanguages(problem),
        ...(problem.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesPlatform = platform === "All" || normalizePlatformName(problem.platform) === platform;
      const matchesDifficulty = difficulty === "All" || problem.difficulty === difficulty;
      const matchesVerified =
        verified === "All" ||
        (verified === "Verified" && problem.verified) ||
        (verified === "Unverified" && !problem.verified);
      const matchesTag = tag === "All" || (problem.tags || []).includes(tag);

      return (
        matchesSearch &&
        matchesPlatform &&
        matchesDifficulty &&
        matchesVerified &&
        matchesTag
      );
    });
  }, [difficulty, platform, query, solvedProblems, tag, verified]);

  const analytics = useMemo(() => {
    const verifiedCount = solvedProblems.filter((problem) => problem.verified).length;
    const byDifficulty = countBy(solvedProblems, (problem) => problem.difficulty || "Unknown");
    const byPlatform = Object.entries(countBy(solvedProblems, (problem) => normalizePlatformName(problem.platform) || "Unknown"))
      .sort((a, b) => b[1] - a[1]);
    const byTag = Object.entries(
      solvedProblems.reduce((acc, problem) => {
        for (const item of problem.tags || []) {
          acc[item] = (acc[item] || 0) + 1;
        }
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]);

    return {
      totalSolved: solvedProblems.length,
      verifiedSolved: verifiedCount,
      easy: byDifficulty.Easy || 0,
      medium: byDifficulty.Medium || 0,
      hard: byDifficulty.Hard || 0,
      platforms: byPlatform,
      tags: byTag,
      recent: solvedProblems.some((problem) => getProblemSolvedAt(problem))
        ? sortBySolvedDate(solvedProblems).slice(0, 6)
        : solvedProblems.slice(0, 6),
    };
  }, [solvedProblems]);

  return (
    <main className="page-shell problems-home">
      <PageHeader
        eyebrow="Problem Solving Tracker"
        title="Problems"
        description="A progress tracker for solved problems, verification, platforms, and topic coverage without showing full solution articles."
        align="left"
      />

      <SectionPanel
        eyebrow="Overview"
        title="Solved progress"
        description="A tracker-first summary of volume, verification, and difficulty coverage."
      >
        {loading ? (
          <LoadingState title="Loading tracker" message="Fetching solved problem history from coding-journal." />
        ) : error ? (
          <ErrorState title="Unable to load tracker" message={error} />
        ) : !solvedProblems.length ? (
          <EmptyState title="No solved problems yet" message="coding-journal does not contain solved problem history yet." />
        ) : (
          <div className="problem-grid">
            <article className="problem-card stat-card">
              <span className="problem-stat">Solved</span>
              <h2>{analytics.totalSolved}</h2>
              <p>Total solved problems tracked in coding-journal.</p>
            </article>
            <article className="problem-card stat-card">
              <span className="problem-stat">Verified</span>
              <h2>{analytics.verifiedSolved}</h2>
              <p>Entries currently marked as verified.</p>
            </article>
            <article className="problem-card stat-card">
              <span className="problem-stat">Easy</span>
              <h2>{analytics.easy}</h2>
              <p>Easy problems completed so far.</p>
            </article>
            <article className="problem-card stat-card">
              <span className="problem-stat">Medium</span>
              <h2>{analytics.medium}</h2>
              <p>Medium problems completed so far.</p>
            </article>
            <article className="problem-card stat-card">
              <span className="problem-stat">Hard</span>
              <h2>{analytics.hard}</h2>
              <p>Hard problems completed so far.</p>
            </article>
          </div>
        )}
      </SectionPanel>

      {profileSummaries.length ? (
        <SectionPanel
          eyebrow="Platform Summary"
          title="Profile summary records"
          description="Some platforms currently sync solved totals as profile summaries rather than individual problem records."
        >
          <div className="feature-grid">
            {profileSummaries.map((summary) => (
              <article className="glass-card" key={summary.slug}>
                <div className="card-row">
                  <Badge tone="accent">{normalizePlatformName(summary.platform)}</Badge>
                  <Badge>{Number(summary.solvedCount) || 0} solved</Badge>
                </div>
                <h3>{summary.username || summary.slug}</h3>
                <p>Source: {(summary.source || "profile summary").replace(/-/g, " ")}</p>
                {summary.username ? <p>Username: {summary.username}</p> : null}
              </article>
            ))}
          </div>
        </SectionPanel>
      ) : null}

      <SectionPanel
        eyebrow="Coverage"
        title="Platforms and topics"
        description="Use this page to understand where problem-solving effort is concentrated over time."
      >
        {loading ? (
          <LoadingState title="Loading coverage" message="Preparing platform and topic breakdowns." />
        ) : error ? (
          <ErrorState title="Unable to load coverage" message={error} />
        ) : (
          <div className="feature-grid">
            <article className="glass-card">
              <h3>Platform Breakdown</h3>
              {analytics.platforms.length ? (
                <div className="metric-list">
                  {analytics.platforms.map(([name, count]) => (
                    <div className="metric-list-row" key={name}>
                      <span>{name}</span>
                      <strong>{count}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No platform data available yet.</p>
              )}
            </article>
            <article className="glass-card">
              <h3>Topic Breakdown</h3>
              {analytics.tags.length ? (
                <div className="tag-cloud">
                  {analytics.tags.slice(0, 12).map(([name, count]) => (
                    <Badge key={name}>{name} ({count})</Badge>
                  ))}
                </div>
              ) : (
                <p>No topic tags available yet.</p>
              )}
            </article>
            <article className="glass-card">
              <h3>Recently Solved</h3>
              {analytics.recent.length ? (
                <div className="recent-problem-list">
                  {analytics.recent.slice(0, 4).map((problem) => (
                    <Link
                      key={`${problem.platform}-${problem.slug}`}
                      className="recent-problem-item"
                      to={`/problems/${toPlatformSegment(problem.platform)}/${problem.slug}`}
                    >
                      <strong>{problem.title}</strong>
                      <span>
                        {normalizePlatformName(problem.platform)} • {problem.rating ? `Rating ${problem.rating}` : problem.difficulty || "Unknown"}
                        {getProblemSolvedAt(problem) ? ` • ${formatDate(getProblemSolvedAt(problem))}` : ""}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>No recent problem history available yet.</p>
              )}
            </article>
          </div>
        )}
      </SectionPanel>

      <SectionPanel
        eyebrow="History"
        title="Search problem history"
        description="Filter the solved record by platform, difficulty, verification, and tags."
      >
        <FilterBar>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, platform, difficulty, or tag..."
            aria-label="Search problems"
          />
          <select value={platform} onChange={(event) => setPlatform(event.target.value)} aria-label="Filter by platform">
            {platforms.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} aria-label="Filter by difficulty">
            {difficulties.map((option) => (
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
          <LoadingState title="Loading problem history" message="Fetching the latest problem feed from coding-journal." />
        ) : error ? (
          <ErrorState title="Unable to load problem history" message={error} />
        ) : !filteredProblems.length ? (
          <EmptyState title="No matching problems" message="Try clearing one or more filters to see more solved history." />
        ) : (
          <div className="problem-grid">
            {filteredProblems.map((problem) => (
              <Link
                to={`/problems/${toPlatformSegment(problem.platform)}/${problem.slug}`}
                className="problem-card"
                key={`${problem.platform}-${problem.slug}`}
              >
                <div className="card-row">
                  <Badge tone="accent">{normalizePlatformName(problem.platform)}</Badge>
                  <Badge>{problem.rating ? `Rating ${problem.rating}` : problem.difficulty || "Unknown"}</Badge>
                  <Badge>{problem.status || "Solved"}</Badge>
                  {problem.verified ? <Badge tone="success">Verified</Badge> : null}
                  {!hasProblemCode(problem) ? (
                    <Badge>Metadata only</Badge>
                  ) : null}
                </div>
                <h2>{problem.title}</h2>
                {(problem.tags || []).length ? (
                  <div className="card-row">
                    {problem.tags.slice(0, 4).map((tagName) => (
                      <Badge key={tagName}>{tagName}</Badge>
                    ))}
                  </div>
                ) : (
                  <p>No tags attached yet.</p>
                )}
                {getProblemLanguages(problem).length ? (
                  <p>Accepted language: {getProblemLanguages(problem).join(", ")}</p>
                ) : null}
                {getProblemSolvedAt(problem) ? (
                  <p className="tracker-date">Solved {formatDate(getProblemSolvedAt(problem))}</p>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </SectionPanel>
    </main>
  );
}
