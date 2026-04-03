"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ShieldCheck } from "lucide-react";

const platformKeys = ["linkedin", "twitter", "instagram", "facebook"] as const;

const platformUrls: Record<string, string> = {
  linkedin: "https://www.linkedin.com",
  twitter: "https://x.com",
  instagram: "https://www.instagram.com",
  facebook: "https://www.facebook.com/settings/?tab=privacy",
};

export default function SocialMediaPage() {
  const { t } = useLanguage();

  const sections = [
    { titleKey: "socialMedia.sections.audit.title", descKey: "socialMedia.sections.audit.description", href: "/social-media/audit", icon: ShieldCheck },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">{t("socialMedia.title")}</h1>
        <p className="mt-2 text-base text-neutral-500">{t("socialMedia.description")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="group flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-400 group-hover:bg-primary-100"><s.icon className="h-5 w-5" /></div>
            <div><h2 className="font-semibold text-neutral-800">{t(s.titleKey)}</h2><p className="mt-1 text-sm text-neutral-500">{t(s.descKey)}</p></div>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-xl font-bold text-neutral-800">{t("socialMedia.platformTips.title")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {platformKeys.map((key) => (
          <a key={key} href={platformUrls[key]} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
            <h3 className="font-semibold text-neutral-800 group-hover:text-primary-400">{t(`socialMedia.platformTips.${key}.name`)}<span className="sr-only"> ({t("common.opensInNewTab")})</span></h3>
            <p className="mt-1 text-sm text-neutral-500">{t(`socialMedia.platformTips.${key}.tip`)}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
