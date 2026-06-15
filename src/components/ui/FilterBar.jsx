import React from "react";

export default function FilterBar({ children, className = "" }) {
  return <div className={`problem-toolbar problem-toolbar-wrap filter-bar ${className}`.trim()}>{children}</div>;
}
