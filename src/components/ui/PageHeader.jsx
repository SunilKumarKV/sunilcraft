import React from "react";

export default function PageHeader({ eyebrow, title, description, align = "center", actions = null }) {
  return (
    <div className={`page-header page-header-${align}`}>
      {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </div>
  );
}
