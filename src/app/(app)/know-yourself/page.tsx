"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Brain, Target, Wrench, Heart, Sparkles, Mic } from "lucide-react";

export default function KnowYourselfPage() {
  const { t } = useLanguage();

  const sections: { titleKey: string; descKey: string; href: string; icon: typeof Brain; recommended?: boolean }[] = [
    {
      titleKey: "knowYourself.sections.beliefs.title",
      descKey: "knowYourself.sections.beliefs.description",
      href: "/know-yourself/beliefs",
      icon: Brain,
    },
    {
      titleKey: "knowYourself.sections.focusGoals.title",
      descKey: "knowYourself.sections.focusGoals.description",
      href: "/know-yourself/focus-goals",
      icon: Target,
    },
    {
      titleKey: "knowYourself.sections.skills.title",
      descKey: "knowYourself.sections.skills.description",
      href: "/know-yourself/skills",
      icon: Wrench,
      recommended: true,
    },
    {
      titleKey: "knowYourself.sections.workValues.title",
      descKey: "knowYourself.sections.workValues.description",
      href: "/know-yourself/work-values",
      icon: Heart,
    },
    {
      titleKey: "knowYourself.sections.branding.title",
      descKey: "knowYourself.sections.branding.description",
      href: "/know-yourself/branding",
      icon: Sparkles,
    },
    {
      titleKey: "knowYourself.sections.powerStatement.title",
      descKey: "knowYourself.sections.powerStatement.description",
      href: "/know-yourself/power-statement",
      icon: Mic,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">{t("knowYourself.title")}</h1>
        <p className="mt-2 text-neutral-500">
          {t("knowYourself.description")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-400 group-hover:bg-primary-100">
              <section.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-neutral-800">{t(section.titleKey)}</h2>
                {section.recommended && (
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-700">{t("knowYourself.sections.skills.startHere")}</span>
                )}
              </div>
              <p className="mt-1 text-sm text-neutral-500">{t(section.descKey)}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">{t("knowYourself.nextStep")}</span> {t("knowYourself.nextStepText")}{" "}
          <Link href="/resumes/builder" className="font-medium underline hover:text-blue-900">{t("knowYourself.resumeBuilderLink")}</Link>{" "}
          {t("knowYourself.nextStepSuffix")}
        </p>
      </div>
    </div>
  );
}
