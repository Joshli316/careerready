import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://careerready.pages.dev";

  const routes = [
    "/",
    "/dashboard",
    "/know-yourself",
    "/know-yourself/beliefs",
    "/know-yourself/focus-goals",
    "/know-yourself/skills",
    "/know-yourself/work-values",
    "/know-yourself/branding",
    "/know-yourself/power-statement",
    "/applications",
    "/applications/tips",
    "/applications/experience-gap",
    "/applications/master-builder",
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
    "/job-search",
    "/job-search/networking",
    "/job-search/job-boards",
    "/job-search/checklist",
    "/social-media",
    "/social-media/audit",
    "/landing-the-job",
    "/landing-the-job/workplace-success",
    "/landing-the-job/self-evaluation",
    "/contact-log",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : route.split("/").length <= 2 ? 0.8 : 0.6,
  }));
}
