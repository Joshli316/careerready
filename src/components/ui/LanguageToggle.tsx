"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "zh" : "en")}
      className="flex h-8 items-center rounded-lg border border-neutral-200 bg-white px-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-800"
      aria-label={language === "en" ? t("common.switchToChinese") : t("common.switchToEnglish")}
    >
      {language === "en" ? "中" : "EN"}
    </button>
  );
}
