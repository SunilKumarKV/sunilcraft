import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  formatDate,
  getJournalProjects,
  toProjectSlug,
} from "../lib/codingJournal";
import PageHeader from "./ui/PageHeader";
import SectionPanel from "./ui/SectionPanel";
import LoadingState from "./ui/LoadingState";
import ErrorState from "./ui/ErrorState";
import EmptyState from "./ui/EmptyState";
import Badge from "./ui/Badge";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    getJournalProjects()
      .then((data) => {
        if (ignore) return;
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((fetchError) => {
        if (ignore) return;
        setError(fetchError.message || "Unable to load project detail from coding-journal.");
        setProjects([]);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const project = useMemo(
    () => projects.find((item) => toProjectSlug(item.name) === slug) || null,
    [projects, slug]
  );

  if (loading) {
    return (
      <main className="page-shell">
        <PageHeader eyebrow="Work Detail" title="Project Detail" description="Loading live project data from coding-journal." align="left" />
        <SectionPanel eyebrow="Loading" title="Project Detail">
          <LoadingState title="Loading project detail" message="Fetching repository detail from coding-journal." />
        </SectionPanel>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell">
        <PageHeader eyebrow="Work Detail" title="Project Detail" description="The repository detail could not be loaded." align="left" />
        <SectionPanel eyebrow="Issue" title="Project Detail">
          <ErrorState title="Unable to load project" message={error} />
        </SectionPanel>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="page-shell">
        <PageHeader eyebrow="Work Detail" title="Project Detail" description="The requested project could not be found in the synced GitHub feed." align="left" />
        <SectionPanel eyebrow="Missing" title="Project Detail">
          <EmptyState title="Project not found" message="No synced repository matched this project slug." />
        </SectionPanel>
      </main>
    );
  }

  return (
    <main className="project-detail-page">
      <PageHeader
        eyebrow="Work Detail"
        title={project.name}
        description="A live project view pulled from the synced GitHub repository feed."
        align="left"
      />

      <Link to="/projects" className="problem-back">← Back to Projects</Link>

      <section className="project-detail-hero">
        <div>
          <div className="card-row">
            <Badge tone="accent">{project.language || "Unknown"}</Badge>
            {project.featured ? <Badge tone="success">Featured</Badge> : null}
            <Badge>⭐ {project.stars || 0} Stars</Badge>
            <Badge>{project.forks || 0} Forks</Badge>
          </div>

          <h1>{project.name}</h1>

          <p>{project.description || "No repository description provided."}</p>

          <p className="project-category">
            Updated: {formatDate(project.updatedAt) || "Unknown"}
          </p>

          {(project.topics || []).length ? (
            <div className="card-row">
              {project.topics.slice(0, 6).map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          ) : null}

          <div className="project-actions">
            {project.url ? (
              <>
                <a
                  href={project.url}
                  className="project-link primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>

                <a
                  href={`${project.url}/stargazers`}
                  className="project-link"
                  target="_blank"
                  rel="noreferrer"
                  title="Star this repository on GitHub"
                >
                  ⭐ Star on GitHub
                </a>

                <a
                  href={`${project.url}/fork`}
                  className="project-link"
                  target="_blank"
                  rel="noreferrer"
                  title="Fork this repository on GitHub"
                >
                  🍴 Fork Repository
                </a>

                <a
                  href={`${project.url}/watchers`}
                  className="project-link"
                  target="_blank"
                  rel="noreferrer"
                  title="Watch this repository on GitHub"
                >
                  👀 Watch Repository
                </a>
              </>
            ) : null}

            {project.homepage ? (
              <a
                href={project.homepage}
                className="project-link"
                target="_blank"
                rel="noreferrer"
              >
                Live Project
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-panel">
        <div className="section-gloss-divider" aria-hidden="true" />
        <div className="section-heading">
          <span className="section-eyebrow">Repository Proof</span>
          <h2>Live repo proof</h2>
          <p className="section-copy">
            These signals come directly from the synced repository feed and make the project easier to evaluate quickly.
          </p>
        </div>

        <div className="project-proof-strip">
          <article className="meta-strip-card">
            <span>Stars</span>
            <strong>{project.stars || 0}</strong>
          </article>
          <article className="meta-strip-card">
            <span>Forks</span>
            <strong>{project.forks || 0}</strong>
          </article>
          <article className="meta-strip-card">
            <span>Language</span>
            <strong>{project.language || "Unknown"}</strong>
          </article>
          <article className="meta-strip-card">
            <span>Last Updated</span>
            <strong>{formatDate(project.updatedAt) || "Unknown"}</strong>
          </article>
          <article className="meta-strip-card">
            <span>Topics</span>
            <strong>{(project.topics || []).length}</strong>
          </article>
        </div>

        {(project.topics || []).length ? (
          <div className="tag-cloud" style={{ marginTop: "18px" }}>
            {project.topics.map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
        ) : (
          <p className="section-copy" style={{ marginTop: "18px" }}>
            No repository topics are currently exposed for this project.
          </p>
        )}
      </section>

      <section className="section-panel">
        <h2>Topics</h2>

        <div className="feature-grid">
          {(project.topics || []).length ? (
            project.topics.map((item) => (
              <article className="glass-card" key={item}>
                <h3>{item}</h3>
                <p>Live repository topic synced from coding-journal.</p>
              </article>
            ))
          ) : (
            <article className="glass-card">
              <h3>No topics added</h3>
              <p>This repository does not currently expose GitHub topics in coding-journal.</p>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
