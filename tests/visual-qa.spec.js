import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const screenshotRoot = path.resolve("artifacts/visual-qa");
const issuesPath = path.join(screenshotRoot, "issues.json");

const pages = [
  { name: "home", path: "/" },
  { name: "projects", path: "/projects" },
  { name: "coding", path: "/coding" },
  { name: "career", path: "/career" },
  { name: "dashboard", path: "/dashboard" },
  { name: "problems", path: "/problems" },
  { name: "codebase", path: "/codebase" },
  { name: "about", path: "/about" },
  { name: "contact", path: "/contact" },
];

const viewports = [
  { name: "320x568", width: 320, height: 568 },
  { name: "375x812", width: 375, height: 812 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
];

async function recordIssues(entries) {
  let current = [];
  try {
    current = JSON.parse(await fs.readFile(issuesPath, "utf-8"));
  } catch {}
  current.push(...entries);
  await fs.writeFile(issuesPath, JSON.stringify(current, null, 2));
}

async function triggerInViewContent(page) {
  await page.evaluate(async () => {
    const root = document.scrollingElement || document.documentElement;
    const total = root.scrollHeight - window.innerHeight;
    const steps = Math.max(4, Math.ceil(total / Math.max(window.innerHeight * 0.7, 1)));
    for (let index = 0; index <= steps; index += 1) {
      const progress = total <= 0 ? 0 : Math.round((total * index) / steps);
      window.scrollTo({ top: progress });
      await new Promise((resolve) => window.setTimeout(resolve, 140));
    }
    window.scrollTo({ top: 0 });
  });
  await page.waitForTimeout(300);
}

async function detectLayoutIssues(page) {
  return page.evaluate(() => {
    const issues = [];
    const width = window.innerWidth;
    const root = document.scrollingElement || document.documentElement;

    if (root.scrollWidth - width > 2) {
      issues.push(`Horizontal overflow: scrollWidth ${root.scrollWidth}px > viewport ${width}px`);
    }

    const selectors = [
      ".problem-card",
      ".glass-card",
      ".page-button",
      ".ui-badge",
      ".problem-toolbar",
      ".footer-grid",
      ".timeline-item",
      ".contact-form",
      "pre",
    ];

    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach((node, index) => {
        const rect = node.getBoundingClientRect();
        if (rect.right - width > 2) {
          issues.push(`${selector}[${index}] overflows right by ${Math.round(rect.right - width)}px`);
        }
      });
    }

    return issues;
  });
}

test.beforeAll(async () => {
  await fs.rm(screenshotRoot, { recursive: true, force: true });
  await fs.mkdir(screenshotRoot, { recursive: true });
  await fs.writeFile(issuesPath, "[]");
});

for (const target of pages) {
  test(`visual QA: ${target.path}`, async ({ baseURL }) => {
    test.setTimeout(180000);

    const browser = await chromium.launch({
      executablePath: CHROME_PATH,
      headless: true,
    });

    const issuesForPage = [];

    try {
      for (const viewport of viewports) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          colorScheme: "dark",
        });
        const page = await context.newPage();
        const url = new URL(target.path, baseURL).toString();

        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
        await page.waitForTimeout(1800);
        await triggerInViewContent(page);
        await page.addStyleTag({
          content: "* { caret-color: transparent !important; }",
        });

        await page.screenshot({
          path: path.join(screenshotRoot, `${target.name}-${viewport.name}.png`),
          fullPage: true,
        });

        const issues = await detectLayoutIssues(page);
        if (issues.length) {
          issuesForPage.push({
            page: target.path,
            viewport: viewport.name,
            issues,
          });
        }

        await context.close();
      }
    } finally {
      await browser.close();
    }

    if (issuesForPage.length) {
      await recordIssues(issuesForPage);
    }

    expect(issuesForPage).toEqual([]);
  });
}
