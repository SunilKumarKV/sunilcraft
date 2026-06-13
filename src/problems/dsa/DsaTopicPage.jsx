import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dsaTopics, getDsaTopicBySlug } from "./dsaTopics";

const difficultyOptions = ["All", "Easy", "Medium", "Hard"];

export default function DsaTopicPage() {
  const { topicSlug } = useParams();
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  const topic = getDsaTopicBySlug(topicSlug);

  const filteredProblems = useMemo(() => {
    if (!topic) return [];

    const normalizedQuery = query.trim().toLowerCase();

    return topic.problems.filter((problem) => {
      const matchesSearch = [
        problem.title,
        problem.difficulty,
        problem.platform,
        problem.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesDifficulty =
        difficulty === "All" || problem.difficulty === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [difficulty, query, topic]);

  if (!topic) {
    return (
      <main className="page-shell">
        <div className="page-header">
          <span className="section-eyebrow">DSA Topic</span>
          <h1>Topic Not Found</h1>
          <p>The requested roadmap topic does not exist. Return to the DSA roadmap and choose a valid topic.</p>
        </div>
        <div className="problem-grid two-col">
          <Link className="problem-card" to="/problems/dsa">
            <span className="problem-stat">Back</span>
            <h2>DSA Roadmap</h2>
            <p>Go back to the topic overview and continue from the roadmap order.</p>
            <strong>Open Roadmap →</strong>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="page-header">
        <span className="section-eyebrow">DSA Topic {topic.roadmapOrder}</span>
        <h1>{topic.title}</h1>
        <p>{topic.description}</p>
      </div>

      <div className="problem-grid">
        <article className="problem-card">
          <span className="problem-stat">Difficulty</span>
          <h2>{topic.difficulty}</h2>
          <p>Recommended level for this step in the roadmap.</p>
        </article>
        <article className="problem-card">
          <span className="problem-stat">Problems</span>
          <h2>{topic.problems.length}</h2>
          <p>Curated practice problems for this topic page.</p>
        </article>
        <article className="problem-card">
          <span className="problem-stat">Roadmap Order</span>
          <h2>Step {topic.roadmapOrder}</h2>
          <p>Continue the learning path in the recommended sequence.</p>
        </article>
        <article className="problem-card">
          <span className="problem-stat">Status</span>
          <h2>{topic.status}</h2>
          <p>Track whether this topic is planned, active, or already completed.</p>
        </article>
      </div>

      <section className="section-panel">
        <span className="section-eyebrow">Core Patterns</span>
        <h2>What To Practice First</h2>
        <div className="feature-grid">
          {topic.patterns.map((pattern) => (
            <article className="glass-card" key={pattern}>
              <h3>{pattern}</h3>
              <p>
                Build fluency with the {pattern.toLowerCase()} pattern before moving to harder
                interview-style problems in this topic.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-panel">
        <span className="section-eyebrow">Practice Problems</span>
        <h2>{topic.title} Problems</h2>
        <p>
          Search by title, platform, or status and filter the list by difficulty to focus your
          practice session.
        </p>

        <div className="problem-toolbar">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, platform, or status..."
            aria-label={`Search ${topic.title} problems`}
          />
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            aria-label="Filter by difficulty"
          >
            {difficultyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Link className="page-button compact" to="/problems/dsa">
            ← Back
          </Link>
        </div>

        <div className="problem-grid">
          {filteredProblems.map((problem) => (
            <article className="problem-card" key={problem.title}>
              <span className="problem-stat">{problem.platform}</span>
              <h2>{problem.title}</h2>
              <p>Status: {problem.status}</p>
              <p>Difficulty: {problem.difficulty}</p>
              <a href={problem.url} target="_blank" rel="noreferrer">
                <strong>Open Problem →</strong>
              </a>
            </article>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="empty-state small">
            <h2>No problems found</h2>
            <p>Try a different search term or switch the difficulty filter to All.</p>
          </div>
        )}
      </section>

      <section className="section-panel">
        <span className="section-eyebrow">Next Steps</span>
        <h2>Continue The Roadmap</h2>
        <div className="feature-grid">
          {dsaTopics.map((item) => (
            <article className="glass-card" key={item.slug}>
              <h3>{item.roadmapOrder}. {item.title}</h3>
              <p>{item.difficulty} • {item.status}</p>
              <Link to={`/problems/dsa/${item.slug}`}>Open Topic →</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
