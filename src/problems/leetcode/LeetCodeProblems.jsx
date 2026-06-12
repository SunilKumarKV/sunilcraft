import React, { useEffect, useState } from "react";
import { recentSolved } from "./recentSolved";

const LEETCODE_USERNAME = "YOUR_LEETCODE_USERNAME";

export default function LeetCodeProblems() {
  const [stats, setStats] = useState(null);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`)
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const filteredProblems = recentSolved.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesDifficulty =
      difficulty === "All" || problem.difficulty === difficulty;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <main className="page-shell">
      <div className="page-header">
        <span className="section-eyebrow">Auto Synced</span>
        <h1>LeetCode Problems</h1>
        <p>
          My problem-solving progress, difficulty breakdown, and coding practice
          journey.
        </p>
      </div>

      <div className="problem-grid">
        <article className="problem-card">
          <span className="problem-stat">{stats?.totalSolved ?? "--"}</span>
          <h2>Total Solved</h2>
          <p>All accepted LeetCode problems.</p>
        </article>

        <article className="problem-card">
          <span className="problem-stat">{stats?.easySolved ?? "--"}</span>
          <h2>Easy</h2>
          <p>Beginner-friendly problem solving.</p>
        </article>

        <article className="problem-card">
          <span className="problem-stat">{stats?.mediumSolved ?? "--"}</span>
          <h2>Medium</h2>
          <p>DSA and interview-level practice.</p>
        </article>

        <article className="problem-card">
          <span className="problem-stat">{stats?.hardSolved ?? "--"}</span>
          <h2>Hard</h2>
          <p>Advanced problem-solving challenges.</p>
        </article>
      </div>

      <section className="section-panel">
        <span className="section-eyebrow">Recent Practice</span>
        <h2>Recently Solved Problems</h2>

        <div className="problem-grid">
          <input
            type="text"
            placeholder="Search problems..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "inherit",
            }}
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "inherit",
            }}
          >
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div className="feature-grid">
          {filteredProblems.map((problem) => (
            <article className="glass-card" key={problem.title}>
              <h3>{problem.title}</h3>
              <p>
                {problem.platform} • {problem.difficulty}
              </p>
              <a href={problem.url} target="_blank" rel="noreferrer">
                View Problem →
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}