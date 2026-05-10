import React from "react";
import { Link } from "react-router-dom";
import { problemCategories } from "./data/problemSets";

export default function ProblemsHome() {
  return (
    <main className="page-shell problems-home">
      <div className="page-header">
        <span className="section-eyebrow">Practice Zone</span>
        <h1>Coding Problems</h1>
        <p>
          A portfolio-friendly learning section with JavaScript, Java, and ReactJS tasks,
          solutions, explanations, search, and clean responsive UI.
        </p>
      </div>

      <div className="problem-grid">
        {problemCategories.map((item) => (
          <Link to={item.to} className="problem-card" key={item.title}>
            <span className="problem-stat">{item.stats}</span>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <strong>Start Learning →</strong>
          </Link>
        ))}
      </div>
    
      <section className="section-panel">
        <span className="section-eyebrow">Interview + MCA Lab</span>
        <h2>Extra Practice Areas</h2>
        <div className="feature-grid">
          <article className="glass-card"><h3>Interview Questions</h3><p>Arrays, strings, DOM, React hooks, Java OOP, API handling, and project explanation questions.</p></article>
          <article className="glass-card"><h3>MCA Lab Programs</h3><p>Java OOP, data structures using C, linked lists, stacks, queues, trees, and sorting/searching programs.</p></article>
          <article className="glass-card"><h3>Revision Tracker</h3><p>Use the complete button inside each problem page to track finished practice problems.</p></article>
        </div>
      </section>
    </main>
  );
}
