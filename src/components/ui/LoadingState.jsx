import React from "react";

export default function LoadingState({ title = "Loading", message }) {
  return (
    <article className="glass-card state-card">
      <h3>{title}</h3>
      {message ? <p>{message}</p> : null}
    </article>
  );
}
