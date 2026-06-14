import React, { useMemo } from "react";
import {
  formatDate,
  getJournalProjects,
  getJournalStats,
  sumNumber,
  uniqueValues,
} from "../lib/codingJournal";

function useDeveloperMetricsData() {
  const [state, setState] = React.useState({
    stats: null,
    projects: [],
    loading: true,
    error: "",
  });

  React.useEffect(() => {
    let ignore = false;

    Promise.all([getJournalStats(), getJournalProjects()])
      .then(([statsData, projectsData]) => {
        if (ignore) return;
        setState({
          stats: statsData ?? null,
          projects: Array.isArray(projectsData) ? projectsData : [],
          loading: false,
          error: "",
        });
      })
      .catch((error) => {
        if (ignore) return;
        setState({
          stats: null,
          projects: [],
          loading: false,
          error: error.message || "Unable to load developer metrics.",
        });
      });

    return () => {
      ignore = true;
    };
  }, []);

  return state;
}

export default function DeveloperMetrics({ title = "Developer Metrics" }) {
  const { stats, projects, loading, error } = useDeveloperMetricsData();

  const metrics = useMemo(() => {
    const languagesUsed = uniqueValues(projects.map((project) => project.language));
    const latestUpdate = projects[0]?.updatedAt ? formatDate(projects[0].updatedAt) : "";

    return [
      {
        label: "Total Problems",
        value: stats?.totalProblems ?? "--",
        description: "Live coding problem count synced from coding-journal.",
      },
      {
        label: "Verified Problems",
        value: stats?.verifiedProblems ?? "--",
        description: "Problems marked as verified in the journal feed.",
      },
      {
        label: "Total Repositories",
        value: stats?.totalRepositories ?? stats?.totalProjects ?? projects.length ?? "--",
        description: latestUpdate ? `Repository data refreshed through ${latestUpdate}.` : "Repository totals from coding-journal.",
      },
      {
        label: "Total Stars",
        value: stats?.totalStars ?? sumNumber(projects, "stars"),
        description: "Combined GitHub stars across synced repositories.",
      },
      {
        label: "Total Forks",
        value: stats?.totalForks ?? sumNumber(projects, "forks"),
        description: "Combined GitHub forks across synced repositories.",
      },
      {
        label: "Languages Used",
        value: stats?.languagesUsed ?? languagesUsed.length,
        description: languagesUsed.length ? languagesUsed.join(", ") : "Languages update automatically as repos change.",
      },
    ];
  }, [projects, stats]);

  return (
    <section className="section-panel">
      <span className="section-eyebrow">Coding Journal</span>
      <h2>{title}</h2>

      {loading ? (
        <article className="glass-card">
          <h3>Loading metrics</h3>
          <p>Fetching the latest stats and repository totals from coding-journal.</p>
        </article>
      ) : error ? (
        <article className="glass-card">
          <h3>Unable to load metrics</h3>
          <p>{error}</p>
        </article>
      ) : (
        <div className="problem-grid">
          {metrics.map((metric) => (
            <article className="problem-card" key={metric.label}>
              <span className="problem-stat">{metric.label}</span>
              <h2>{metric.value}</h2>
              <p>{metric.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
