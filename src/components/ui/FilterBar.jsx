import React from "react";

export default function FilterBar({ children, className = "", title = "", description = "" }) {
  return (
    <div className={`filter-shell ${className}`.trim()}>
      {title || description ? (
        <div className="filter-shell-copy">
          {title ? <h3>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}
      <div className="problem-toolbar problem-toolbar-wrap filter-bar">{children}</div>
    </div>
  );
}
