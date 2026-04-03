"use client";

import Link from "next/link";
import { BookOpen, MessageCircle, Building2, ThumbsUp, FileSearch, Mic } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ReadinessDashboard } from "./components/ReadinessDashboard";

const sectionKeys = [
  { key: "storybank", href: "/interviews/star-method", icon: BookOpen },
  { key: "jdDecoder", href: "/interviews/jd-decoder", icon: FileSearch },
  { key: "mockInterview", href: "/interviews/mock-interview", icon: Mic },
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
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sectionKeys.map((s) => (
          <Link key={s.href} href={s.href} className="group flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-400 group-hover:bg-primary-100"><s.icon className="h-5 w-5" /></div>
            <div><h2 className="font-semibold text-neutral-800">{t(`interviews.sections.${s.key}.title`)}</h2><p className="mt-1 text-sm text-neutral-500">{t(`interviews.sections.${s.key}.description`)}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
