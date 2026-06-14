import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getJournalProblems,
  toPlatformSegment,
} from "../lib/codingJournal";

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
      <div className="page-header">
        <span className="section-eyebrow">Coding Journal Detail</span>
        <h1>{problem?.title || "Problem Detail"}</h1>
        <p>
          Live problem metadata and solution notes loaded from coding-journal without any hardcoded
          fallback content.
        </p>
      </div>

      <div className="problem-toolbar">
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
        <section className="section-panel">
          <article className="glass-card">
            <h3>Loading problem detail</h3>
            <p>Fetching the latest solution data from coding-journal.</p>
          </article>
        </section>
      ) : error ? (
        <section className="section-panel">
          <article className="glass-card">
            <h3>Unable to load problem detail</h3>
            <p>{error}</p>
          </article>
        </section>
      ) : !problem ? (
        <section className="section-panel">
          <article className="glass-card">
            <h3>Problem not found</h3>
            <p>No coding-journal problem matched this platform and slug.</p>
          </article>
        </section>
      ) : (
        <>
          <div className="problem-grid">
            <article className="problem-card">
              <span className="problem-stat">Platform</span>
              <h2>{problem.platform}</h2>
              <p>Difficulty: {problem.difficulty || "Unknown"}</p>
            </article>
            <article className="problem-card">
              <span className="problem-stat">Verification</span>
              <h2>{problem.verified ? "Verified" : "Not Verified"}</h2>
              <p>Language: {problem.language || "Unknown"}</p>
            </article>
            <article className="problem-card">
              <span className="problem-stat">Tags</span>
              <h2>{(problem.tags || []).length}</h2>
              {(problem.tags || []).length ? <p>{problem.tags.join(", ")}</p> : null}
            </article>
            <article className="problem-card">
              <span className="problem-stat">Complexity</span>
              <h2>{complexity || "Unavailable"}</h2>
              <p>Time and space notes update directly from coding-journal.</p>
            </article>
          </div>

          <section className="section-panel">
            <span className="section-eyebrow">Solution</span>
            <h2>{problem.title}</h2>
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
          </section>

          {solutionCode ? (
            <section className="section-panel">
              <span className="section-eyebrow">Implementation</span>
              <h2>Solution Code</h2>
              <div className="problem-actions-row">
                <button
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
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
