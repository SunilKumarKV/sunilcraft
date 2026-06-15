import React from "react";

export default function EmptyState({ title = "Nothing here yet", message, compact = false }) {
  return (
    <article className={`glass-card state-card empty-state-card ${compact ? "compact" : ""}`.trim()}>
      <h3>{title}</h3>
      {message ? <p>{message}</p> : null}
    </article>
  );
}
