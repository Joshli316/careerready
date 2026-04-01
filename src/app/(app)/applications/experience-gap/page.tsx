"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ToggleButton } from "@/components/ui/ToggleButton";
import en from "@/lib/i18n/en.json";
import zh from "@/lib/i18n/zh.json";

const categoryKeys = ["volunteer", "internships", "campus", "selfEmployment", "partTime"] as const;

export default function ExperienceGapPage() {
  const { t, language } = useLanguage();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const translations = language === "zh" ? zh : en;

  const categories = categoryKeys.map((key) => {
    const cat = translations.applications.experienceGap.categories[key];
    return {
      key,
      title: cat.title,
      description: cat.description,
      items: cat.items,
    };
  });

  function toggle(item: string) {
    const next = new Set(checked);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setChecked(next);
  }

  return (
    <div>
      <Breadcrumb href="/applications" label={t("applications.title")} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{t("applications.experienceGap.title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {t("applications.experienceGap.description")}
        </p>
      </div>

      <Callout type="tip" className="mb-6">
        {t("applications.experienceGap.callout")}
      </Callout>

      <div className="space-y-6">
        {categories.map((cat) => (
          <section key={cat.key} className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <h2 className="mb-1 font-semibold text-neutral-800">{cat.title}</h2>
            <p className="mb-3 text-sm text-neutral-500">{cat.description}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {cat.items.map((item) => (
                  <ToggleButton
                    key={item}
                    label={item}
                    checked={checked.has(item)}
                    onToggle={() => toggle(item)}
                  />
              ))}
            </div>
          </section>
        ))}
      </div>

      {checked.size > 0 && (
        <div className="mt-6 rounded-xl border border-primary-200 bg-primary-50 p-5">
          <h3 className="font-semibold text-primary-800">
            {t("applications.experienceGap.resultTitle").replace("{count}", String(checked.size))}
          </h3>
          <p className="mt-1 text-sm text-primary-700">
            {t("applications.experienceGap.resultDesc")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from(checked).map((item) => (
              <span key={item} className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
