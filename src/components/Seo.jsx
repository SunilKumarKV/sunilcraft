import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getJournalProblems, toPlatformSegment } from "../lib/codingJournal";

const SITE_NAME = "SunilCraft";
const SITE_URL = "https://sunilcraft.vercel.app";
const DEFAULT_IMAGE = `${SITE_URL}/assets/images/profile.png`;
const BASE_TITLE = "SunilCraft | Sunil Kumar K V Portfolio";
const BASE_DESCRIPTION =
  "Sunil Kumar K V portfolio featuring projects, coding problems, codebase solutions, developer analytics, and full-stack engineering work.";

function routeMetadata(pathname) {
  const staticPages = {
    "/": {
      title: BASE_TITLE,
      description: BASE_DESCRIPTION,
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Sunil Kumar K V",
        url: SITE_URL,
        jobTitle: "Full Stack Web Developer",
        sameAs: [
          "https://github.com/SunilKumarKV",
          "https://www.linkedin.com/in/sunilkumarkv44/",
        ],
      },
    },
    "/about": {
      title: "About Sunil Kumar K V | SunilCraft",
      description:
        "Learn about Sunil Kumar K V, a full-stack developer focused on React, UI engineering, coding systems, and production-ready web apps.",
      type: "profile",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Sunil Kumar K V",
        url: `${SITE_URL}/about`,
      },
    },
    "/projects": {
      title: "Projects | SunilCraft",
      description:
        "Explore live repositories, GitHub metadata, languages, topics, and project insights synced from coding-journal.",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "SunilCraft Projects",
        url: `${SITE_URL}/projects`,
      },
    },
    "/problems": {
      title: "Problems Explorer | SunilCraft",
      description:
        "Search verified coding problems across platforms with live filters for platform, difficulty, tags, and language.",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "SunilCraft Problems Explorer",
        url: `${SITE_URL}/problems`,
      },
    },
    "/codebase": {
      title: "Codebase | SunilCraft",
      description:
        "Browse solved code grouped by language, tags, platform, and verification status using live coding-journal entries.",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "SunilCraft Codebase",
        url: `${SITE_URL}/codebase`,
      },
    },
    "/dashboard": {
      title: "Developer Analytics Dashboard | SunilCraft",
      description:
        "Track live developer metrics, platform mix, tags, languages, project insights, and achievements from coding-journal data.",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: "SunilCraft Developer Analytics Dashboard",
        url: `${SITE_URL}/dashboard`,
      },
    },
    "/journey": {
      title: "Developer Journey Timeline | SunilCraft",
      description:
        "See the live developer journey timeline with project movement, milestones, and coding-journal activity grouped by month and year.",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "SunilCraft Developer Journey",
        url: `${SITE_URL}/journey`,
      },
    },
    "/achievements": {
      title: "Developer Achievements | SunilCraft",
      description:
        "View live developer achievements, progress bars, verification milestones, project goals, and GitHub star targets from coding-journal.",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "SunilCraft Developer Achievements",
        url: `${SITE_URL}/achievements`,
      },
    },
    "/contact": {
      title: "Contact | SunilCraft",
      description:
        "Get in touch with Sunil Kumar K V for React, UI engineering, full-stack products, and collaboration opportunities.",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Sunil Kumar K V",
        url: `${SITE_URL}/contact`,
      },
    },
    "/rewards": {
      title: "Certificates and Rewards | SunilCraft",
      description:
        "Browse certificates, recognition, and learning milestones earned by Sunil Kumar K V.",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "SunilCraft Certificates and Rewards",
        url: `${SITE_URL}/rewards`,
      },
    },
    "/skills": {
      title: "Skills | SunilCraft",
      description:
        "Review frontend, backend, full-stack, and product engineering skills showcased across SunilCraft projects and code systems.",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "SunilCraft Skills",
        url: `${SITE_URL}/skills`,
      },
    },
  };

  return (
    staticPages[pathname] || {
      title: BASE_TITLE,
      description: BASE_DESCRIPTION,
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: SITE_NAME,
        url: `${SITE_URL}${pathname}`,
      },
    }
  );
}

