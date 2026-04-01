"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { navItems } from "./navItems";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const navRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileNav = useCallback(() => {
    setMobileOpen(false);
    // Restore focus to the menu button after closing
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (mobileOpen && navRef.current) {
      const firstLink = navRef.current.querySelector("a");
      firstLink?.focus();
    }
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-neutral-150 bg-white px-4 md:h-16 md:px-6">
        <div className="flex items-center gap-3 md:hidden">
          <button
            ref={menuButtonRef}
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100"
            aria-label={t("common.openMenu")}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900">
              <span className="text-xs font-bold text-white">CR</span>
            </div>
            <span className="text-base font-semibold text-neutral-800">CareerReady</span>
          </Link>
        </div>
        <div className="hidden md:block" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">{t("common.dataSavedLocally")}</span>
          <LanguageToggle />
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t("common.navigationMenu")}
          onKeyDown={(e) => { if (e.key === "Escape") closeMobileNav(); }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" role="presentation" onClick={closeMobileNav} />
          <div ref={navRef} className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl animate-in slide-in-from-left duration-200">
            <div className="flex h-14 items-center justify-between border-b border-neutral-150 px-4">
              <span className="text-base font-semibold text-neutral-800">CareerReady</span>
              <button
                onClick={closeMobileNav}
                className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100"
                aria-label={t("common.closeMenu")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="px-3 py-4">
              <ul className="space-y-1">
                {navItems.map((tool) => {
                  const isActive = pathname === tool.href || pathname.startsWith(tool.href + "/");
                  return (
                    <li key={tool.href}>
                      <Link
                        href={tool.href}
                        onClick={closeMobileNav}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                          isActive
                            ? "bg-primary-50 text-primary-700"
                            : "text-neutral-600 hover:bg-neutral-100"
                        )}
                      >
                        <tool.icon className="h-5 w-5" />
                        {tool.nameKey ? t(tool.nameKey) : tool.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
