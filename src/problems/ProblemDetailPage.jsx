import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  formatDate,
  getProblemLanguages,
  getProblemPrimaryUrl,
  getJournalProblems,
  getProblemSolvedAt,
  hasProblemCode,
  normalizePlatformName,
  toPlatformSegment,
} from "../lib/codingJournal";
import PageHeader from "../components/ui/PageHeader";
import SectionPanel from "../components/ui/SectionPanel";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";

export default function ProblemDetailPage() {
  const { platform, slug } = useParams();
  const [problems, setProblems] = useState([]);
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
        setError(fetchError.message || "Unable to load problem details from coding-journal.");
        setProblems([]);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const problem = useMemo(
    () =>
      problems.find(
        (item) => item.slug === slug && toPlatformSegment(item.platform) === platform
      ) || null,
    [platform, problems, slug]
  );

  const solvedAt = problem ? getProblemSolvedAt(problem) : "";
  const hasCode = problem ? hasProblemCode(problem) : false;
  const problemUrl = problem ? getProblemPrimaryUrl(problem) : "";
  const acceptedLanguages = problem ? getProblemLanguages(problem) : [];

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Problem Tracker Entry"
        title={problem?.title || "Problem Detail"}
        description="Problem metadata, status, and verification details without exposing the solution code on the tracker side."
        align="left"
      />

      <div className="problem-toolbar problem-toolbar-wrap">
        <Link className="page-button compact" to="/problems">
          ← Back to Problems
        </Link>
        {problemUrl ? (
          <a className="page-button compact" href={problemUrl} target="_blank" rel="noreferrer">
            Original Problem
          </a>
        ) : null}
        {problem && hasCode ? (
          <Link className="page-button compact" to={`/codebase/${toPlatformSegment(problem.platform)}/${problem.slug}`}>
            View Solution in Codebase
          </Link>
        ) : null}
      </div>

      {loading ? (
        <SectionPanel eyebrow="Loading" title="Problem Detail">
          <LoadingState title="Loading problem detail" message="Fetching problem metadata from coding-journal." />
        </SectionPanel>
      ) : error ? (
        <SectionPanel eyebrow="Issue" title="Problem Detail">
          <ErrorState title="Unable to load problem detail" message={error} />
        </SectionPanel>
      ) : !problem ? (
        <SectionPanel eyebrow="Missing" title="Problem Detail">
          <EmptyState title="Problem not found" message="No coding-journal problem matched this platform and slug." />
        </SectionPanel>
      ) : (
        <>
          <SectionPanel
            eyebrow="Metadata"
            title={problem.title}
            description="This detail view stays focused on the problem record itself: platform, difficulty, status, and verification."
          >
            <div className="problem-grid">
              <article className="problem-card">
                <div className="card-row">
                  <Badge tone="accent">{normalizePlatformName(problem.platform)}</Badge>
                  <Badge>{problem.rating ? `Rating ${problem.rating}` : problem.difficulty || "Unknown"}</Badge>
                </div>
                <h2>Platform and Difficulty</h2>
                <p>
                  {normalizePlatformName(problem.platform)} • {problem.rating ? `Rating ${problem.rating}` : problem.difficulty || "Difficulty not set"}
                </p>
              </article>
              <article className="problem-card">
                <div className="card-row">
                  <Badge>{problem.status || "Solved"}</Badge>
                  <Badge tone={problem.verified ? "success" : "default"}>
                    {problem.verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <h2>Status</h2>
                <p>
                  {problem.verified
                    ? "This problem record has been verified."
                    : "This problem record is still pending verification."}
                </p>
              </article>
              <article className="problem-card">
                <div className="card-row">
                  {(problem.tags || []).slice(0, 4).map((tagName) => (
                    <Badge key={tagName}>{tagName}</Badge>
                  ))}
                </div>
                <h2>Tags</h2>
                <p>
                  {(problem.tags || []).length
                    ? `${(problem.tags || []).length} topic tags attached to this problem.`
                    : "No topic tags attached yet."}
                </p>
              </article>
              <article className="problem-card">
                <div className="card-row">
                  <Badge>Progress</Badge>
                </div>
                <h2>{solvedAt ? formatDate(solvedAt) : "Date unavailable"}</h2>
                <p>{solvedAt ? "Recorded in the tracked problem history." : "No solved date was provided in the current feed."}</p>
              </article>
              <article className="problem-card">
                <div className="card-row">
                  <Badge>{acceptedLanguages.length ? "Accepted language" : "Language unavailable"}</Badge>
                  {!hasCode ? <Badge>Metadata only</Badge> : <Badge tone="success">Code attached</Badge>}
                </div>
                <h2>{acceptedLanguages.length ? acceptedLanguages.join(", ") : "No accepted language recorded"}</h2>
                <p>
                  {acceptedLanguages.length
                    ? "Accepted submission language captured from coding-journal metadata."
                    : "No accepted submission language was provided in the current feed."}
                </p>
              </article>
            </div>
          </SectionPanel>

          {hasCode ? (
            <SectionPanel
              eyebrow="Next Step"
              title="Open the engineering-side solution"
              description="Problems tracks progress. Codebase is where the implementation, explanation, languages, and complexity notes live."
            >
              <div className="cta-panel">
                <div>
                  <h3>View the full solution article</h3>
                  <p>Open the Codebase detail page for code, explanations, multiple languages, and complexity breakdowns.</p>
                </div>
                <div className="problem-actions-row">
                  <Link className="page-button compact" to={`/codebase/${toPlatformSegment(problem.platform)}/${problem.slug}`}>
                    View Solution in Codebase
                  </Link>
                </div>
              </div>
            </SectionPanel>
          ) : (
            <SectionPanel
              eyebrow="Code Missing"
              title="Solution code has not been attached yet."
              description="This problem was imported as metadata-only activity, so the tracker can show the accepted record even without a checked-in solution file."
            >
              <div className="cta-panel">
                <div>
                  <h3>Attach code in coding-journal using `cj import-submission`</h3>
                  <p>Once a solution file is attached and published, this problem can appear in the Codebase library as a full engineering entry.</p>
                </div>
              </div>
            </SectionPanel>
          )}
        </>
      )}
    </main>
  );
}
