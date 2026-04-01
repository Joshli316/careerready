"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { useProfileSave } from "@/hooks/useProfileSave";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import en from "@/lib/i18n/en.json";
import zh from "@/lib/i18n/zh.json";

const categoryKeys = ["workHabits", "performance", "communication", "growth"] as const;

export default function SelfEvaluationPage() {
  const { t, language } = useLanguage();
  const translations = language === "zh" ? zh : en;
  const categories = translations.landingTheJob.selfEvaluation.categories;

  const { saved, save, storage } = useProfileSave();
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.selfEvaluation) {
        setRatings(profile.selfEvaluation);
      }
    });
  }, [storage]);

  const handleSave = useCallback(() => save({ selfEvaluation: ratings }), [save, ratings]);

  function setRating(item: string, value: number) {
    setRatings({ ...ratings, [item]: value });
  }

  const allItems = categoryKeys.flatMap((key) => categories[key].items);
  const totalItems = allItems.length;
  const ratedItems = Object.keys(ratings).length;

  return (
    <div>
      <Breadcrumb href="/landing-the-job" label={t("landingTheJob.title")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
        <h1 className="text-2xl font-bold text-neutral-800">{t("landingTheJob.selfEvaluation.title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {t("landingTheJob.selfEvaluation.description")}
        </p>
        </div>
        <SavedIndicator visible={saved} />
      </div>

      <Callout type="tip" className="mb-6">
        {t("landingTheJob.selfEvaluation.callout")}
      </Callout>

      <div className="mb-4 text-sm text-neutral-500">
        {t("landingTheJob.selfEvaluation.ratingScale")}
      </div>

      <div className="space-y-6">
        {categoryKeys.map((key) => {
          const cat = categories[key];
          return (
            <section key={key} className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-neutral-800">{cat.title}</h2>
              <div className="space-y-3">
                {cat.items.map((item) => (
                  <div key={item} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-neutral-700 flex-1">{item}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setRating(item, n)}
                          aria-label={`Rate "${item}" as ${n}`}
                          className={`flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            ratings[item] === n
                              ? "bg-primary-400 text-white"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} size="lg">{t("landingTheJob.selfEvaluation.saveEvaluation")}</Button>
      </div>

      <div className="mt-4 rounded-lg bg-neutral-50 border border-neutral-150 p-4 text-sm text-neutral-500">
        {t("landingTheJob.selfEvaluation.ratedCount").replace("{rated}", String(ratedItems)).replace("{total}", String(totalItems))}
        {ratedItems === totalItems && Object.values(ratings).length > 0 && (
          <span className="ml-2 font-medium text-primary-700">
            {t("landingTheJob.selfEvaluation.average").replace("{avg}", (Object.values(ratings).reduce((a, b) => a + b, 0) / ratedItems).toFixed(1))}
          </span>
        )}
      </div>
    </div>
  );
}
