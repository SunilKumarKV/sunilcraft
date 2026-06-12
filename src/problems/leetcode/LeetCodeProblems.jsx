import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./LeetCodeProblems.css";

const STATS_URL =
  "https://raw.githubusercontent.com/SunilKumarKV/leetcode-sync/main/data/leetcode-stats.json";
const PROBLEMS_URL =
  "https://raw.githubusercontent.com/SunilKumarKV/leetcode-sync/main/data/leetcode-problems.json";
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

function formatDate(dateValue) {
  if (!dateValue) return "Recently solved";

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "Recently solved";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function difficultyClassName(difficulty) {
  return difficulty ? difficulty.toLowerCase() : "easy";
}

export default function LeetCodeProblems() {
  const [stats, setStats] = useState(null);
  const [problems, setProblems] = useState([]);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeetCodeData = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const [statsResponse, problemsResponse] = await Promise.all([
        fetch(STATS_URL, { signal }),
        fetch(PROBLEMS_URL, { signal }),
      ]);

      if (!statsResponse.ok || !problemsResponse.ok) {
        throw new Error("Unable to load the latest LeetCode sync data.");
      }

      const [statsData, problemsData] = await Promise.all([
        statsResponse.json(),
        problemsResponse.json(),
      ]);

      const normalizedProblems = Array.isArray(problemsData?.problems)
        ? [...problemsData.problems].sort(
            (a, b) => new Date(b.solvedAt || 0) - new Date(a.solvedAt || 0)
          )
        : [];

      setStats(statsData ?? null);
      setProblems(normalizedProblems);
    } catch (fetchError) {
      if (fetchError.name === "AbortError") return;
      setError(fetchError.message || "Something went wrong while loading LeetCode data.");
      setStats(null);
      setProblems([]);
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadLeetCodeData(controller.signal);
    return () => controller.abort();
  }, [loadLeetCodeData]);

  const filteredProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return problems.filter((problem) => {
      const matchesSearch = `${problem.title} ${problem.platform} ${problem.status}`
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesDifficulty =
        difficulty === "All" || problem.difficulty === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [difficulty, problems, query]);

  const updatedAt = stats?.updatedAt ? formatDate(stats.updatedAt) : null;
  const hasProblems = filteredProblems.length > 0;

  return (
    <main className="page-shell leetcode-page">
      <div className="page-header">
        <span className="section-eyebrow">Auto Synced</span>
        <h1>LeetCode Problems</h1>
        <p>
          Live problem-solving stats and recent accepted submissions, synced from
          the `leetcode-sync` repository.
        </p>
      </div>

      <div className="leetcode-stats-grid" aria-label="LeetCode statistics">
        <article className="leetcode-stat-card">
          <span className="leetcode-stat-value">{stats?.totalSolved ?? "--"}</span>
          <h2>Total Solved</h2>
          <p>All accepted LeetCode problems.</p>
        </article>

        <article className="leetcode-stat-card">
          <span className="leetcode-stat-value">{stats?.easySolved ?? "--"}</span>
          <h2>Easy Solved</h2>
          <p>Beginner-friendly problem solving.</p>
        </article>

        <article className="leetcode-stat-card">
          <span className="leetcode-stat-value">{stats?.mediumSolved ?? "--"}</span>
          <h2>Medium Solved</h2>
          <p>DSA and interview-level practice.</p>
        </article>

        <article className="leetcode-stat-card">
          <span className="leetcode-stat-value">{stats?.hardSolved ?? "--"}</span>
          <h2>Hard Solved</h2>
          <p>Advanced problem-solving challenges.</p>
        </article>

        <article className="leetcode-stat-card">
          <span className="leetcode-stat-value">{stats?.ranking ?? "--"}</span>
          <h2>Ranking</h2>
          <p>{updatedAt ? `Last synced ${updatedAt}.` : "Live sync in progress."}</p>
        </article>
      </div>

      <section className="section-panel leetcode-panel">
        <div className="leetcode-panel-header">
          <div>
            <span className="section-eyebrow">Recent Practice</span>
            <h2>Recently Solved Problems</h2>
            <p>
              Search by title, platform, or status and filter by difficulty while
              the latest synced solves stay in one place.
            </p>
          </div>
          <span className="leetcode-meta">
            {loading ? "Syncing latest data..." : `${filteredProblems.length} problem${filteredProblems.length === 1 ? "" : "s"} visible`}
          </span>
        </div>

        <div className="leetcode-toolbar">
          <input
            type="search"
            placeholder="Search problems..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search solved problems"
          />

          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            aria-label="Filter by difficulty"
          >
            {DIFFICULTIES.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <article className="leetcode-status-card" aria-live="polite">
            <strong>Loading LeetCode data</strong>
            Pulling the latest stats and recently solved problems from the synced repository.
          </article>
        ) : error ? (
          <article className="leetcode-status-card" aria-live="polite">
            <strong>Unable to load live LeetCode data</strong>
            {error}
            <div className="leetcode-error-actions">
                <button
                  type="button"
                  className="leetcode-button"
                  onClick={() => {
                    const controller = new AbortController();
                    loadLeetCodeData(controller.signal);
                  }}
                >
                  Retry
                </button>
            </div>
          </article>
        ) : !problems.length ? (
          <article className="leetcode-status-card" aria-live="polite">
            <strong>No solved problems synced yet</strong>
            The repository is reachable, but there are no recent solved problems in the feed yet.
          </article>
        ) : !hasProblems ? (
          <article className="leetcode-status-card" aria-live="polite">
            <strong>No matching problems found</strong>
            Try clearing the search or switching the difficulty filter to see more solved problems.
          </article>
        ) : (
          <>
            <div className="leetcode-table-shell">
              <table className="leetcode-table">
                <thead>
                  <tr>
                    <th scope="col">Problem</th>
                    <th scope="col">Difficulty</th>
                    <th scope="col">Platform</th>
                    <th scope="col">Status</th>
                    <th scope="col">View Link</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map((problem) => (
                    <tr key={problem.slug || problem.title}>
                      <td>
                        <div className="leetcode-problem-title">
                          <strong>{problem.title}</strong>
                          <small>Solved on {formatDate(problem.solvedAt)}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`leetcode-badge ${difficultyClassName(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td>{problem.platform}</td>
                      <td>{problem.status}</td>
                      <td>
                        <a href={problem.url} target="_blank" rel="noreferrer">
                          Open Problem
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="leetcode-mobile-list">
              {filteredProblems.map((problem) => (
                <article className="leetcode-mobile-card" key={problem.slug || problem.title}>
                  <div className="leetcode-problem-title">
                    <strong>{problem.title}</strong>
                    <small>Solved on {formatDate(problem.solvedAt)}</small>
                  </div>
                  <div className="leetcode-mobile-row">
                    <span>Difficulty</span>
                    <span className={`leetcode-badge ${difficultyClassName(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="leetcode-mobile-row">
                    <span>Platform</span>
                    <strong>{problem.platform}</strong>
                  </div>
                  <div className="leetcode-mobile-row">
                    <span>Status</span>
                    <strong>{problem.status}</strong>
                  </div>
                  <a href={problem.url} target="_blank" rel="noreferrer">
                    View Problem →
                  </a>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
