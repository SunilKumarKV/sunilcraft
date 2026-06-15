import React from "react";

export default function StatCard({ label, value, description, accent, tone = "default" }) {
  return (
    <article className={`problem-card stat-card ${tone}`.trim()}>
      <span className="problem-stat">{label}</span>
      <h2>{value}</h2>
      {accent ? <strong>{accent}</strong> : null}
      {description ? <p>{description}</p> : null}
    </article>
  );
}
