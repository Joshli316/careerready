"use client";

import { useState, useEffect, useCallback } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { useProfileSave } from "@/hooks/useProfileSave";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import en from "@/lib/i18n/en.json";
import zh from "@/lib/i18n/zh.json";

export default function ChecklistPage() {
  const { t, language } = useLanguage();
  const translations = language === "zh" ? zh : en;
  const progressItems = translations.jobSearch.checklist.progressItems;
  const methods = translations.jobSearch.checklist.methods;

  const { saved, save, storage } = useProfileSave();
  const [checkedProgress, setCheckedProgress] = useState<Set<number>>(new Set());
  const [checkedMethods, setCheckedMethods] = useState<Set<number>>(new Set());

  useEffect(() => {
    storage.getProfile().then((profile) => {
      const jsc = profile?.jobSearchChecklist;
      if (jsc) {
        if (jsc.progress) setCheckedProgress(new Set(jsc.progress));
        if (jsc.methods) setCheckedMethods(new Set(jsc.methods));
      }
    });
  }, [storage]);

  const handleSave = useCallback(
    () => save({ jobSearchChecklist: { progress: Array.from(checkedProgress), methods: Array.from(checkedMethods) } }),
    [save, checkedProgress, checkedMethods]
  );

  function toggleProgress(i: number) {
    const s = new Set(checkedProgress);
    s.has(i) ? s.delete(i) : s.add(i);
    setCheckedProgress(s);
  }

  function toggleMethod(i: number) {
    const s = new Set(checkedMethods);
    s.has(i) ? s.delete(i) : s.add(i);
    setCheckedMethods(s);
  }

  return (
    <div>
      <Breadcrumb href="/job-search" label={t("jobSearch.title")} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{t("jobSearch.checklist.title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">{t("jobSearch.checklist.description")}</p>
      </div>

      <SavedIndicator visible={saved} />

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-neutral-800">{t("jobSearch.checklist.progressTitle")}</h2>
          <div className="space-y-2">
            {progressItems.map((item, i) => (
                <ToggleButton
                  key={i}
                  label={item}
                  checked={checkedProgress.has(i)}
                  onToggle={() => toggleProgress(i)}
                />
            ))}
          </div>
          <div className="mt-3 text-sm text-neutral-500">
            {t("jobSearch.checklist.progressCount").replace("{checked}", String(checkedProgress.size)).replace("{total}", String(progressItems.length))}
          </div>
        </section>

        <section className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-neutral-800">{t("jobSearch.checklist.methodsTitle")}</h2>
          <div className="space-y-2">
            {methods.map((method, i) => (
                <ToggleButton
                  key={i}
                  label={method}
                  checked={checkedMethods.has(i)}
                  onToggle={() => toggleMethod(i)}
                />
            ))}
          </div>
          <div className="mt-3 text-sm text-neutral-500">
            {t("jobSearch.checklist.methodsCount").replace("{checked}", String(checkedMethods.size)).replace("{total}", String(methods.length))}
          </div>
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} size="lg">{t("jobSearch.checklist.saveProgress")}</Button>
      </div>
    </div>
  );
}
