"use client";

import type { EmployerContact } from "@/types/contact";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ContactStatsProps {
  contacts: EmployerContact[];
}

export function ContactStats({ contacts }: ContactStatsProps) {
  const { t } = useLanguage();

  const stats = [
    { label: t("contactLog.stats.total"), count: contacts.length },
    { label: t("contactLog.stats.applied"), count: contacts.filter((c) => c.status === "applied").length },
    { label: t("contactLog.stats.interviews"), count: contacts.filter((c) => c.status === "interview" || c.status === "phone_screen").length },
    { label: t("contactLog.stats.offers"), count: contacts.filter((c) => c.status === "offer" || c.status === "accepted").length },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-neutral-150 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-neutral-800">{stat.count}</div>
          <div className="text-xs text-neutral-500">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
