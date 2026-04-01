"use client";

import { useState, useEffect, useCallback } from "react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const VALUE_KEYS: { value: string; nameKey: string; descKey: string }[] = [
  { value: "Achievement", nameKey: "knowYourself.workValues.values.achievement", descKey: "knowYourself.workValues.values.achievementDesc" },
  { value: "Relationships", nameKey: "knowYourself.workValues.values.relationships", descKey: "knowYourself.workValues.values.relationshipsDesc" },
  { value: "Support", nameKey: "knowYourself.workValues.values.support", descKey: "knowYourself.workValues.values.supportDesc" },
  { value: "Independence", nameKey: "knowYourself.workValues.values.independence", descKey: "knowYourself.workValues.values.independenceDesc" },
  { value: "Recognition", nameKey: "knowYourself.workValues.values.recognition", descKey: "knowYourself.workValues.values.recognitionDesc" },
  { value: "Working Conditions", nameKey: "knowYourself.workValues.values.workingConditions", descKey: "knowYourself.workValues.values.workingConditionsDesc" },
];

export default function WorkValuesPage() {
  const { saved, save, storage } = useProfileSave();
  const { t } = useLanguage();
  const [rankings, setRankings] = useState(VALUE_KEYS.map((v, i) => ({ ...v, rank: i + 1 })));

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.workValues?.length) {
        const ranked = VALUE_KEYS.map((v) => {
          const found = profile.workValues?.find((wv) => wv.value === v.value);
          return { ...v, rank: found?.rank ?? VALUE_KEYS.indexOf(v) + 1 };
        }).sort((a, b) => a.rank - b.rank);
        setRankings(ranked);
      }
    });
  }, [storage]);

  const handleSave = useCallback(
    () => save({ workValues: rankings.map((r, i) => ({ value: r.value, rank: i + 1 })) }),
    [save, rankings]
  );

  function moveUp(index: number) {
    if (index === 0) return;
    const updated = [...rankings];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setRankings(updated);
  }

  function moveDown(index: number) {
    if (index === rankings.length - 1) return;
    const updated = [...rankings];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setRankings(updated);
  }

  return (
    <div>
      <Breadcrumb href="/know-yourself" label={t("knowYourself.title")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("knowYourself.workValues.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("knowYourself.workValues.description")}
          </p>
        </div>
        <SavedIndicator visible={saved} />
      </div>

      <Callout type="tip" className="mb-6">
        {t("knowYourself.workValues.callout")}
      </Callout>

      <div className="space-y-3">
        {rankings.map((item, index) => (
          <div
            key={item.value}
            className="flex items-center gap-3 rounded-xl border border-neutral-150 bg-white p-4 shadow-sm"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-700">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-neutral-800">{t(item.nameKey)}</div>
              <div className="text-sm text-neutral-500">{t(item.descKey)}</div>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveUp(index)}
                disabled={index === 0}
                aria-label={`Move ${t(item.nameKey)} up`}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-30"
              >
                ▲
              </button>
              <button
                onClick={() => moveDown(index)}
                disabled={index === rankings.length - 1}
                aria-label={`Move ${t(item.nameKey)} down`}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-30"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} size="lg">{t("knowYourself.workValues.saveRankings")}</Button>
      </div>
    </div>
  );
}
