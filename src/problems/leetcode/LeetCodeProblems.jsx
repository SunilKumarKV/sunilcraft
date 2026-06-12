import React, { useEffect, useState } from "react";
import { recentSolved } from "./recentSolved";

const LEETCODE_USERNAME = "Sunil-Kumar-K-V";

export default function LeetCodeProblems() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`)
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);
  
  <section className="section-panel">
  <span className="section-eyebrow">Recent Practice</span>
  <h2>Recently Solved Problems</h2>

  <div className="feature-grid">
    {recentSolved.map((problem) => (
      <article className="glass-card" key={problem.title}>
        <h3>{problem.title}</h3>
        <p>{problem.platform} • {problem.difficulty}</p>
        <a href={problem.url} target="_blank" rel="noreferrer">
          View Problem →
        </a>
      </article>
    ))}
  </div>
</section>

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
    </main>
  );
}