"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-2 focus:left-2 focus:rounded-lg focus:bg-primary-400 focus:px-4 focus:py-2 focus:text-white"
    >
      {t("common.skipToContent")}
    </a>
  );
}
