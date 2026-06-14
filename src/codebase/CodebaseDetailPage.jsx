import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getCachedText,
  getJournalProblemFolderListing,
  getJournalProblemFolderWebUrl,
  getJournalProblems,
  toPlatformSegment,
} from "../lib/codingJournal";

function extractSection(markdown, heading) {
  if (!markdown) return "";

  const pattern = new RegExp(`^##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=^##\\s+|$)`, "im");
  const match = markdown.match(pattern);
  return match ? match[1].trim() : "";
}

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .trim();
}

function extractCodeBlock(markdown) {
  const match = markdown.match(/```(?:\w+)?\n([\s\S]*?)```/);
  return match ? match[1].trim() : "";
}

function copyText(text) {
  if (!text) return Promise.resolve();
  return navigator.clipboard.writeText(text);
}

export default function CodebaseDetailPage() {
  const { platform, slug } = useParams();
  const [problems, setProblems] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadDetail() {
      setLoading(true);
      setError("");

      try {
        const problemsData = await getJournalProblems();
        if (ignore) return;

        const allProblems = Array.isArray(problemsData) ? problemsData : [];
        setProblems(allProblems);

        const problem = allProblems.find(
          (item) => item.slug === slug && toPlatformSegment(item.platform) === platform
        );

        if (!problem) {
          setDetail(null);
          setLoading(false);
          return;
        }

        const folderListing = await getJournalProblemFolderListing(problem.platform, problem.slug);
        const files = Array.isArray(folderListing) ? folderListing : [];
        const problemJsonFile = files.find((file) => file.name === "problem.json");
        const explanationFile = files.find((file) => file.name === "explanation.md");
        const solutionFile = files.find((file) => file.name.startsWith("solution."));

        const [problemJsonText, explanationText, solutionCode] = await Promise.all([
          problemJsonFile?.download_url ? getCachedText(problemJsonFile.download_url) : Promise.resolve(""),
          explanationFile?.download_url ? getCachedText(explanationFile.download_url) : Promise.resolve(""),
          solutionFile?.download_url ? getCachedText(solutionFile.download_url) : Promise.resolve(""),
        ]);

        if (ignore) return;

        const parsedJson = problemJsonText ? JSON.parse(problemJsonText) : {};
        const approachSection = extractSection(explanationText, "Approach") || extractSection(explanationText, "Hash Map Approach");
        const explanationSection = extractSection(explanationText, "Step-By-Step Example");
        const timeSection = stripMarkdown(extractSection(explanationText, "Time Complexity"));
        const spaceSection = stripMarkdown(extractSection(explanationText, "Space Complexity"));
        const questionText = parsedJson.question || stripMarkdown(extractSection(explanationText, "Question"));

        setDetail({
          ...problem,
          ...parsedJson,
          question: questionText,
          solutionCode: parsedJson.solutionCode || solutionCode || extractCodeBlock(explanationText),
          explanation: parsedJson.explanation || stripMarkdown(explanationSection),
          approach: parsedJson.approach || stripMarkdown(approachSection),
          timeComplexity: parsedJson.timeComplexity || timeSection || problem.timeComplexity,
          spaceComplexity: parsedJson.spaceComplexity || spaceSection || problem.spaceComplexity,
          githubSourceUrl: solutionFile?.html_url || getJournalProblemFolderWebUrl(problem.platform, problem.slug),
        });
      } catch (fetchError) {
        if (ignore) return;
        setError(fetchError.message || "Unable to load codebase detail from coding-journal.");
        setDetail(null);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      ignore = true;
    };
  }, [platform, slug]);

  const problem = useMemo(
    () =>
      problems.find(
        (item) => item.slug === slug && toPlatformSegment(item.platform) === platform
      ) || null,
    [platform, problems, slug]
  );

  return (
    <main className="page-shell">
      <div className="page-header">
        <span className="section-eyebrow">Codebase Detail</span>
        <h1>{detail?.title || problem?.title || "Code Entry"}</h1>
        <p>
          Review live question notes, implementation, explanation, and complexity data pulled from
          the coding-journal repository.
        </p>
      </div>

      <div className="problem-toolbar problem-toolbar-wrap">
        <Link className="page-button compact" to="/codebase">
          ← Back to Codebase
        </Link>
        {detail?.url ? (
          <a className="page-button compact" href={detail.url} target="_blank" rel="noreferrer">
            View Original Problem
          </a>
        ) : null}
        {detail?.githubSourceUrl ? (
          <a className="page-button compact" href={detail.githubSourceUrl} target="_blank" rel="noreferrer">
            View GitHub Source
          </a>
        ) : null}
      </div>

      {loading ? (
        <section className="section-panel">
          <article className="glass-card">
            <h3>Loading code entry</h3>
            <p>Fetching problem files, solution code, and explanation data from coding-journal.</p>
          </article>
        </section>
      ) : error ? (
        <section className="section-panel">
          <article className="glass-card">
            <h3>Unable to load code entry</h3>
            <p>{error}</p>
          </article>
        </section>
      ) : !detail ? (
        <section className="section-panel">
          <article className="glass-card">
            <h3>Code entry not found</h3>
            <p>No coding-journal code entry matched this platform and slug.</p>
          </article>
        </section>
      ) : (
        <>
          <div className="problem-grid">
            <article className="problem-card">
              <span className="problem-stat">Platform</span>
              <h2>{detail.platform}</h2>
              <p>Difficulty: {detail.difficulty || "Unknown"}</p>
            </article>
            <article className="problem-card">
              <span className="problem-stat">Verification</span>
              <h2>{detail.verified ? "Verified" : "Unverified"}</h2>
              <p>Language: {detail.language || "Unknown"}</p>
            </article>
            <article className="problem-card">
              <span className="problem-stat">Tags</span>
              <h2>{(detail.tags || []).length}</h2>
              {(detail.tags || []).length ? <p>{detail.tags.join(", ")}</p> : null}
            </article>
            <article className="problem-card">
              <span className="problem-stat">Complexity</span>
              <h2>{detail.timeComplexity || "Unavailable"}</h2>
              <p>{detail.spaceComplexity ? `Space: ${detail.spaceComplexity}` : "Space complexity unavailable."}</p>
            </article>
          </div>

          <section className="section-panel">
            <span className="section-eyebrow">Question</span>
            <h2>{detail.title}</h2>
            <div className="feature-grid">
              {detail.question ? (
                <article className="glass-card">
                  <h3>Question</h3>
                  <p>{detail.question}</p>
                </article>
              ) : null}
              {detail.approach ? (
                <article className="glass-card">
                  <h3>Approach</h3>
                  <p>{detail.approach}</p>
                </article>
              ) : null}
              {detail.explanation ? (
                <article className="glass-card">
                  <h3>Explanation</h3>
                  <p>{detail.explanation}</p>
                </article>
              ) : null}
              <article className="glass-card">
                <h3>Verification Status</h3>
                <p>{detail.verified ? "Verified solution" : "Unverified solution"}</p>
              </article>
            </div>
          </section>

          {detail.solutionCode ? (
            <section className="section-panel">
              <span className="section-eyebrow">Implementation</span>
              <h2>Solution Code</h2>
              <div className="problem-actions-row">
                <button
                  type="button"
                  onClick={() => {
                    copyText(detail.solutionCode).then(() => {
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
                  <code>{detail.solutionCode}</code>
                </pre>
              </article>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
