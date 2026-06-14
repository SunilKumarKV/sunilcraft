const CODING_JOURNAL_BASE =
  "https://raw.githubusercontent.com/SunilKumarKV/coding-journal/main/data";
const CODING_JOURNAL_REPO_API =
  "https://api.github.com/repos/SunilKumarKV/coding-journal/contents";
const CODING_JOURNAL_REPO_WEB =
  "https://github.com/SunilKumarKV/coding-journal/tree/main";

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
