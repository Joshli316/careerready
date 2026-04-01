"use client";

import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/lib/i18n/LanguageContext";

function NotFoundContent() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100">
          <span className="text-2xl font-bold text-neutral-400">404</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-800">{t("errors.notFound.title")}</h1>
        <p className="mt-2 text-neutral-500">
          {t("errors.notFound.description")}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
          >
            {t("errors.notFound.goHome")}
          </Link>
          <Link
            href="/know-yourself"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
          >
            {t("errors.notFound.openToolkit")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <LanguageProvider>
      <NotFoundContent />
    </LanguageProvider>
  );
}
