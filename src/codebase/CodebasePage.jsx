import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getJournalProblems,
  getProblemLanguages,
  normalizeProblemSolutions,
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

function getExplanationAvailable(problem) {
  return Boolean(String(problem.explanation || "").trim());
}

function getTestsAvailable(problem) {
  return Boolean(problem.verified);
}

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

  const libraryEntries = useMemo(
    () =>
      problems.filter((problem) => normalizeProblemSolutions(problem).length || getExplanationAvailable(problem)),
    [problems]
  );

  const languages = useMemo(
    () => [
      "All",
      ...uniqueValues(libraryEntries.flatMap((problem) => getProblemLanguages(problem))).sort(),
    ],
    [libraryEntries]
  );

  const platforms = useMemo(
    () => ["All", ...uniqueValues(libraryEntries.map((problem) => problem.platform)).sort()],
    [libraryEntries]
  );

  const tags = useMemo(
    () => ["All", ...uniqueValues(libraryEntries.flatMap((problem) => problem.tags || [])).sort()],
    [libraryEntries]
  );

  const filteredProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return libraryEntries.filter((problem) => {
      const solutionLanguages = getProblemLanguages(problem);
      const matchesSearch = [
        problem.title,
        problem.platform,
        problem.difficulty,
        ...solutionLanguages,
        ...(problem.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesLanguage = language === "All" || solutionLanguages.includes(language);
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
  }, [language, libraryEntries, platform, query, tag, verified]);

  const libraryStats = useMemo(() => {
    const verifiedCount = libraryEntries.filter((problem) => problem.verified).length;
    const withExplanation = libraryEntries.filter((problem) => getExplanationAvailable(problem)).length;
    const solutionCount = libraryEntries.reduce(
      (total, problem) => total + normalizeProblemSolutions(problem).length,
      0
    );
    const languagesTracked = uniqueValues(
      libraryEntries.flatMap((problem) => getProblemLanguages(problem))
    ).length;

    return {
      verifiedCount,
      withExplanation,
      solutionCount,
      languagesTracked,
    };
  }, [libraryEntries]);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Verified Solution Library"
        title="Codebase"
        description="A solution library for code, explanations, language variants, verification status, and complexity notes from coding-journal."
        align="left"
      />

      <SectionPanel
        eyebrow="Library Overview"
        title="What this library contains"
        description="This page is for implementation depth: source code, explanation quality, language coverage, and verification detail."
      >
        {loading ? (
          <LoadingState title="Loading codebase overview" message="Preparing the solution library from coding-journal." />
        ) : error ? (
          <ErrorState title="Unable to load codebase overview" message={error} />
        ) : !libraryEntries.length ? (
          <EmptyState title="No codebase entries found" message="coding-journal did not return any solution entries." />
        ) : (
          <div className="problem-grid">
            <article className="problem-card stat-card">
              <span className="problem-stat">Entries</span>
              <h2>{libraryEntries.length}</h2>
              <p>Problems with solution material available.</p>
            </article>
            <article className="problem-card stat-card">
              <span className="problem-stat">Solutions</span>
              <h2>{libraryStats.solutionCount}</h2>
              <p>Total solutions published across all languages.</p>
            </article>
            <article className="problem-card stat-card">
              <span className="problem-stat">Verified</span>
              <h2>{libraryStats.verifiedCount}</h2>
              <p>Entries currently marked as verified.</p>
            </article>
            <article className="problem-card stat-card">
              <span className="problem-stat">Explanations</span>
              <h2>{libraryStats.withExplanation}</h2>
              <p>Entries with markdown explanations available.</p>
            </article>
            <article className="problem-card stat-card">
              <span className="problem-stat">Languages</span>
              <h2>{libraryStats.languagesTracked}</h2>
              <p>Programming languages represented in the library.</p>
            </article>
          </div>
        )}
      </SectionPanel>

      <SectionPanel
        eyebrow="Explorer"
        title="Browse solution articles"
        description="Search the code library by title, platform, tags, languages, and verification status."
      >
        <FilterBar>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, platform, language, or tag..."
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
          <LoadingState title="Loading solution library" message="Fetching codebase entries from coding-journal." />
        ) : error ? (
          <ErrorState title="Unable to load solution library" message={error} />
        ) : !filteredProblems.length ? (
          <EmptyState title="No matching codebase entries" message="Try clearing one or more filters to see more solution articles." />
        ) : (
          <div className="problem-grid">
            {filteredProblems.map((problem) => {
              const solutions = normalizeProblemSolutions(problem);
              const solutionLanguages = getProblemLanguages(problem);

              return (
                <Link
                  key={`${problem.platform}-${problem.slug}`}
                  className="problem-card codebase-card"
                  to={`/codebase/${toPlatformSegment(problem.platform)}/${problem.slug}`}
                >
                  <div className="card-row">
                    <Badge tone="accent">{problem.platform}</Badge>
                    <Badge>{problem.difficulty || "Unknown"}</Badge>
                    {problem.verified ? <Badge tone="success">Verified</Badge> : null}
                  </div>
                  <h2>{problem.title}</h2>
                  <div className="card-row">
                    <Badge>{solutions.length} {solutions.length === 1 ? "Solution" : "Solutions"}</Badge>
                    <Badge>{solutionLanguages.length} {solutionLanguages.length === 1 ? "Language" : "Languages"}</Badge>
                    {getExplanationAvailable(problem) ? <Badge tone="success">Explanation Available</Badge> : null}
                    {getTestsAvailable(problem) ? <Badge tone="success">Tests Available</Badge> : <Badge>Tests Pending</Badge>}
                  </div>
                  {solutionLanguages.length ? (
                    <div className="card-row">
                      {solutionLanguages.slice(0, 4).map((languageName) => (
                        <Badge key={languageName}>{languageName}</Badge>
                      ))}
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>
        )}
      </SectionPanel>
    </main>
  );
}
