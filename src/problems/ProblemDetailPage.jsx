import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getJournalProblems,
  toPlatformSegment,
} from "../lib/codingJournal";
import PageHeader from "../components/ui/PageHeader";
import SectionPanel from "../components/ui/SectionPanel";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";

function copyText(text) {
  if (!text) return Promise.resolve();
  return navigator.clipboard.writeText(text);
}

function buildComplexity(problem) {
  if (problem.complexity) return problem.complexity;

  const parts = [];
  if (problem.timeComplexity) parts.push(`Time: ${problem.timeComplexity}`);
  if (problem.spaceComplexity) parts.push(`Space: ${problem.spaceComplexity}`);
  return parts.join(" • ");
}

export default function ProblemDetailPage() {
  const { platform, slug } = useParams();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("");

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

  const complexity = problem ? buildComplexity(problem) : "";
  const solutionCode = problem?.solutionCode || problem?.solution || problem?.code || "";

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Coding Journal Detail"
        title={problem?.title || "Problem Detail"}
        description="A verified problem entry with solution context pulled directly from coding-journal."
        align="left"
      />

      <div className="problem-toolbar problem-toolbar-wrap">
        <Link className="page-button compact" to="/problems">
          ← Back to Problems
        </Link>
        {problem?.url ? (
          <a className="page-button compact" href={problem.url} target="_blank" rel="noreferrer">
            Source URL
          </a>
        ) : null}
      </div>

      {loading ? (
        <SectionPanel eyebrow="Loading" title="Problem Detail">
          <LoadingState title="Loading problem detail" message="Fetching the latest solution data from coding-journal." />
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
          <div className="problem-grid">
            <article className="problem-card">
              <div className="card-row">
                <Badge tone="accent">{problem.platform}</Badge>
                <Badge>{problem.difficulty || "Unknown"}</Badge>
              </div>
              <h2>{problem.title}</h2>
              <p>Source problem metadata synced from coding-journal.</p>
            </article>
            <article className="problem-card">
              <div className="card-row">
                <Badge>{problem.language || "Unknown"}</Badge>
                <Badge tone={problem.verified ? "success" : "default"}>
                  {problem.verified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <h2>Verification</h2>
              <p>{problem.verified ? "This solution is marked as verified." : "This solution is not marked as verified yet."}</p>
            </article>
            <article className="problem-card">
              <div className="card-row">
                {(problem.tags || []).slice(0, 4).map((tagName) => (
                  <Badge key={tagName}>{tagName}</Badge>
                ))}
              </div>
              <h2>Tags</h2>
              <p>{(problem.tags || []).length ? `${(problem.tags || []).length} tags attached to this solution entry.` : "No tags added yet."}</p>
            </article>
            <article className="problem-card">
              <div className="card-row">
                <Badge>Complexity</Badge>
              </div>
              <h2>{complexity || "Unavailable"}</h2>
              <p>Time and space notes come from the coding-journal entry.</p>
            </article>
          </div>

          <SectionPanel eyebrow="Solution" title={problem.title}>
            <div className="feature-grid">
              {problem.explanation ? (
                <article className="glass-card">
                  <h3>Explanation</h3>
                  <p>{problem.explanation}</p>
                </article>
              ) : null}
              {complexity ? (
                <article className="glass-card">
                  <h3>Complexity</h3>
                  <p>{complexity}</p>
                </article>
              ) : null}
              <article className="glass-card">
                <h3>Verification Status</h3>
                <p>{problem.verified ? "Verified solution" : "Unverified solution"}</p>
              </article>
              {problem.url ? (
                <article className="glass-card">
                  <h3>Source URL</h3>
                  <a href={problem.url} target="_blank" rel="noreferrer">
                    {problem.url}
                  </a>
                </article>
              ) : null}
            </div>
          </SectionPanel>

          {solutionCode ? (
            <SectionPanel eyebrow="Implementation" title="Solution Code">
              <div className="problem-actions-row">
                <button
                  className={`copy-button ${copyState ? "copied" : ""}`}
                  type="button"
                  onClick={() => {
                    copyText(solutionCode).then(() => {
                      setCopyState("Code copied");
                      window.setTimeout(() => setCopyState(""), 1800);
                    });
                  }}
                >
                  Copy Code
                </button>
                {copyState ? <span className="problem-copy-state">{copyState}</span> : null}
              </div>
              <article className="problem-detail-card">
                <pre>
                  <code>{solutionCode}</code>
                </pre>
              </article>
            </SectionPanel>
          ) : null}
        </>
      )}
    </main>
  );
}
