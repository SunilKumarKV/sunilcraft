import React, { useEffect, useMemo, useState } from "react";
import {
  formatDate,
  getJournalProblems,
  getJournalProjects,
  getJournalStats,
} from "../lib/codingJournal";
import PageHeader from "../components/ui/PageHeader";
import SectionPanel from "../components/ui/SectionPanel";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

function monthLabel(dateValue) {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function sortByDateAscending(items, dateKey) {
  return [...items].sort(
    (a, b) => new Date(a?.[dateKey] || 0) - new Date(b?.[dateKey] || 0)
  );
}

function useJourneyData() {
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
          error: fetchError.message || "Unable to load journey data from coding-journal.",
        });
      });

    return () => {
      ignore = true;
    };
  }, []);

  return state;
}

export default function JourneyPage() {
  const { stats, problems, projects, loading, error } = useJourneyData();

  const journey = useMemo(() => {
    const datedProblems = problems.filter(
      (problem) =>
        problem.addedAt ||
        problem.createdAt ||
        problem.updatedAt ||
        problem.solvedAt ||
        problem.verifiedAt
    );

    const projectTimeline = projects
      .filter((project) => project.updatedAt)
      .map((project) => ({
        type: "project updated",
        title: `${project.name} updated`,
        description: `${project.name} shows ${project.stars || 0} stars and ${project.forks || 0} forks in the current coding-journal snapshot.`,
        date: project.updatedAt,
      }));

    const starForkEvents = projects
      .filter((project) => project.updatedAt && ((project.stars || 0) > 0 || (project.forks || 0) > 0))
      .map((project) => ({
        type: "project starred/forked",
        title: `${project.name} snapshot`,
        description: `Current project data records ${project.stars || 0} stars and ${project.forks || 0} forks.`,
        date: project.updatedAt,
      }));

    const problemAddedEvents = datedProblems
      .filter((problem) => problem.addedAt || problem.createdAt || problem.solvedAt || problem.updatedAt)
      .map((problem) => ({
        type: "problem added",
        title: `${problem.title} added`,
        description: `${problem.platform} • ${problem.difficulty || "Unknown difficulty"}`,
        date: problem.addedAt || problem.createdAt || problem.solvedAt || problem.updatedAt,
      }));

    const verifiedEvents = datedProblems
      .filter((problem) => problem.verified && (problem.verifiedAt || problem.updatedAt || problem.solvedAt))
      .map((problem) => ({
        type: "verified problem",
        title: `${problem.title} verified`,
        description: `${problem.platform} solution marked as verified.`,
        date: problem.verifiedAt || problem.updatedAt || problem.solvedAt,
      }));

    const sortedProjects = sortByDateAscending(
      projects.filter((project) => project.updatedAt),
      "updatedAt"
    );
    const sortedVerifiedProblems = sortByDateAscending(
      datedProblems.filter((problem) => problem.verified),
      "verifiedAt"
    );
    const sortedJavaScriptProblems = sortByDateAscending(
      datedProblems.filter((problem) => problem.language === "JavaScript"),
      "solvedAt"
    );

    const achievementEvents = [];

    if (sortedVerifiedProblems.length) {
      const firstVerified = sortedVerifiedProblems[0];
      achievementEvents.push({
        type: "achievement unlocked",
        title: "First verified problem",
        description: `${firstVerified.title} became the first verified problem in the dated journal feed.`,
        date: firstVerified.verifiedAt || firstVerified.updatedAt || firstVerified.solvedAt,
      });
    }

    if (sortedVerifiedProblems.length >= 10) {
      const tenthVerified = sortedVerifiedProblems[9];
      achievementEvents.push({
        type: "achievement unlocked",
        title: "10 verified problems",
        description: "The dated journal feed reached the 10 verified problems milestone.",
        date: tenthVerified.verifiedAt || tenthVerified.updatedAt || tenthVerified.solvedAt,
      });
    }

    if (sortedProjects.length) {
      achievementEvents.push({
        type: "achievement unlocked",
        title: "First project",
        description: `${sortedProjects[0].name} is the earliest dated public project in the feed.`,
        date: sortedProjects[0].updatedAt,
      });
    }

    if (sortedProjects.length >= 10) {
      achievementEvents.push({
        type: "achievement unlocked",
        title: "10 public projects",
        description: "The coding-journal project feed reached 10 public repositories.",
        date: sortedProjects[9].updatedAt,
      });
    }

    if (sortedJavaScriptProblems.length) {
      achievementEvents.push({
        type: "achievement unlocked",
        title: "First JavaScript solution",
        description: `${sortedJavaScriptProblems[0].title} is the earliest dated JavaScript solution in the feed.`,
        date:
          sortedJavaScriptProblems[0].solvedAt ||
          sortedJavaScriptProblems[0].updatedAt ||
          sortedJavaScriptProblems[0].createdAt,
      });
    }

    const allEvents = [
      ...projectTimeline,
      ...starForkEvents,
      ...problemAddedEvents,
      ...verifiedEvents,
      ...achievementEvents,
    ]
      .filter((event) => event.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const grouped = allEvents.reduce((acc, event) => {
      const key = monthLabel(event.date);
      if (!key) return acc;
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {});

    const groupedTimeline = Object.entries(grouped).map(([month, events]) => ({
      month,
      events,
    }));

    const achievements = [
      {
        title: "First verified problem",
        achieved: (stats?.verifiedProblems ?? problems.filter((problem) => problem.verified).length) >= 1,
        detail:
          sortedVerifiedProblems.length
            ? `Dated milestone available for ${sortedVerifiedProblems[0].title}.`
            : "Current problems feed has no dated verification field yet.",
      },
      {
        title: "10 verified problems",
        achieved: (stats?.verifiedProblems ?? problems.filter((problem) => problem.verified).length) >= 10,
        detail:
          sortedVerifiedProblems.length >= 10
            ? "Dated milestone available in the journal feed."
            : "The current feed has fewer than 10 dated verified problems.",
      },
      {
        title: "First project",
        achieved: projects.length >= 1,
        detail:
          sortedProjects.length
            ? `${sortedProjects[0].name} anchors the first project milestone.`
            : "No project dates found in the feed.",
      },
      {
        title: "10 public projects",
        achieved: projects.length >= 10,
        detail:
          sortedProjects.length >= 10
            ? "The 10-project milestone is dated from project metadata."
            : `${projects.length} public projects currently available.`,
      },
      {
        title: "First JavaScript solution",
        achieved: problems.some((problem) => problem.language === "JavaScript"),
        detail:
          sortedJavaScriptProblems.length
            ? `${sortedJavaScriptProblems[0].title} is the earliest dated JavaScript solution.`
            : "Current problems feed does not include dated JavaScript solution history yet.",
      },
    ];

    return {
      groupedTimeline,
      achievements,
      hasProblemDates: datedProblems.length > 0,
      projectCount: projects.length,
      problemCount: problems.length,
    };
  }, [problems, projects, stats]);

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Developer Journey"
        title="Journey"
        description="A timeline of the projects, problems, and milestones I’m building over time."
        align="left"
      />

      {loading ? (
        <SectionPanel eyebrow="Loading" title="Journey">
          <LoadingState title="Loading journey" message="Fetching live timeline signals from coding-journal." />
        </SectionPanel>
      ) : error ? (
        <SectionPanel eyebrow="Issue" title="Journey">
          <ErrorState title="Unable to load journey" message={error} />
        </SectionPanel>
      ) : !journey.groupedTimeline.length && !journey.projectCount && !journey.problemCount ? (
        <SectionPanel eyebrow="Empty" title="Journey">
          <EmptyState title="No journey data found" message="The coding-journal feeds did not return enough data to build a journey view." />
        </SectionPanel>
      ) : (
        <>
          <section className="section-panel">
            <span className="section-eyebrow">Timeline</span>
            <h2>Month by Month</h2>

            {journey.groupedTimeline.length ? (
              <div className="timeline-list">
                {journey.groupedTimeline.map((group) => (
                  <article className="timeline-item" key={group.month}>
                    <span>{group.month}</span>
                    <div>
                      {group.events.map((event) => (
                        <div key={`${event.type}-${event.title}-${event.date}`} className="journey-event">
                          <h3>{event.title}</h3>
                          <p>{event.description}</p>
                          <small>{event.type} • {formatDate(event.date)}</small>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <article className="glass-card">
                <h3>No dated timeline events yet</h3>
                <p>The current coding-journal feeds do not yet expose enough dated entries to build a month-grouped timeline.</p>
              </article>
            )}
          </section>

          <section className="section-panel">
            <span className="section-eyebrow">Achievements</span>
            <h2>Milestones</h2>
            <div className="feature-grid">
              {journey.achievements.map((achievement) => (
                <article className="glass-card" key={achievement.title}>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.achieved ? "Unlocked" : "In Progress"}</p>
                  <p>{achievement.detail}</p>
                </article>
              ))}
            </div>
          </section>

          {!journey.hasProblemDates ? (
            <section className="section-panel">
              <span className="section-eyebrow">Feed Coverage</span>
              <h2>Problem History Notes</h2>
              <article className="glass-card">
                <h3>Problem events will expand automatically</h3>
                <p>
                  The current `coding-journal/data/problems.json` feed includes live problem counts,
                  verification status, tags, and languages, but it does not yet expose per-problem
                  timeline dates such as `addedAt` or `verifiedAt`. As soon as those fields are added,
                  this page will automatically include dated `problem added` and `verified problem`
                  events without code changes.
                </p>
              </article>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
