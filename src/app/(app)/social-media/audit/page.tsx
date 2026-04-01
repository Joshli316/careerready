"use client";

import { useState, useEffect, useCallback } from "react";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CheckCircle, XCircle } from "lucide-react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import en from "@/lib/i18n/en.json";
import zh from "@/lib/i18n/zh.json";

const auditKeys = ["drugs", "explicit", "unlawful", "aggressive", "discriminatory"] as const;

export default function AuditPage() {
  const { t, language } = useLanguage();
  const translations = language === "zh" ? zh : en;
  const includeItems = translations.socialMedia.audit.includeItems;
  const dontIncludeItems = translations.socialMedia.audit.dontIncludeItems;
  const bgCheckItems = translations.socialMedia.audit.bgCheckItems;

  const { saved, save, storage } = useProfileSave();
  const [results, setResults] = useState<Record<string, "pass" | "fail" | null>>({});

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.socialAudit) {
        setResults(profile.socialAudit);
      }
    });
  }, [storage]);

  const handleSave = useCallback(() => save({ socialAudit: results }), [save, results]);

  return (
    <div>
      <Breadcrumb href="/social-media" label={t("socialMedia.title")} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{t("socialMedia.audit.title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {t("socialMedia.audit.description")}
        </p>
      </div>

      <Callout type="warning" className="mb-6">
        {t("socialMedia.audit.callout")}
      </Callout>

      {/* Do / Don't */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-success">{t("socialMedia.audit.includeTitle")}</h2>
          <ul className="space-y-2">
            {includeItems.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-neutral-600">
                <CheckCircle className="h-4 w-4 shrink-0 text-success mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-error">{t("socialMedia.audit.dontIncludeTitle")}</h2>
          <ul className="space-y-2">
            {dontIncludeItems.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-neutral-600">
                <XCircle className="h-4 w-4 shrink-0 text-error mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Self-Audit */}
      <section className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-neutral-800">{t("socialMedia.audit.bgCheckTitle")}</h2>
        <p className="mb-4 text-sm text-neutral-500">
          {t("socialMedia.audit.bgCheckDesc")}
        </p>
        <div className="space-y-3">
          {bgCheckItems.map((item, i) => (
            <div key={auditKeys[i]} className="flex flex-col gap-3 rounded-lg border border-neutral-150 p-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-neutral-700">{item}</span>
              <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setResults({ ...results, [auditKeys[i]]: "pass" })}
                  aria-pressed={results[auditKeys[i]] === "pass"}
                  className={`flex flex-1 sm:flex-initial items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                    results[auditKeys[i]] === "pass" ? "bg-green-50 text-green-700 border border-green-200" : "bg-neutral-50 text-neutral-500 hover:bg-green-50"
                  }`}
                >
                  <CheckCircle className="h-4 w-4" aria-hidden="true" /> {t("common.pass")}
                </button>
                <button
                  onClick={() => setResults({ ...results, [auditKeys[i]]: "fail" })}
                  aria-pressed={results[auditKeys[i]] === "fail"}
                  className={`flex flex-1 sm:flex-initial items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                    results[auditKeys[i]] === "fail" ? "bg-red-50 text-red-700 border border-red-200" : "bg-neutral-50 text-neutral-500 hover:bg-red-50"
                  }`}
                >
                  <XCircle className="h-4 w-4" aria-hidden="true" /> {t("common.needsWork")}
                </button>
              </div>
            </div>
          ))}
        </div>
        {Object.values(results).some((v) => v === "fail") && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {t("socialMedia.audit.needsWorkWarning")}
          </div>
        )}
      </section>

      <div className="mt-6 flex items-center justify-end gap-3">
        <SavedIndicator visible={saved} />
        <Button onClick={handleSave} size="lg">{t("socialMedia.audit.saveAudit")}</Button>
      </div>
    </div>
  );
}
