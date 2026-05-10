import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="page-shell">
      <div className="empty-state">
        <span className="section-eyebrow">404</span>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="page-button">
          Go Home
        </Link>
      </div>
    </main>
  );
}
