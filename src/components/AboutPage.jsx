import React from "react";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import CertificateGallery from "./CertificateGallery";
import PageHeader from "./ui/PageHeader";
import SectionPanel from "./ui/SectionPanel";

export default function AboutPage() {
  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="About SunilCraft"
        title="Builder profile, skills, and rewards"
        description="A cleaner view of the person behind SunilCraft: engineering focus, practical skills, and milestone snapshots."
        align="left"
      />

      <SectionPanel
        eyebrow="Profile"
        title="About"
        description="Frontend polish, full-stack execution, and consistent learning in public."
        className="embedded-section-panel"
      >
        <AboutSection />
      </SectionPanel>

      <SectionPanel
        eyebrow="Capability"
        title="Skills"
        description="Core frontend, backend, and tooling strengths that support the portfolio and coding-journal workflow."
        className="embedded-section-panel"
      >
        <SkillsSection />
      </SectionPanel>

      <SectionPanel
        eyebrow="Recognition"
        title="Rewards & Certificates"
        description="A compact archive of professional recognition and performance highlights."
        className="embedded-section-panel"
      >
        <CertificateGallery />
      </SectionPanel>
    </main>
  );
}
