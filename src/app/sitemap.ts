import type { MetadataRoute } from "next";

const BASE_URL = "https://careerready.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/know-yourself",
    "/know-yourself/skills",
    "/know-yourself/beliefs",
    "/know-yourself/work-values",
    "/know-yourself/focus-goals",
    "/know-yourself/branding",
    "/know-yourself/power-statement",
    "/applications",
    "/applications/tips",
    "/applications/master-builder",
    "/applications/experience-gap",
    "/resumes",
    "/resumes/builder",
    "/resumes/cover-letter",
    "/resumes/references",
    "/resumes/email-guide",
    "/interviews",
    "/interviews/star-method",
    "/interviews/common-questions",
    "/interviews/company-research",
    "/interviews/thank-you",
    "/interviews/jd-decoder",
    "/interviews/mock-interview",
    "/job-search",
    "/job-search/networking",
    "/job-search/checklist",
    "/job-search/job-boards",
    "/social-media",
    "/social-media/audit",
    "/landing-the-job",
    "/landing-the-job/workplace-success",
    "/landing-the-job/self-evaluation",
    "/contact-log",
  ];

  const topLevelTools = new Set([
    "/dashboard", "/know-yourself", "/applications", "/resumes",
    "/interviews", "/job-search", "/social-media", "/landing-the-job", "/contact-log",
  ]);

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: route === "/" ? 1 : topLevelTools.has(route) ? 0.9 : 0.7,
  }));
}
