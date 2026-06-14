import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DeveloperMetrics from "../components/DeveloperMetrics";
import { getJournalProblems, toPlatformSegment, uniqueValues } from "../lib/codingJournal";

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

  const platforms = useMemo(
    () => ["All", ...uniqueValues(problems.map((problem) => problem.platform)).sort()],
    [problems]
  );

  const difficulties = useMemo(
    () => ["All", ...uniqueValues(problems.map((problem) => problem.difficulty)).sort()],
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
        problem.difficulty,
        problem.language,
        ...(problem.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesPlatform = platform === "All" || problem.platform === platform;
      const matchesDifficulty =
        difficulty === "All" || problem.difficulty === difficulty;
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
  }, [difficulty, platform, problems, query, tag, verified]);

  return (
    <main className="page-shell problems-home">
      <div className="page-header">
        <span className="section-eyebrow">Coding Journal</span>
        <h1>Problems</h1>
        <p>
          Search and filter verified coding problems across platforms with data loaded live from
          coding-journal.
        </p>
      </div>

      <DeveloperMetrics />

      <section className="section-panel">
        <span className="section-eyebrow">Problem Explorer</span>
        <h2>Browse Problems</h2>

        <div className="problem-toolbar problem-toolbar-wrap">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, platform, language, or tag..."
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
        </div>

        {loading ? (
          <article className="glass-card">
            <h3>Loading problems</h3>
            <p>Fetching the latest problems feed from coding-journal.</p>
          </article>
        ) : error ? (
          <article className="glass-card">
            <h3>Unable to load problems</h3>
            <p>{error}</p>
          </article>
        ) : !problems.length ? (
          <article className="glass-card">
            <h3>No problems found</h3>
            <p>coding-journal returned an empty problems feed.</p>
          </article>
        ) : !filteredProblems.length ? (
          <article className="glass-card">
            <h3>No matching problems</h3>
            <p>Try clearing one or more filters to see more results.</p>
          </article>
        ) : (
          <div className="problem-grid">
            {filteredProblems.map((problem) => (
              <Link
                to={`/problems/${toPlatformSegment(problem.platform)}/${problem.slug}`}
                className="problem-card"
                key={`${problem.platform}-${problem.slug}`}
              >
                <span className="problem-stat">{problem.platform}</span>
                <h2>{problem.title}</h2>
                <p>Difficulty: {problem.difficulty || "Unknown"}</p>
                <p>Verified: {problem.verified ? "Yes" : "No"}</p>
                <p>Tags: {(problem.tags || []).length ? problem.tags.join(", ") : "None"}</p>
                <strong>{problem.language || "Unknown language"}</strong>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
