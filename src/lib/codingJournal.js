const CODING_JOURNAL_BASE =
  "https://raw.githubusercontent.com/SunilKumarKV/coding-journal/main/data";
const CODING_JOURNAL_REPO_API =
  "https://api.github.com/repos/SunilKumarKV/coding-journal/contents";
const CODING_JOURNAL_REPO_WEB =
  "https://github.com/SunilKumarKV/coding-journal/tree/main";
const CODING_JOURNAL_REPO_BLOB =
  "https://github.com/SunilKumarKV/coding-journal/blob/main";

const PROBLEMS_URL = `${CODING_JOURNAL_BASE}/problems.json`;
const PROJECTS_URL = `${CODING_JOURNAL_BASE}/projects.json`;
const STATS_URL = `${CODING_JOURNAL_BASE}/stats.json`;

const resourceCache = new Map();

async function fetchCachedJson(cacheKey, url) {
  if (resourceCache.has(cacheKey)) {
    return resourceCache.get(cacheKey);
  }

  const promise = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load ${cacheKey} from coding-journal.`);
      }

      return response.json();
    })
    .catch((error) => {
      resourceCache.delete(cacheKey);
      throw error;
    });

  resourceCache.set(cacheKey, promise);
  return promise;
}

async function fetchCachedText(cacheKey, url) {
  if (resourceCache.has(cacheKey)) {
    return resourceCache.get(cacheKey);
  }

  const promise = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load ${cacheKey} from coding-journal.`);
      }

      return response.text();
    })
    .catch((error) => {
      resourceCache.delete(cacheKey);
      throw error;
    });

  resourceCache.set(cacheKey, promise);
  return promise;
}

export function getJournalProblems() {
  return fetchCachedJson("problems", PROBLEMS_URL);
}

export function getJournalProjects() {
  return fetchCachedJson("projects", PROJECTS_URL);
}

export function getJournalStats() {
  return fetchCachedJson("stats", STATS_URL);
}

export function normalizePlatformName(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return "Others";
  if (normalized === "leetcode") return "LeetCode";
  if (normalized === "hackerrank") return "HackerRank";
  if (normalized === "codechef") return "CodeChef";
  if (normalized === "codeforces") return "Codeforces";
  if (normalized === "custom") return "Custom";
  return String(value || "").trim();
}

export function getJournalProblemFolderApiUrl(platform, slug) {
  return `${CODING_JOURNAL_REPO_API}/problems/${toPlatformSegment(platform)}/${slug}`;
}

export function getJournalProblemFolderWebUrl(platform, slug) {
  return `${CODING_JOURNAL_REPO_WEB}/problems/${toPlatformSegment(platform)}/${slug}`;
}

export function getJournalProblemFolderListing(platform, slug) {
  const cacheKey = `problem-folder:${toPlatformSegment(platform)}:${slug}`;
  return fetchCachedJson(cacheKey, getJournalProblemFolderApiUrl(platform, slug));
}

export function getCachedText(url) {
  return fetchCachedText(`text:${url}`, url);
}

export function normalizeProblemSolutions(problem) {
  if (Array.isArray(problem?.solutions) && problem.solutions.length) {
    return problem.solutions
      .map((solution, index) => ({
        id: `${solution.language || "solution"}-${solution.filename || index}`,
        language: solution.language || "Plain Text",
        filename: solution.filename || "",
        code: solution.code || "",
        path: solution.path || "",
      }))
      .filter((solution) => solution.code);
  }

  const fallbackCode =
    problem?.solutionCode || problem?.solution || problem?.code || "";
  if (!fallbackCode) return [];

  return [
    {
      id: `${problem?.language || "solution"}-fallback`,
      language: problem?.language || "Plain Text",
      filename: "",
      code: fallbackCode,
      path: "",
    },
  ];
}

export function getProblemSubmissionLanguages(problem) {
  if (!Array.isArray(problem?.submissions)) return [];

  return uniqueValues(
    problem.submissions
      .map((submission) => submission?.language || submission?.programmingLanguage || "")
      .filter(Boolean)
  );
}

export function getProblemLanguages(problem) {
  const solutionLanguages = normalizeProblemSolutions(problem).map(
    (solution) => solution.language
  );

  if (solutionLanguages.length) {
    return uniqueValues(solutionLanguages);
  }

  const submissionLanguages = getProblemSubmissionLanguages(problem);
  if (submissionLanguages.length) {
    return submissionLanguages;
  }

  return uniqueValues([problem?.language || ""]);
}

export function isPlatformProfileSummary(problem) {
  return Boolean(
    problem &&
      String(problem.slug || "").startsWith("profile-") &&
      Number(problem.solvedCount) > 0 &&
      String(problem.source || "").toLowerCase().includes("summary")
  );
}

export function getProblemTrackedCount(problem) {
  if (isPlatformProfileSummary(problem)) {
    return Number(problem.solvedCount) || 0;
  }

  return 1;
}

export function getProblemSourceUrl(solutionPath) {
  if (!solutionPath) return "";
  return `${CODING_JOURNAL_REPO_BLOB}/${solutionPath.replace(/^\//, "")}`;
}

export function hasProblemCode(problem) {
  return normalizeProblemSolutions(problem).length > 0;
}

export function getProblemPrimaryUrl(problem) {
  return problem?.url || problem?.detailUrl || problem?.questionUrl || "";
}

export function getProblemSolvedAt(problem) {
  return (
    problem?.solvedAt ||
    problem?.updatedAt ||
    problem?.createdAt ||
    problem?.addedAt ||
    ""
  );
}

export function toPlatformSegment(platform) {
  return String(platform || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function toProjectSlug(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function uniqueValues(items) {
  return [...new Set(items.filter(Boolean))];
}

export function formatDate(dateValue) {
  if (!dateValue) return "";

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export function sumNumber(items, key) {
  return items.reduce((total, item) => total + (Number(item?.[key]) || 0), 0);
}

export const codingJournalSources = {
  problems: PROBLEMS_URL,
  projects: PROJECTS_URL,
  stats: STATS_URL,
};
