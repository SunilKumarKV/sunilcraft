import React, { useMemo } from "react";
import {
  formatDate,
  getJournalProjects,
  getJournalStats,
  sumNumber,
  uniqueValues,
} from "../lib/codingJournal";
import SectionPanel from "./ui/SectionPanel";
import LoadingState from "./ui/LoadingState";
import ErrorState from "./ui/ErrorState";
import StatCard from "./ui/StatCard";

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
    <SectionPanel eyebrow="Coding Journal" title={title}>
      {loading ? (
        <LoadingState title="Loading metrics" message="Fetching the latest stats and repository totals from coding-journal." />
      ) : error ? (
        <ErrorState title="Unable to load metrics" message={error} />
      ) : (
        <div className="problem-grid">
          {metrics.map((metric) => (
            <StatCard key={metric.label} label={metric.label} value={metric.value} description={metric.description} />
          ))}
        </div>
      )}
    </SectionPanel>
  );
}
