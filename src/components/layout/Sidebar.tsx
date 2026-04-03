"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { navItems } from "./navItems";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToolProgress } from "@/hooks/useToolProgress";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { started, count, total } = useToolProgress();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearData = () => {
    const lang = localStorage.getItem("careerready-lang");
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("careerready_"));
    keys.forEach((k) => localStorage.removeItem(k));
    if (lang) localStorage.setItem("careerready-lang", lang);
    setShowClearConfirm(false);
    window.location.reload();
  };

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-neutral-150 md:bg-white">
      <div className="flex h-16 items-center justify-between border-b border-neutral-150 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900">
            <span className="text-sm font-bold text-white">CR</span>
          </div>
          <span className="text-base font-semibold text-neutral-800">CareerReady</span>
        </Link>
        <LanguageToggle />
      </div>
      {count > 0 && (
        <div className="mx-3 mt-3 rounded-lg bg-primary-50 px-3 py-2">
          <div className="flex items-center justify-between text-xs font-medium text-primary-700">
            <span>{t("nav.progress").replace("{count}", String(count)).replace("{total}", String(total))}</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-primary-100">
            <div
              role="progressbar"
              aria-valuenow={count}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-label={t("nav.progress").replace("{count}", String(count)).replace("{total}", String(total))}
              className="h-1.5 rounded-full bg-primary-500 transition-all duration-500"
              style={{ width: `${(count / total) * 100}%` }}
            />
          </div>
        </div>
      )}
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((tool) => {
            const isActive = pathname === tool.href || pathname.startsWith(tool.href + "/");
            const isStarted = started[tool.href];
            return (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 min-h-[44px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                  )}
                >
                  <tool.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="flex-1">{tool.nameKey ? t(tool.nameKey) : tool.name}</span>
                  {isStarted && (
                    <Check className="h-4 w-4 shrink-0 text-green-500" aria-label={t("nav.started")} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {count > 0 && (
        <div className="border-t border-neutral-150 px-3 py-3">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t("nav.clearData")}
          </button>
        </div>
      )}
      <ConfirmDialog
        open={showClearConfirm}
        title={t("nav.clearDataTitle")}
        message={t("nav.clearDataConfirm")}
        confirmLabel={t("nav.clearDataButton")}
        onConfirm={handleClearData}
        onCancel={() => setShowClearConfirm(false)}
      />
    </aside>
  );
}
