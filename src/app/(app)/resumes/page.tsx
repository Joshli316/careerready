"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { PenTool, FileSignature, Users, Mail } from "lucide-react";

const sectionDefs = [
  { titleKey: "resumes.sections.builder.title", descKey: "resumes.sections.builder.description", href: "/resumes/builder", icon: PenTool },
  { titleKey: "resumes.sections.coverLetter.title", descKey: "resumes.sections.coverLetter.description", href: "/resumes/cover-letter", icon: FileSignature },
  { titleKey: "resumes.sections.references.title", descKey: "resumes.sections.references.description", href: "/resumes/references", icon: Users },
  { titleKey: "resumes.sections.emailGuide.title", descKey: "resumes.sections.emailGuide.description", href: "/resumes/email-guide", icon: Mail },
];

export default function ResumesPage() {
  const { t } = useLanguage();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">{t("resumes.title")}</h1>
        <p className="mt-2 text-neutral-500">{t("resumes.description")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sectionDefs.map((s) => (
          <Link key={s.href} href={s.href} className="group flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-400 group-hover:bg-primary-100"><s.icon className="h-5 w-5" /></div>
            <div><h2 className="font-semibold text-neutral-800">{t(s.titleKey)}</h2><p className="mt-1 text-sm text-neutral-500">{t(s.descKey)}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
