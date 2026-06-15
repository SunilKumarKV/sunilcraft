import React from "react";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import CertificateGallery from "./CertificateGallery";
import PageHeader from "./ui/PageHeader";
import SectionPanel from "./ui/SectionPanel";
import { profile } from "../data/profile";

export default function AboutPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="About"
        title="Background, skills, and the kind of work I’m looking for"
        description={`${profile.name} is an MCA student at Bangalore University building practical web apps, verified coding systems, and recruiter-trustworthy portfolio work.`}
        align="left"
      />

      <SectionPanel
        eyebrow="Profile"
        title="About"
        description="A concise view of my transition into software development, the kind of work I enjoy, and the strengths I’m actively building."
        className="embedded-section-panel"
      >
        <AboutSection />
      </SectionPanel>

      <SectionPanel
        eyebrow="Capability"
        title="Skills"
        description="Frontend, backend, and workflow skills that support product-style builds, coding-journal sync, and practical implementation work."
        className="embedded-section-panel"
      >
        <SkillsSection />
      </SectionPanel>

      <SectionPanel
        eyebrow="Recognition"
        title="Rewards & Certificates"
        description="Certificates and rewards that support the learning journey behind the portfolio."
        className="embedded-section-panel"
      >
        <CertificateGallery />
      </SectionPanel>
    </main>
  );
}
