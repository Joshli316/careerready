"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { NextStepLink } from "@/components/ui/NextStepLink";

const platformKeys = ["linkedin", "twitter", "instagram", "facebook"] as const;

const platformUrls: Record<string, string> = {
  linkedin: "https://www.linkedin.com",
  twitter: "https://x.com",
  instagram: "https://www.instagram.com",
  facebook: "https://www.facebook.com/settings/?tab=privacy",
};

export default function SocialMediaPage() {
  const { t } = useLanguage();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">{t("socialMedia.title")}</h1>
        <p className="mt-2 text-base text-neutral-500">{t("socialMedia.description")}</p>
      </div>

      {/* Featured: Online Presence Audit */}
      <Link
        href="/social-media/audit"
        className="group mb-6 flex items-center gap-5 rounded-xl border-2 border-primary-300 bg-primary-50/50 p-6 shadow-sm transition-[shadow,border-color,background-color] hover:shadow-md hover:bg-primary-50"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-500 group-hover:bg-primary-200">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-neutral-800">{t("socialMedia.sections.audit.title")}</h2>
            <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-600">{t("common.startHere") || "Start here"}</span>
          </div>
          <p className="mt-1 text-sm text-neutral-600">
            {t("socialMedia.sections.audit.description")}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-primary-400 transition-transform group-hover:translate-x-1" />
      </Link>

      <h2 className="mt-10 mb-4 text-xl font-bold text-neutral-800">{t("socialMedia.platformTips.title")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {platformKeys.map((key) => (
          <a key={key} href={platformUrls[key]} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
            <h3 className="font-semibold text-neutral-800 group-hover:text-primary-400">{t(`socialMedia.platformTips.${key}.name`)}<span className="sr-only"> ({t("common.opensInNewTab")})</span></h3>
            <p className="mt-1 text-sm text-neutral-500">{t(`socialMedia.platformTips.${key}.tip`)}</p>
          </a>
        ))}
      </div>

      <NextStepLink href="/interviews" labelKey="tools.interviews.name" prevHref="/job-search" prevLabelKey="tools.jobSearch.name" />
    </div>
  );
}
