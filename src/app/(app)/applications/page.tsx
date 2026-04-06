"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ListChecks, Lightbulb, ClipboardList, ArrowRight } from "lucide-react";
import { NextStepLink } from "@/components/ui/NextStepLink";

export default function ApplicationsPage() {
  const { t } = useLanguage();

  const supportingSections = [
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
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">{t("applications.title")}</h1>
        <p className="mt-2 text-neutral-500">
          {t("applications.description")}
        </p>
      </div>

      {/* Featured: Master Application Builder */}
      <Link
        href="/applications/master-builder"
        className="group mb-6 flex items-center gap-5 rounded-xl border-2 border-primary-300 bg-primary-50/50 p-6 shadow-sm transition-[shadow,border-color,background-color] hover:shadow-md hover:bg-primary-50"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-500 group-hover:bg-primary-200">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-neutral-800">{t("applications.sections.masterBuilder.title")}</h2>
            <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-600">{t("common.startHere") || "Start here"}</span>
          </div>
          <p className="mt-1 text-sm text-neutral-600">
            {t("applications.sections.masterBuilder.description")}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-primary-400 transition-transform group-hover:translate-x-1" />
      </Link>

      {/* Supporting tools */}
      <div className="grid gap-4 sm:grid-cols-2">
        {supportingSections.map((section) => (
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

      <NextStepLink href="/resumes" labelKey="tools.resumes.name" prevHref="/know-yourself" prevLabelKey="tools.knowYourself.name" />
    </div>
  );
}
