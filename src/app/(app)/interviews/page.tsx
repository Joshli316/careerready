"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { BookOpen, MessageCircle, Building2, ThumbsUp, FileSearch, Mic, ArrowRight } from "lucide-react";
import { NextStepLink } from "@/components/ui/NextStepLink";
import { ReadinessDashboard } from "./components/ReadinessDashboard";

const featuredKeys = [
  { key: "mockInterview", href: "/interviews/mock-interview", icon: Mic },
  { key: "jdDecoder", href: "/interviews/jd-decoder", icon: FileSearch },
] as const;

const supportingKeys = [
  { key: "storybank", href: "/interviews/star-method", icon: BookOpen },
  { key: "commonQuestions", href: "/interviews/common-questions", icon: MessageCircle },
  { key: "companyResearch", href: "/interviews/company-research", icon: Building2 },
  { key: "thankYou", href: "/interviews/thank-you", icon: ThumbsUp },
] as const;

export default function InterviewsPage() {
  const { t } = useLanguage();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">{t("interviews.title")}</h1>
        <p className="mt-2 text-base text-neutral-500">{t("interviews.description")}</p>
      </div>
      <ReadinessDashboard />

      {/* Featured: AI Mock Interview & JD Decoder */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        {featuredKeys.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex items-center gap-5 rounded-xl border-2 border-primary-300 bg-primary-50/50 p-6 shadow-sm transition-[shadow,border-color,background-color] hover:shadow-md hover:bg-primary-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-500 group-hover:bg-primary-200">
              <s.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-800">{t(`interviews.sections.${s.key}.title`)}</h2>
              </div>
              <p className="mt-1 text-sm text-neutral-600">{t(`interviews.sections.${s.key}.description`)}</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-primary-400 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>

      {/* Supporting tools */}
      <div className="grid gap-4 sm:grid-cols-2">
        {supportingKeys.map((s) => (
          <Link key={s.href} href={s.href} className="group flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-400 group-hover:bg-primary-100"><s.icon className="h-5 w-5" /></div>
            <div><h2 className="font-semibold text-neutral-800">{t(`interviews.sections.${s.key}.title`)}</h2><p className="mt-1 text-sm text-neutral-500">{t(`interviews.sections.${s.key}.description`)}</p></div>
          </Link>
        ))}
      </div>

      <NextStepLink href="/contact-log" labelKey="tools.contactLog.name" prevHref="/social-media" prevLabelKey="tools.socialMedia.name" />
    </div>
  );
}
