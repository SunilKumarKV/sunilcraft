import React from "react";
import { services } from "../data/profile";

export default function ServicesSection() {
  return (
    <section className="section-panel services-section" id="services">
      <span className="section-eyebrow">What I Can Build</span>
      <h2>Services</h2>
      <div className="feature-grid">
        {services.map((service) => (
          <article className="glass-card" key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
