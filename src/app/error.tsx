"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/lib/i18n/LanguageContext";

function GlobalErrorContent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="text-center" role="alert">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <span className="text-2xl text-red-500">!</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-800">{t("errors.global.title")}</h1>
        <p className="mt-2 text-sm text-neutral-500">
          {t("errors.global.description")}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-primary-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
          >
            {t("common.tryAgain")}
          </button>
          <Link
            href="/"
            className="rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            {t("errors.global.goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <LanguageProvider>
      <GlobalErrorContent error={error} reset={reset} />
    </LanguageProvider>
  );
}
