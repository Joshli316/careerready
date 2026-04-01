"use client";

import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import en from "@/lib/i18n/en.json";
import zh from "@/lib/i18n/zh.json";

const categoryKeys = ["workHabits", "performance", "communication", "growth", "personalLife"] as const;

export default function WorkplaceSuccessPage() {
  const { t, language } = useLanguage();
  const translations = language === "zh" ? zh : en;
  const categories = translations.landingTheJob.workplaceSuccess.categories;

  return (
    <div>
      <Breadcrumb href="/landing-the-job" label={t("landingTheJob.title")} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{t("landingTheJob.workplaceSuccess.title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {t("landingTheJob.workplaceSuccess.description")}
        </p>
      </div>

      <Callout type="tip" className="mb-6">
        {t("landingTheJob.workplaceSuccess.callout")}
      </Callout>

      <div className="space-y-6">
        {categoryKeys.map((key) => {
          const area = categories[key];
          return (
            <section key={key} className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
              <h2 className="mb-3 font-semibold text-neutral-800">{area.title}</h2>
              <ul className="space-y-2">
                {area.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-neutral-600">
                    <span className="mt-0.5 text-primary-400 shrink-0" aria-hidden="true">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
