"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ListChecks, Lightbulb, ClipboardList } from "lucide-react";

export default function ApplicationsPage() {
  const { t } = useLanguage();

  const sections = [
    {
      title: t("applications.sections.tips.title"),
      description: t("applications.sections.tips.description"),
      href: "/applications/tips",
      icon: ListChecks,
    },
    {
      title: t("applications.sections.experienceGap.title"),
      description: t("applications.sections.experienceGap.description"),
      href: "/applications/experience-gap",
      icon: Lightbulb,
    },
    {
      title: t("applications.sections.masterBuilder.title"),
      description: t("applications.sections.masterBuilder.description"),
      href: "/applications/master-builder",
      icon: ClipboardList,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">{t("applications.title")}</h1>
        <p className="mt-2 text-neutral-500">
          {t("applications.description")}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-400 group-hover:bg-primary-100">
              <section.icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-800">{section.title}</h2>
              <p className="mt-1 text-sm text-neutral-500">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
