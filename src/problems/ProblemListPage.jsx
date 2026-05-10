import React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function ProblemListPage({ eyebrow, title, description, problems = [], backTo = "/problems" }) {
  const [query, setQuery] = useState("");

  const filteredProblems = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return problems;
    return problems.filter((problem) =>
      [problem.title, problem.task, problem.level, problem.solution, String(problem.day || "")]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [problems, query]);

  return (
    <main className="page-shell problem-page">
      <div className="page-header">
        <span className="section-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="problem-toolbar">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search problem, topic, level..."
          aria-label="Search problems"
        />
        <Link className="page-button compact" to={backTo}>← Back</Link>
      </div>

      <div className="problem-list">
        {filteredProblems.map((problem, index) => (
          <article className="problem-detail-card" key={`${problem.title}-${index}`}>
            <div className="problem-detail-header">
              <span className="problem-stat">{problem.day ? `Day ${problem.day}` : problem.level || "Practice"}</span>
              {problem.level && <span className="problem-level">{problem.level}</span>}
            </div>
            <h2>{problem.title}</h2>
            <p>{problem.task}</p>
            <pre><code>{problem.solution}</code></pre>
          </article>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="empty-state small">
          <h2>No problems found</h2>
          <p>Try searching JavaScript, React, Java, array, form, API, or beginner.</p>
        </div>
      )}
    </main>
  );
}
