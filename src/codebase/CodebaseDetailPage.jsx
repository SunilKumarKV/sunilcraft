import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getCachedText,
  getJournalProblemFolderListing,
  getJournalProblemFolderWebUrl,
  getJournalProblems,
  toPlatformSegment,
} from "../lib/codingJournal";
import PageHeader from "../components/ui/PageHeader";
import SectionPanel from "../components/ui/SectionPanel";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";

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
      <PageHeader
        eyebrow="Codebase Detail"
        title={detail?.title || problem?.title || "Code Entry"}
        description="A source-backed solution entry with code, explanation, and complexity notes from coding-journal."
        align="left"
      />

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
        <SectionPanel eyebrow="Loading" title="Code Entry">
          <LoadingState title="Loading code entry" message="Fetching problem files, solution code, and explanation data from coding-journal." />
        </SectionPanel>
      ) : error ? (
        <SectionPanel eyebrow="Issue" title="Code Entry">
          <ErrorState title="Unable to load code entry" message={error} />
        </SectionPanel>
      ) : !detail ? (
        <SectionPanel eyebrow="Missing" title="Code Entry">
          <EmptyState title="Code entry not found" message="No coding-journal code entry matched this platform and slug." />
        </SectionPanel>
      ) : (
        <>
          <div className="problem-grid">
            <article className="problem-card">
              <div className="card-row">
                <Badge tone="accent">{detail.platform}</Badge>
                <Badge>{detail.difficulty || "Unknown"}</Badge>
              </div>
              <h2>{detail.title}</h2>
              <p>Original problem metadata synced from coding-journal.</p>
            </article>
            <article className="problem-card">
              <div className="card-row">
                <Badge>{detail.language || "Unknown"}</Badge>
                <Badge tone={detail.verified ? "success" : "default"}>
                  {detail.verified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <h2>Verification</h2>
              <p>{detail.verified ? "This solution is marked as verified." : "This solution is not marked as verified yet."}</p>
            </article>
            <article className="problem-card">
              <div className="card-row">
                {(detail.tags || []).slice(0, 4).map((tagName) => (
                  <Badge key={tagName}>{tagName}</Badge>
                ))}
              </div>
              <h2>Tags</h2>
              <p>{(detail.tags || []).length ? `${(detail.tags || []).length} tags attached to this entry.` : "No tags added yet."}</p>
            </article>
            <article className="problem-card">
              <div className="card-row">
                <Badge>Complexity</Badge>
              </div>
              <h2>{detail.timeComplexity || "Unavailable"}</h2>
              <p>{detail.spaceComplexity ? `Space: ${detail.spaceComplexity}` : "Space complexity unavailable."}</p>
            </article>
          </div>

          <SectionPanel eyebrow="Question" title={detail.title}>
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
          </SectionPanel>

          {detail.solutionCode ? (
            <SectionPanel eyebrow="Implementation" title="Solution Code">
              <div className="problem-actions-row">
                <button
                  className={`copy-button ${copyState ? "copied" : ""}`}
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
            </SectionPanel>
          ) : null}
        </>
      )}
    </main>
  );
}
