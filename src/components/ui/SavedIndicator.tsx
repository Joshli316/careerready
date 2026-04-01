"use client";

import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SavedIndicatorProps {
  visible: boolean;
}

export function SavedIndicator({ visible }: SavedIndicatorProps) {
  const { t } = useLanguage();

  return (
    <div aria-live="polite" aria-atomic="true" className="flex items-center gap-1.5 text-sm text-success">
      {visible && (
        <>
          <CheckCircle className="h-4 w-4" />
          {t("common.saved")}
        </>
      )}
    </div>
  );
}