function ensureMeta(name, content, attr = "name") {
  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function ensureLink(rel, href) {
  let tag = document.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

function ensureJsonLd(data) {
  const scriptId = "sunilcraft-jsonld";
  let script = document.getElementById(scriptId);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = scriptId;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function problemMetadata(problem, mode, pathname) {
  const difficultyText = problem.difficulty ? ` • ${problem.difficulty}` : "";
  const platformText = problem.platform || "Coding Journal";
  const titleSuffix = mode === "codebase" ? "Codebase" : "Problems";
  const title = `${problem.title} | ${platformText}${difficultyText} | ${titleSuffix} | SunilCraft`;
  const description =
    mode === "codebase"
      ? `Review the ${platformText} ${problem.difficulty || ""} solution for ${problem.title}, including code, explanation, approach, and complexity data from coding-journal.`
      : `Explore the ${platformText} ${problem.difficulty || ""} problem ${problem.title} with verification, tags, language, and live coding-journal detail data.`;

  const jsonLd =
    mode === "codebase"
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: problem.title,
          programmingLanguage: problem.language || "Unknown",
          codeRepository: problem.detailUrl || `${SITE_URL}${pathname}`,
          url: `${SITE_URL}${pathname}`,
          description,
        }
      : {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: problem.title,
          description,
          url: `${SITE_URL}${pathname}`,
          about: [
            problem.platform,
            problem.difficulty,
            ...(problem.tags || []),
          ].filter(Boolean),
        };

  return {
    title,
    description,
    type: "article",
    jsonLd,
  };
}

export default function Seo() {
  const location = useLocation();
  const [detailMetadata, setDetailMetadata] = useState(null);

  useEffect(() => {
    let ignore = false;
    const path = location.pathname;

    async function loadDetailMetadata() {
      const problemMatch = path.match(/^\/problems\/([^/]+)\/([^/]+)$/);
      const codebaseMatch = path.match(/^\/codebase\/([^/]+)\/([^/]+)$/);

      if (!problemMatch && !codebaseMatch) {
        if (!ignore) setDetailMetadata(null);
        return;
      }

      const mode = problemMatch ? "problems" : "codebase";
      const [, platformSegment, slug] = problemMatch || codebaseMatch;

      try {
        const problems = await getJournalProblems();
        if (ignore) return;

        const matched = (Array.isArray(problems) ? problems : []).find(
          (item) =>
            item.slug === slug && toPlatformSegment(item.platform) === platformSegment
        );

        if (!matched) {
          setDetailMetadata(null);
          return;
        }

        setDetailMetadata(problemMetadata(matched, mode === "codebase" ? "codebase" : "problems", path));
      } catch {
        if (!ignore) {
          setDetailMetadata(null);
        }
      }
    }

    loadDetailMetadata();

    return () => {
      ignore = true;
    };
  }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname;
    const isProblemDetail = /^\/problems\/[^/]+\/[^/]+$/.test(path);
    const isCodebaseDetail = /^\/codebase\/[^/]+\/[^/]+$/.test(path);
    const metadata =
      (isProblemDetail || isCodebaseDetail) && detailMetadata
        ? detailMetadata
        : routeMetadata(path);

    const canonicalUrl = `${SITE_URL}${path}`;

    document.title = metadata.title;
    ensureMeta("description", metadata.description);
    ensureMeta("og:title", metadata.title, "property");
    ensureMeta("og:description", metadata.description, "property");
    ensureMeta("og:type", metadata.type || "website", "property");
    ensureMeta("og:url", canonicalUrl, "property");
    ensureMeta("og:site_name", SITE_NAME, "property");
    ensureMeta("og:image", DEFAULT_IMAGE, "property");
    ensureMeta("twitter:card", "summary_large_image");
    ensureMeta("twitter:title", metadata.title);
    ensureMeta("twitter:description", metadata.description);
    ensureMeta("twitter:image", DEFAULT_IMAGE);
    ensureLink("canonical", canonicalUrl);
    ensureJsonLd(metadata.jsonLd);
  }, [detailMetadata, location.pathname]);

  return null;
}
