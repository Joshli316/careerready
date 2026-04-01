"use client";

import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const boardKeys = ["linkedin", "indeed", "glassdoor", "handshake", "googleJobs", "usajobs", "wellfound", "ziprecruiter"] as const;

const boardUrls: Record<string, string> = {
  linkedin: "https://www.linkedin.com/jobs",
  indeed: "https://www.indeed.com",
  glassdoor: "https://www.glassdoor.com",
  handshake: "https://joinhandshake.com",
  googleJobs: "https://www.google.com/search?q=jobs+near+me",
  usajobs: "https://www.usajobs.gov",
  wellfound: "https://wellfound.com",
  ziprecruiter: "https://www.ziprecruiter.com",
};

export default function JobBoardsPage() {
  const { t } = useLanguage();

  return (
    <div>
      <Breadcrumb href="/job-search" label={t("jobSearch.title")} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{t("jobSearch.jobBoards.title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">{t("jobSearch.jobBoards.description")}</p>
      </div>

      <Callout type="tip" className="mb-6">
        {t("jobSearch.jobBoards.callout")}
      </Callout>

      <Callout type="warning" className="mb-6">
        <strong>{t("jobSearch.jobBoards.scamWarning")}</strong>
      </Callout>

      <div className="grid gap-4 sm:grid-cols-2">
        {boardKeys.map((key) => (
          <a
            key={key}
            href={boardUrls[key]}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300"
          >
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-800 group-hover:text-primary-400">{t(`jobSearch.jobBoards.boards.${key}.name`)}</h2>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">{t(`jobSearch.jobBoards.boards.${key}.type`)}</span>
            </div>
            <p className="text-sm text-neutral-600">{t(`jobSearch.jobBoards.boards.${key}.tip`)}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
