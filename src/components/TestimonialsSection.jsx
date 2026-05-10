import React from "react";
import { testimonials } from "../data/profile";

export default function TestimonialsSection() {
  return (
    <section className="section-panel testimonials-section" id="testimonials">
      <span className="section-eyebrow">Proof of Work</span>
      <h2>Testimonials & Project Feedback</h2>
      <div className="feature-grid">
        {testimonials.map((item) => (
          <article className="glass-card" key={item.name}>
            <p>“{item.quote}”</p>
            <h3>{item.name}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
