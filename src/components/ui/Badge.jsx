import React from "react";

export default function Badge({ children, tone = "default", className = "" }) {
  return <span className={`ui-badge ${tone} ${className}`.trim()}>{children}</span>;
}
