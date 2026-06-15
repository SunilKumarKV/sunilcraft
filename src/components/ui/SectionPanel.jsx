import React from "react";

export default function SectionPanel({ eyebrow, title, description, children, className = "" }) {
  return (
    <section className={`section-panel ${className}`.trim()}>
      <div className="section-gloss-divider" aria-hidden="true" />
      {(eyebrow || title || description) ? (
        <div className="section-heading">
          {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
          {title ? <h2>{title}</h2> : null}
          {description ? <p className="section-copy">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
