"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Briefcase, BarChart3 } from "lucide-react";

export default function LandingTheJobPage() {
  const { t } = useLanguage();

  const sections = [
    { titleKey: "landingTheJob.sections.workplaceSuccess.title", descKey: "landingTheJob.sections.workplaceSuccess.description", href: "/landing-the-job/workplace-success", icon: Briefcase },
    { titleKey: "landingTheJob.sections.selfEvaluation.title", descKey: "landingTheJob.sections.selfEvaluation.description", href: "/landing-the-job/self-evaluation", icon: BarChart3 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">{t("landingTheJob.title")}</h1>
        <p className="mt-2 text-base text-neutral-500">{t("landingTheJob.description")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="group flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-400 group-hover:bg-primary-100"><s.icon className="h-5 w-5" /></div>
            <div><h2 className="font-semibold text-neutral-800">{t(s.titleKey)}</h2><p className="mt-1 text-sm text-neutral-500">{t(s.descKey)}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
