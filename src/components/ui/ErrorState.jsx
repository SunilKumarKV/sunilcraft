import React from "react";

export default function ErrorState({ title = "Unable to load", message }) {
  return (
    <article className="glass-card state-card error-state-card">
      <h3>{title}</h3>
      {message ? <p>{message}</p> : null}
    </article>
  );
}
