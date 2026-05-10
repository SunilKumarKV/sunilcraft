import React from "react";
import { Link } from "react-router-dom";

export default function JavaScriptProblems() {
  return (
    <main className="page-shell">
      <div className="page-header">
        <span className="section-eyebrow">JavaScript Practice</span>
        <h1>JavaScript Problems</h1>
        <p>Choose a JavaScript learning track. Each section includes tasks, solutions, and clean UI for portfolio presentation.</p>
      </div>
      <div className="problem-grid two-col">
        <Link className="problem-card" to="/problems/javascript/30days">
          <span className="problem-stat">30 Days</span>
          <h2>JavaScript 30 Days</h2>
          <p>Daily JavaScript tasks from basics to mini project logic.</p>
          <strong>Open Track →</strong>
        </Link>
        <Link className="problem-card" to="/problems/javascript/10days">
          <span className="problem-stat">10 Days</span>
          <h2>JavaScript 10 Days Code</h2>
          <p>Interview-style coding challenges with short solutions.</p>
          <strong>Open Track →</strong>
        </Link>
      </div>
    </main>
  );
}
