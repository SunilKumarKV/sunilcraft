import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import jsLang from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import tsLang from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import javaLang from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import cLang from "react-syntax-highlighter/dist/esm/languages/hljs/c";
import pythonLang from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import jsonLang from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import { atomOneDark, github } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  formatDate,
  getJournalProblems,
  getProblemLanguages,
  getProblemSolvedAt,
  getProblemSourceUrl,
  normalizeProblemSolutions,
  toPlatformSegment,
} from "../lib/codingJournal";
import { ThemeContext } from "../context/theme";
import PageHeader from "../components/ui/PageHeader";
import SectionPanel from "../components/ui/SectionPanel";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";

SyntaxHighlighter.registerLanguage("javascript", jsLang);
SyntaxHighlighter.registerLanguage("js", jsLang);
SyntaxHighlighter.registerLanguage("typescript", tsLang);
SyntaxHighlighter.registerLanguage("ts", tsLang);
SyntaxHighlighter.registerLanguage("java", javaLang);
SyntaxHighlighter.registerLanguage("c", cLang);
SyntaxHighlighter.registerLanguage("python", pythonLang);
SyntaxHighlighter.registerLanguage("py", pythonLang);
SyntaxHighlighter.registerLanguage("json", jsonLang);

function copyText(text) {
  if (!text || !navigator?.clipboard) return Promise.resolve();
  return navigator.clipboard.writeText(text);
}

function normalizeLanguageName(language) {
  const value = String(language || "Plain Text").trim();
  return value || "Plain Text";
}

function highlightLanguage(language) {
  const normalized = String(language || "").trim().toLowerCase();

  if (normalized === "javascript" || normalized === "js") return "javascript";
  if (normalized === "typescript" || normalized === "ts") return "typescript";
  if (normalized === "java") return "java";
  if (normalized === "c") return "c";
  if (normalized === "python" || normalized === "py") return "python";
  if (normalized === "json") return "json";

  return "text";
}

