import type { MetadataRoute } from "next";

const BASE = "https://careerready.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = [
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
    "/interviews/jd-decoder",
    "/interviews/mock-interview",
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

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolPages.map((path) => ({
      url: `${BASE}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
