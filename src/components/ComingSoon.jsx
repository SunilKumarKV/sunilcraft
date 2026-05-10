import React from "react";
import { Link } from "react-router-dom";

export default function ComingSoon({ title = "Coming Soon" }) {
  return (
    <main className="page-shell">
      <div className="empty-state">
        <span className="section-eyebrow">In Progress</span>
        <h1>{title}</h1>
        <p>
          This section is being prepared. The route works now, so users will not
          land on a blank page while the content is under development.
        </p>
        <Link to="/problems" className="page-button">
          Back to Problems
        </Link>
      </div>
    </main>
  );
}
