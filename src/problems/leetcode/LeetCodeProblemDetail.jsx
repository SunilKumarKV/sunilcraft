import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./LeetCodeProblems.css";

const DETAILS_URL = (slug) =>
  `https://raw.githubusercontent.com/SunilKumarKV/leetcode-sync/main/data/problems/${slug}.json`;

function DetailBlock({ label, children, code = false }) {
  if (!children) return null;

  return (
    <article className="glass-card leetcode-detail-block">
      <span className="section-eyebrow">{label}</span>
      {code ? <pre><code>{children}</code></pre> : <p>{children}</p>}
    </article>
  );
}

export default function LeetCodeProblemDetail() {
  const { slug } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState(false);

  const loadDetail = useCallback(async (signal) => {
    if (!slug) return;

    setLoading(true);
    setError("");
    setMissing(false);

    try {
      const response = await fetch(DETAILS_URL(slug), { signal });

      if (response.status === 404) {
        setDetail(null);
        setMissing(true);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to load LeetCode solution details right now.");
      }

      const data = await response.json();
      setDetail(data ?? null);
      setMissing(!data);
    } catch (fetchError) {
      if (fetchError.name === "AbortError") return;
      setDetail(null);
      setError(fetchError.message || "Something went wrong while loading the solution details.");
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [slug]);

  useEffect(() => {
    const controller = new AbortController();
    loadDetail(controller.signal);
    return () => controller.abort();
  }, [loadDetail]);

  return (
    <main className="page-shell leetcode-page">
      <div className="page-header">
        <span className="section-eyebrow">LeetCode Solution</span>
        <h1>{detail?.title || "Problem Details"}</h1>
        <p>
          Review the synced prompt, approach, explanation, and complexity notes for this solved
          problem.
        </p>
      </div>

      <div className="problem-toolbar">
        <Link className="page-button compact" to="/problems/leetcode">
          ← Back to LeetCode Problems
        </Link>
        {detail?.questionUrl && (
          <a
            className="page-button compact"
            href={detail.questionUrl}
            target="_blank"
            rel="noreferrer"
          >
            View on LeetCode
          </a>
        )}
      </div>

      {loading ? (
        <section className="section-panel">
          <article className="leetcode-status-card" aria-live="polite">
            <strong>Loading problem details</strong>
            Pulling the latest synced solution data for this LeetCode problem.
          </article>
        </section>
      ) : error ? (
        <section className="section-panel">
          <article className="leetcode-status-card" aria-live="polite">
            <strong>Unable to load problem details</strong>
            {error}
            <div className="leetcode-error-actions">
              <button
                type="button"
                className="leetcode-button"
                onClick={() => {
                  const controller = new AbortController();
                  loadDetail(controller.signal);
                }}
              >
                Retry
              </button>
            </div>
          </article>
        </section>
      ) : missing || !detail ? (
        <section className="section-panel">
          <article className="leetcode-status-card" aria-live="polite">
            <strong>Solution details not added yet.</strong>
          </article>
        </section>
      ) : (
        <>
          <div className="problem-grid">
            <article className="problem-card">
              <span className="problem-stat">Title</span>
              <h2>{detail.title}</h2>
              <p>Synced directly from the LeetCode solution detail feed.</p>
            </article>
            <article className="problem-card">
              <span className="problem-stat">Difficulty</span>
              <h2>{detail.difficulty}</h2>
              <p>Practice level for this solved problem.</p>
            </article>
            <article className="problem-card">
              <span className="problem-stat">Language</span>
              <h2>{detail.solutionLanguage}</h2>
              <p>Solution implementation language used for this submission.</p>
            </article>
            <article className="problem-card">
              <span className="problem-stat">Question URL</span>
              <h2 className="leetcode-link-title">Open Source</h2>
              <a href={detail.questionUrl} target="_blank" rel="noreferrer">
                {detail.questionUrl}
              </a>
            </article>
          </div>

          <section className="section-panel leetcode-panel">
            <span className="section-eyebrow">Prompt</span>
            <h2>Question</h2>
            <div className="feature-grid">
              <DetailBlock label="Question">{detail.question}</DetailBlock>
            </div>
          </section>

          <section className="section-panel leetcode-panel">
            <span className="section-eyebrow">Solution Notes</span>
            <h2>Approach and Explanation</h2>
            <div className="feature-grid">
              <DetailBlock label="Approach">{detail.approach}</DetailBlock>
              <DetailBlock label="Explanation">{detail.explanation}</DetailBlock>
              <DetailBlock label="Time Complexity">{detail.timeComplexity}</DetailBlock>
              <DetailBlock label="Space Complexity">{detail.spaceComplexity}</DetailBlock>
            </div>
          </section>

          <section className="section-panel leetcode-panel">
            <span className="section-eyebrow">Implementation</span>
            <h2>Solution Code</h2>
            <DetailBlock label={detail.solutionLanguage || "Code"} code>
              {detail.solutionCode}
            </DetailBlock>
          </section>
        </>
      )}
    </main>
  );
}
