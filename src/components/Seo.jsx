import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const baseTitle = "SunilCraft | Sunil Kumar K V Portfolio";
const description = "Sunil Kumar K V portfolio - Full Stack Web Developer, React Specialist, projects, coding problems, services, and contact.";

export default function Seo() {
  const location = useLocation();

  useEffect(() => {
    const pageMap = {
      "/": baseTitle,
      "/projects": "Projects | SunilCraft",
      "/problems": "Coding Problems | SunilCraft",
      "/about": "About Sunil Kumar K V | SunilCraft",
      "/contact": "Contact | SunilCraft",
    };
    document.title = pageMap[location.pathname] || baseTitle;

    const ensureMeta = (name, content, attr = "name") => {
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    ensureMeta("description", description);
    ensureMeta("og:title", document.title, "property");
    ensureMeta("og:description", description, "property");
    ensureMeta("og:type", "website", "property");
    ensureMeta("og:image", "/assets/images/profile.png", "property");
    ensureMeta("twitter:card", "summary_large_image");
  }, [location.pathname]);

  return null;
}
