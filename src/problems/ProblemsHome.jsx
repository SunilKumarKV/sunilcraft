import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DeveloperMetrics from "../components/DeveloperMetrics";
import PageHeader from "../components/ui/PageHeader";
import SectionPanel from "../components/ui/SectionPanel";
import FilterBar from "../components/ui/FilterBar";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
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

  const problemSummary = useMemo(() => {
    const verifiedCount = problems.filter((problem) => problem.verified).length;
    return {
      total: problems.length,
      verified: verifiedCount,
      platforms: Math.max(0, platforms.length - 1),
      tags: Math.max(0, tags.length - 1),
    };
  }, [platforms.length, problems, tags.length]);

  return (
    <main className="page-shell problems-home">
      <PageHeader
        eyebrow="Coding Journal"
        title="Problems"
        description="A verified record of coding problems I’ve solved, tested, and documented."
        align="left"
        className="page-header-journal"
      />

      <section className="page-meta-strip compact">
        <article className="meta-strip-card">
          <span>Total</span>
          <strong>{problemSummary.total}</strong>
        </article>
        <article className="meta-strip-card">
          <span>Verified</span>
          <strong>{problemSummary.verified}</strong>
        </article>
        <article className="meta-strip-card">
          <span>Platforms</span>
          <strong>{problemSummary.platforms}</strong>
        </article>
        <article className="meta-strip-card">
          <span>Tags</span>
          <strong>{problemSummary.tags}</strong>
        </article>
      </section>

      <SectionPanel
        eyebrow="Problem Explorer"
        title="Browse Problems"
        description="Search the journal feed, then move directly into platform-specific detail pages."
        className="explorer-panel"
      >
        <FilterBar
          title="Coding-journal explorer"
          description="Filter by platform, difficulty, verification status, and tags without leaving the page."
        >
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
        </FilterBar>

        {loading ? (
          <LoadingState title="Loading problems" message="Fetching the latest problems feed from coding-journal." />
        ) : error ? (
          <ErrorState title="Unable to load problems" message={error} />
        ) : !problems.length ? (
          <EmptyState title="No problems found" message="coding-journal returned an empty problems feed." />
        ) : !filteredProblems.length ? (
          <EmptyState title="No matching problems" message="Try clearing one or more filters to see more results." />
        ) : (
          <div className="page-two-column explorer-two-column">
            <aside className="glass-card sidebar-panel">
              <h3>Explorer Notes</h3>
              <p>Everything here is pulled from coding-journal. Verified entries are the fastest way to inspect tested and documented work.</p>
              <div className="sidebar-stat-list">
                <div><span>Visible results</span><strong>{filteredProblems.length}</strong></div>
                <div><span>Verified in feed</span><strong>{problemSummary.verified}</strong></div>
                <div><span>Platforms tracked</span><strong>{problemSummary.platforms}</strong></div>
              </div>
            </aside>

            <div className="problem-grid">
              {filteredProblems.map((problem) => (
                <Link
                  to={`/problems/${toPlatformSegment(problem.platform)}/${problem.slug}`}
                  className="problem-card"
                  key={`${problem.platform}-${problem.slug}`}
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
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        )}
      </SectionPanel>

      <DeveloperMetrics title="Developer Activity" />
    </main>
  );
}
