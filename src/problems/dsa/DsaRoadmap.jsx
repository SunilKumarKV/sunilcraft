import React from "react";
import { Link } from "react-router-dom";

const roadmapTopics = [
  {
    title: "Arrays",
    difficulty: "Beginner",
    problems: "12 Problems",
    description: "Start with traversal, prefix sums, two pointers, and sliding window basics.",
    status: "In Progress",
  },
  {
    title: "Strings",
    difficulty: "Beginner",
    problems: "10 Problems",
    description: "Build confidence with frequency maps, pattern matching, and substring practice.",
    status: "Planned",
  },
  {
    title: "Linked List",
    difficulty: "Intermediate",
    problems: "8 Problems",
    description: "Practice node traversal, reversal, fast-slow pointers, and cycle detection.",
    status: "Planned",
  },
  {
    title: "Stack",
    difficulty: "Intermediate",
    problems: "7 Problems",
    description: "Learn LIFO problem solving with balanced brackets, monotonic stacks, and undo-style flows.",
    status: "Planned",
  },
  {
    title: "Queue",
    difficulty: "Intermediate",
    problems: "6 Problems",
    description: "Cover FIFO thinking with BFS foundations, deque patterns, and scheduling problems.",
    status: "Planned",
  },
  {
    title: "Trees",
    difficulty: "Intermediate",
    problems: "11 Problems",
    description: "Work through DFS, BFS, recursion, binary tree properties, and traversal patterns.",
    status: "Planned",
  },
  {
    title: "Graphs",
    difficulty: "Advanced",
    problems: "9 Problems",
    description: "Explore adjacency lists, traversal, connected components, and shortest path ideas.",
    status: "Planned",
  },
  {
    title: "Dynamic Programming",
    difficulty: "Advanced",
    problems: "10 Problems",
    description: "Finish with memoization, tabulation, state transitions, and optimization strategies.",
    status: "Completed",
  },
];

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
        {roadmapTopics.map((topic, index) => (
          <article className="problem-card" key={topic.title}>
            <span className="problem-stat">Step {index + 1}</span>
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
            <strong>{topic.difficulty}</strong>
            <p>{topic.problems}</p>
            <p>Status: {topic.status}</p>
          </article>
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
            <Link to="/problems/javascript" className="page-button">
              Start with Arrays
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
