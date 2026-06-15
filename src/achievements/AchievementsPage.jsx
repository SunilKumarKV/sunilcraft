import React, { useEffect, useMemo, useState } from "react";
import {
  getJournalProblems,
  getJournalProjects,
  getJournalStats,
  sumNumber,
  uniqueValues,
} from "../lib/codingJournal";
import PageHeader from "../components/ui/PageHeader";
import SectionPanel from "../components/ui/SectionPanel";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

function clampProgress(value, goal) {
  if (!goal) return 0;
  return Math.max(0, Math.min(100, Math.round((value / goal) * 100)));
}

function useAchievementsData() {
  const [state, setState] = useState({
    stats: null,
    problems: [],
    projects: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    let ignore = false;

    Promise.all([getJournalStats(), getJournalProblems(), getJournalProjects()])
      .then(([statsData, problemsData, projectsData]) => {
        if (ignore) return;
        setState({
          stats: statsData ?? null,
          problems: Array.isArray(problemsData) ? problemsData : [],
          projects: Array.isArray(projectsData) ? projectsData : [],
          loading: false,
          error: "",
        });
      })
      .catch((fetchError) => {
        if (ignore) return;
        setState({
          stats: null,
          problems: [],
          projects: [],
          loading: false,
          error: fetchError.message || "Unable to load achievements from coding-journal.",
        });
      });

    return () => {
      ignore = true;
    };
  }, []);

  return state;
}

export default function AchievementsPage() {
  const { stats, problems, projects, loading, error } = useAchievementsData();

  const achievements = useMemo(() => {
    const verifiedProblems =
      stats?.verifiedProblems ?? problems.filter((problem) => problem.verified).length;
    const totalProjects = stats?.totalProjects ?? projects.length;
    const totalStars = stats?.totalStars ?? sumNumber(projects, "stars");
    const uniquePlatforms = uniqueValues(problems.map((problem) => problem.platform));
    const hasJavaScriptSolution = problems.some((problem) => problem.language === "JavaScript");
    const distinctProjectMonths = uniqueValues(
      projects
        .map((project) => project.updatedAt)
        .filter(Boolean)
        .map((value) =>
          new Intl.DateTimeFormat("en-US", {
            month: "short",
            year: "numeric",
          }).format(new Date(value))
        )
    );

    return [
      {
        title: "First Verified Problem",
        current: verifiedProblems,
        goal: 1,
        unlocked: verifiedProblems >= 1,
        detail:
          verifiedProblems >= 1
            ? `${verifiedProblems} verified problems are currently tracked.`
            : "Unlock by verifying the first coding-journal problem.",
      },
      {
        title: "10 Verified Problems",
        current: verifiedProblems,
        goal: 10,
        unlocked: verifiedProblems >= 10,
        detail: `${verifiedProblems} of 10 verified problems completed.`,
      },
      {
        title: "25 Verified Problems",
        current: verifiedProblems,
        goal: 25,
        unlocked: verifiedProblems >= 25,
        detail: `${verifiedProblems} of 25 verified problems completed.`,
      },
      {
        title: "First JavaScript Solution",
        current: hasJavaScriptSolution ? 1 : 0,
        goal: 1,
        unlocked: hasJavaScriptSolution,
        detail: hasJavaScriptSolution
          ? "JavaScript solutions are already present in the coding-journal feed."
          : "Unlock by publishing the first JavaScript solution.",
      },
      {
        title: "Multi-Platform Solver",
        current: uniquePlatforms.length,
        goal: 2,
        unlocked: uniquePlatforms.length >= 2,
        detail: `${uniquePlatforms.length} platform${uniquePlatforms.length === 1 ? "" : "s"} currently tracked.`,
      },
      {
        title: "10 Public Projects",
        current: totalProjects,
        goal: 10,
        unlocked: totalProjects >= 10,
        detail: `${totalProjects} public projects synced from coding-journal.`,
      },
      {
        title: "50 GitHub Stars",
        current: totalStars,
        goal: 50,
        unlocked: totalStars >= 50,
        detail: `${totalStars} total GitHub stars across synced repositories.`,
      },
      {
        title: "100 GitHub Stars",
        current: totalStars,
        goal: 100,
        unlocked: totalStars >= 100,
        detail: `${totalStars} total GitHub stars across synced repositories.`,
      },
      {
        title: "Open Source Builder",
        current: totalProjects,
        goal: 1,
        unlocked: totalProjects >= 1,
        detail:
          totalProjects >= 1
            ? `${totalProjects} public repositories demonstrate active open source building.`
            : "Unlock by publishing the first public repository.",
      },
      {
        title: "Consistent Learner",
        current: distinctProjectMonths.length,
        goal: 3,
        unlocked: distinctProjectMonths.length >= 3,
        detail: `${distinctProjectMonths.length} distinct month${distinctProjectMonths.length === 1 ? "" : "s"} of visible coding-journal activity.`,
      },
    ];
  }, [problems, projects, stats]);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Live Milestones"
        title="Achievements"
        description="Badges generated from real coding-journal activity, not manual claims."
        align="left"
      />

      {loading ? (
        <SectionPanel eyebrow="Loading" title="Achievements">
          <LoadingState title="Loading achievements" message="Fetching milestone data from coding-journal." />
        </SectionPanel>
      ) : error ? (
        <SectionPanel eyebrow="Issue" title="Achievements">
          <ErrorState title="Unable to load achievements" message={error} />
        </SectionPanel>
      ) : !achievements.length ? (
        <SectionPanel eyebrow="Empty" title="Achievements">
          <EmptyState title="No achievements available" message="The current coding-journal feeds do not expose enough data to calculate achievements." />
        </SectionPanel>
      ) : (
        <section className="section-panel">
          <span className="section-eyebrow">Milestone Board</span>
          <h2>Unlocked and In Progress</h2>
          <div className="feature-grid">
            {achievements.map((achievement) => {
              const progress = clampProgress(achievement.current, achievement.goal);

              return (
                <article className="glass-card achievement-card" key={achievement.title}>
                  <div className="achievement-header">
                    <span className={`achievement-badge ${achievement.unlocked ? "unlocked" : "locked"}`}>
                      {achievement.unlocked ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.detail}</p>
                  <div className="achievement-progress" aria-hidden="true">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <small>
                    {achievement.current} / {achievement.goal}
                  </small>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
