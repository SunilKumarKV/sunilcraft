import React from "react";

export default function SectionPanel({ eyebrow, title, description, children, className = "", actions = null }) {
  return (
    <section className={`section-panel ${className}`.trim()}>
      {(eyebrow || title || description || actions) ? (
        <div className="section-panel-header">
          <div className="section-panel-copy">
            {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
            {title ? <h2>{title}</h2> : null}
            {description ? <p className="section-copy">{description}</p> : null}
          </div>
          {actions ? <div className="section-panel-actions">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
