import React from "react";
import { Link } from "react-router-dom";
import { dsaTopics } from "./dsaTopics";

export default function DsaRoadmap() {
  return (
    <main className="page-shell">
      <div className="page-header">
        <span className="section-eyebrow">Problem Solving Path</span>
        <h1>DSA Roadmap</h1>
        <p>
          A beginner-friendly order to build data structures and algorithms confidence, starting
          with fundamentals and moving toward interview-focused problem solving.
        </p>
      </div>

      <div className="problem-grid">
        {dsaTopics.map((topic) => (
          <Link className="problem-card" key={topic.slug} to={`/problems/dsa/${topic.slug}`}>
            <span className="problem-stat">Step {topic.roadmapOrder}</span>
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
            <strong>{topic.difficulty}</strong>
            <p>{topic.problems.length} Problems</p>
            <p>Status: {topic.status}</p>
          </Link>
        ))}
      </div>

      <section className="section-panel">
        <span className="section-eyebrow">Roadmap Order</span>
        <h2>Learn In This Sequence</h2>
        <p>
          Arrays → Strings → Linked List → Stack → Queue → Trees → Graphs → Dynamic
          Programming
        </p>

        <div className="feature-grid">
          <article className="glass-card">
            <h3>Why This Order Works</h3>
            <p>
              Each topic builds on earlier patterns, so you can strengthen logic, recursion, and
              data modeling without jumping too quickly into advanced concepts.
            </p>
          </article>
          <article className="glass-card">
            <h3>Practice Strategy</h3>
            <p>
              Focus on understanding patterns first, solve a small set consistently, then revisit
              earlier topics before moving on to the next stage.
            </p>
          </article>
          <article className="glass-card">
            <h3>Start Point</h3>
            <p>
              Begin with arrays to learn indexing, traversal, brute-force optimization, and the
              most common interview building blocks.
            </p>
            <Link to="/problems/dsa/arrays" className="page-button">
              Start with Arrays
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
