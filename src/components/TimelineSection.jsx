import React from "react";
import { education, experiences } from "../data/profile";

export default function TimelineSection() {
  return (
    <section className="section-panel timeline-section" id="journey">
      <span className="section-eyebrow">Career Journey</span>
      <h2>SAP MM → Full Stack Developer</h2>
      <div className="timeline-list">
        {experiences.map((item) => (
          <article className="timeline-item" key={`${item.year}-${item.title}`}>
            <span>{item.year}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="education-grid">
        {education.map((item) => (
          <article className="glass-card" key={item.degree}>
            <h3>{item.degree}</h3>
            <p>{item.institute}</p>
            <small>{item.status}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
