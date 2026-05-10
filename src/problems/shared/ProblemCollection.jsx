import React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./ProblemCollection.css";

const levels = ["All", "Beginner", "Intermediate", "Advanced", "Easy", "Medium", "Hard"];
const languages = ["All", "JavaScript", "Java", "React"];

export default function ProblemCollection({ eyebrow, title, description, problems, backTo = "/problems", language = "All" }) {
  const normalizedProblems = problems.map((problem, index) => ({
    id: problem.id ?? problem.day ?? `${problem.title}-${index}`,
    title: problem.title,
    level: problem.level ?? "Easy",
    question: problem.question ?? problem.task,
    solution: problem.solution,
    explanation: problem.explanation ?? "Understand the input, apply the logic step-by-step, test with edge cases, and then improve readability.",
    language: problem.language ?? language,
  }));

  const [selectedId, setSelectedId] = useState(normalizedProblems[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [showSolution, setShowSolution] = useState(true);
  const [completed, setCompleted] = useState(() => new Set());

  const filteredProblems = useMemo(() => normalizedProblems.filter((problem) => {
    const matchesQuery = `${problem.title} ${problem.level} ${problem.question}`.toLowerCase().includes(query.toLowerCase());
    const matchesLevel = level === "All" || problem.level === level;
    const matchesLanguage = languageFilter === "All" || problem.language === languageFilter;
    return matchesQuery && matchesLevel && matchesLanguage;
  }), [normalizedProblems, query, level, languageFilter]);

  const selected = useMemo(
    () => filteredProblems.find((problem) => problem.id === selectedId) ?? filteredProblems[0],
    [filteredProblems, selectedId]
  );

  const copyCode = async () => {
    if (!selected?.solution) return;
    await navigator.clipboard.writeText(selected.solution);
  };

  const toggleComplete = () => {
    if (!selected) return;
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(selected.id)) next.delete(selected.id);
      else next.add(selected.id);
      return next;
    });
  };

  return (
    <main className="problem-workspace">
      <section className="problem-hero">
        <div>
          <span className="section-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <Link to={backTo} className="problem-back">← Back</Link>
      </section>

      <section className="problem-stats-grid" aria-label="Problem statistics">
        <article><strong>{normalizedProblems.length}</strong><span>Total Tasks</span></article>
        <article><strong>{completed.size}</strong><span>Completed</span></article>
        <article><strong>{filteredProblems.length}</strong><span>Visible</span></article>
      </section>

      <div className="problem-toolbar">
        <input type="search" placeholder="Search problems..." value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search problems" />
        <select value={level} onChange={(event) => setLevel(event.target.value)} aria-label="Filter by difficulty">
          {levels.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)} aria-label="Filter by language">
          {languages.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <section className="problem-layout">
        <aside className="problem-sidebar" aria-label={`${title} task list`}>
          {filteredProblems.map((problem) => (
            <button type="button" key={problem.id} className={`problem-list-item ${selected?.id === problem.id ? "active" : ""}`} onClick={() => setSelectedId(problem.id)}>
              <span>{problem.title}</span>
              <small>{problem.level} • {problem.language}</small>
            </button>
          ))}
        </aside>

        {selected ? (
          <article className="problem-detail">
            <div className="problem-detail-header">
              <span>{selected.level}</span>
              <h2>{selected.title}</h2>
            </div>
            <div className="problem-actions-row">
              <button type="button" onClick={toggleComplete}>{completed.has(selected.id) ? "Mark Pending" : "Mark Complete"}</button>
              <button type="button" onClick={() => setShowSolution((value) => !value)}>{showSolution ? "Hide Solution" : "Show Solution"}</button>
              <button type="button" onClick={copyCode}>Copy Code</button>
            </div>
            <h3>Task</h3>
            <p>{selected.question}</p>
            {showSolution && (
              <>
                <h3>Solution</h3>
                <pre><code>{selected.solution}</code></pre>
              </>
            )}
            <h3>Explanation</h3>
            <p>{selected.explanation}</p>
            <h3>Interview Tip</h3>
            <p>Explain the approach first, then code, then mention time complexity and edge cases.</p>
          </article>
        ) : (
          <article className="problem-detail empty">No problem found.</article>
        )}
      </section>
    </main>
  );
}