function MarkdownArticle({ markdown, theme }) {
  return (
    <article className="markdown-article">
      <ReactMarkdown
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const content = String(children).replace(/\n$/, "");

            if (inline) {
              return (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <SyntaxHighlighter
                language={match?.[1] || "text"}
                style={theme === "dark" ? atomOneDark : github}
                customStyle={{
                  margin: "16px 0",
                  borderRadius: "16px",
                  padding: "18px",
                }}
                wrapLongLines
                PreTag="div"
              >
                {content}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}

export default function CodebaseDetailPage() {
  const { platform, slug } = useParams();
  const { theme } = useContext(ThemeContext);

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

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
        setError(fetchError.message || "Unable to load codebase detail from coding-journal.");
        setProblems([]);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const problem = useMemo(() => {
    return (
      problems.find(
        (item) =>
          item.slug === slug &&
          toPlatformSegment(item.platform) === platform
      ) || null
    );
  }, [platform, problems, slug]);

  const solutions = useMemo(() => normalizeProblemSolutions(problem), [problem]);

  const solutionLanguages = useMemo(() => {
    const languages = getProblemLanguages(problem);

    if (languages.length) return languages;

    return solutions
      .map((solution) => normalizeLanguageName(solution.language))
      .filter(Boolean);
  }, [problem, solutions]);

  useEffect(() => {
    if (!solutionLanguages.length) return;

    if (!selectedLanguage || !solutionLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(solutionLanguages[0]);
    }
  }, [selectedLanguage, solutionLanguages]);

  const activeSolution = useMemo(() => {
    if (!solutions.length) return null;

    if (!selectedLanguage) return solutions[0];

    return (
      solutions.find(
        (solution) =>
          normalizeLanguageName(solution.language) === selectedLanguage
      ) || solutions[0]
    );
  }, [selectedLanguage, solutions]);

  const sourceUrl = activeSolution?.path
    ? getProblemSourceUrl(activeSolution.path)
    : "";

  if (loading) {
    return (
      <main className="page-shell">
        <PageHeader
          eyebrow="Loading"
          title="Loading codebase detail"
          description="Fetching solution article data from coding-journal."
          align="left"
        />
        <LoadingState
          title="Loading solution"
          message="Preparing explanation, code, and verification data."
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell">
        <PageHeader
          eyebrow="Issue"
          title="Codebase detail unavailable"
          description="There was a problem loading this coding-journal entry."
          align="left"
        />
        <ErrorState title="Unable to load codebase detail" message={error} />
        <Link className="page-button compact" to="/codebase">
          ← Back to Codebase
        </Link>
      </main>
    );
  }

  if (!problem) {
    return (
      <main className="page-shell">
        <PageHeader
          eyebrow="Missing"
          title="Code entry not found"
          description="No coding-journal code entry matched this platform and slug."
          align="left"
        />
        <EmptyState
          title="No codebase entry found"
          message="Check whether this problem exists in coding-journal and has been synced."
        />
        <Link className="page-button compact" to="/codebase">
          ← Back to Codebase
        </Link>
      </main>
    );
  }

  return (
    <main className="page-shell codebase-detail-page">
      <div className="problem-toolbar problem-toolbar-wrap">
        <Link className="page-button compact" to="/codebase">
          ← Back to Codebase
        </Link>

        <Link
          className="page-button compact"
          to={`/problems/${toPlatformSegment(problem.platform)}/${problem.slug}`}
        >
          View Problem Tracker Entry
        </Link>

        {problem.url ? (
          <a
            className="page-button compact"
            href={problem.url}
            target="_blank"
            rel="noreferrer"
          >
            View Original Problem
          </a>
        ) : null}

        {sourceUrl ? (
          <a
            className="page-button compact"
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            View GitHub Source
          </a>
        ) : null}
      </div>

      <PageHeader
        eyebrow="Verified Solution Article"
        title={problem.title}
        description="Explanation, solution languages, verification status, and complexity notes from live coding-journal data."
        align="left"
      />

      <SectionPanel
        eyebrow="Metadata"
        title={problem.title}
        description="A documentation-style solution entry with code, explanation, verification, and complexity data."
      >
        <div className="problem-grid">
          <article className="problem-card">
            <div className="card-row">
              <Badge tone="accent">{problem.platform}</Badge>
              <Badge>{problem.difficulty || "Unknown"}</Badge>
              {problem.verified ? <Badge tone="success">Verified</Badge> : <Badge>Not Verified</Badge>}
            </div>

            <h2>Problem Metadata</h2>

            <p>
              {problem.platform} • {problem.difficulty || "Difficulty not set"}
              {getProblemSolvedAt(problem)
                ? ` • ${formatDate(getProblemSolvedAt(problem))}`
                : ""}
            </p>
          </article>

          <article className="problem-card">
            <div className="card-row">
              <Badge>
                {solutions.length} {solutions.length === 1 ? "Solution" : "Solutions"}
              </Badge>
              <Badge>
                {solutionLanguages.length}{" "}
                {solutionLanguages.length === 1 ? "Language" : "Languages"}
              </Badge>
            </div>

            <h2>Available Languages</h2>

            <div className="card-row">
              {solutionLanguages.length ? (
                solutionLanguages.map((languageName) => (
                  <Badge key={languageName}>{languageName}</Badge>
                ))
              ) : (
                <Badge>No language added</Badge>
              )}
            </div>
          </article>

          <article className="problem-card">
            <div className="card-row">
              {problem.timeComplexity ? (
                <Badge tone="success">Time: {problem.timeComplexity}</Badge>
              ) : null}
              {problem.spaceComplexity ? (
                <Badge tone="success">Space: {problem.spaceComplexity}</Badge>
              ) : null}
            </div>

            <h2>Complexity</h2>

            <p>
              {problem.timeComplexity || problem.spaceComplexity
                ? "Complexity notes are included in this coding-journal entry."
                : "Complexity notes are not available yet."}
            </p>
          </article>

          <article className="problem-card">
            <div className="card-row">
              {(problem.tags || []).length ? (
                problem.tags.slice(0, 5).map((tagName) => (
                  <Badge key={tagName}>{tagName}</Badge>
                ))
              ) : (
                <Badge>No tags</Badge>
              )}
            </div>

            <h2>Tags</h2>

            <p>
              {(problem.tags || []).length
                ? `${problem.tags.length} tags attached to this solution article.`
                : "No tags attached yet."}
            </p>
          </article>
        </div>
      </SectionPanel>

      <SectionPanel
        eyebrow="Explanation"
        title="Solution Article"
        description="Markdown content is rendered directly from coding-journal so the explanation reads like documentation instead of raw notes."
      >
        {problem.explanation ? (
          <div className="problem-detail-card">
            <MarkdownArticle markdown={problem.explanation} theme={theme} />
          </div>
        ) : (
          <EmptyState
            title="No explanation available"
            message="This codebase entry does not include markdown explanation content yet."
          />
        )}
      </SectionPanel>

      <SectionPanel
        eyebrow="Implementation"
        title="Code Viewer"
        description="Switch between available languages when more than one solution is published."
      >
        {solutions.length > 1 ? (
          <div className="solution-tabs" role="tablist" aria-label="Solution languages">
            {solutionLanguages.map((languageName) => (
              <button
                key={languageName}
                type="button"
                role="tab"
                aria-selected={selectedLanguage === languageName}
                className={`solution-tab ${
                  selectedLanguage === languageName ? "active" : ""
                }`.trim()}
                onClick={() => setSelectedLanguage(languageName)}
              >
                {languageName}
              </button>
            ))}
          </div>
        ) : null}

        {activeSolution ? (
          <>
            <div className="problem-actions-row">
              <button
                className={`copy-button ${copyState ? "copied" : ""}`}
                type="button"
                onClick={() => {
                  copyText(activeSolution.code).then(() => {
                    setCopyState("Code copied");
                    window.setTimeout(() => setCopyState(""), 1800);
                  });
                }}
              >
                Copy Code
              </button>

              {copyState ? (
                <span className="problem-copy-state">{copyState}</span>
              ) : null}

              {sourceUrl ? (
                <a
                  className="page-button compact"
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub Source
                </a>
              ) : null}
            </div>

            <article className="problem-detail-card">
              <div className="card-row">
                <Badge tone="accent">
                  {normalizeLanguageName(activeSolution.language)}
                </Badge>
                {activeSolution.filename ? (
                  <Badge>{activeSolution.filename}</Badge>
                ) : null}
              </div>

              <SyntaxHighlighter
                language={highlightLanguage(activeSolution.language)}
                style={theme === "dark" ? atomOneDark : github}
                customStyle={{
                  margin: 0,
                  borderRadius: "16px",
                  padding: "18px",
                }}
                wrapLongLines
              >
                {activeSolution.code || "// No code added yet"}
              </SyntaxHighlighter>
            </article>
          </>
        ) : (
          <EmptyState
            title="No solution code available"
            message="This codebase entry does not include a solution yet."
          />
        )}
      </SectionPanel>
    </main>
  );
}