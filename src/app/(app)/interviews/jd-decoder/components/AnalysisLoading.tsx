"use client";

import { Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function AnalysisLoading() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-48 rounded bg-neutral-200" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-neutral-100" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-neutral-100" />
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("interviews.jdDecoder.loadingMessage")}
      </div>
    </div>
  );
}
