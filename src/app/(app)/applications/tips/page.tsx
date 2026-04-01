"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function ApplicationTipsPage() {
  const { t } = useLanguage();

  const tips = [
    { number: 1, title: t("applications.tips.tip1Title"), description: t("applications.tips.tip1Desc") },
    { number: 2, title: t("applications.tips.tip2Title"), description: t("applications.tips.tip2Desc") },
    { number: 3, title: t("applications.tips.tip3Title"), description: t("applications.tips.tip3Desc") },
    { number: 4, title: t("applications.tips.tip4Title"), description: t("applications.tips.tip4Desc") },
    { number: 5, title: t("applications.tips.tip5Title"), description: t("applications.tips.tip5Desc") },
    { number: 6, title: t("applications.tips.tip6Title"), description: t("applications.tips.tip6Desc") },
    { number: 7, title: t("applications.tips.tip7Title"), description: t("applications.tips.tip7Desc") },
    { number: 8, title: t("applications.tips.tip8Title"), description: t("applications.tips.tip8Desc") },
    { number: 9, title: t("applications.tips.tip9Title"), description: t("applications.tips.tip9Desc") },
    { number: 10, title: t("applications.tips.tip10Title"), description: t("applications.tips.tip10Desc") },
  ];

  return (
    <div>
      <Breadcrumb href="/applications" label={t("applications.title")} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{t("applications.tips.title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {t("applications.tips.description")}
        </p>
      </div>

      <Callout type="tip" className="mb-6">
        {t("applications.tips.callout")}
      </Callout>

      <div className="space-y-4">
        {tips.map((tip) => (
          <div key={tip.number} className="flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-400 text-lg font-bold text-white">
              {tip.number}
            </div>
            <div>
              <h2 className="font-semibold text-neutral-800">{tip.title}</h2>
              <p className="mt-1 text-sm text-neutral-600">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
