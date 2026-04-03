"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Plus, Trash2 } from "lucide-react";

interface Experience {
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
}

interface Props {
  experience: Experience[];
  onUpdate: (index: number, field: string, value: string) => void;
  onUpdateBullet: (expIndex: number, bulletIndex: number, value: string) => void;
  onAddBullet: (expIndex: number) => void;
  onRemoveBullet: (expIndex: number, bulletIndex: number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function ExperienceSection({
  experience,
  onUpdate,
  onUpdateBullet,
  onAddBullet,
  onRemoveBullet,
  onAdd,
  onRemove,
}: Props) {
  const { t } = useLanguage();

  return (
    <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800">{t("resumes.builder.experience")}</h2>
        <Button variant="ghost" size="sm" onClick={onAdd}>
          <Plus className="mr-1 h-4 w-4" />
          {t("common.add")}
        </Button>
      </div>
      {experience.length === 0 && (
        <p className="text-sm text-neutral-400 italic">
          {t("resumes.builder.noExperience")}
        </p>
      )}
      {experience.map((exp, i) => (
        <div key={i} className="mb-4 rounded-lg border border-neutral-100 p-4 last:mb-0">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600">{t("resumes.builder.positionN").replace("{n}", String(i + 1))}</span>
            <button onClick={() => onRemove(i)} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg p-2 text-neutral-400 hover:text-error hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400" aria-label={`${t("common.remove")} ${i + 1}`}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder={t("resumes.builder.jobTitlePlaceholder")} value={exp.title} onChange={(e) => onUpdate(i, "title", e.target.value)} />
            <Input placeholder={t("resumes.builder.companyPlaceholder")} value={exp.company} onChange={(e) => onUpdate(i, "company", e.target.value)} />
            <Input placeholder={t("resumes.builder.locationPlaceholder")} value={exp.location} onChange={(e) => onUpdate(i, "location", e.target.value)} />
            <Input placeholder={t("resumes.builder.datesPlaceholder2")} value={exp.dates} onChange={(e) => onUpdate(i, "dates", e.target.value)} />
          </div>
          <div className="mt-3">
            <label className="mb-1.5 block text-sm font-medium text-neutral-600">
              {t("resumes.builder.bulletLabel")}
            </label>
            {exp.bullets.map((bullet, j) => (
              <div key={j} className="mb-2 flex items-start gap-2">
                <span className="mt-2.5 text-neutral-400">&#8226;</span>
                <Input
                  className="flex-1"
                  placeholder={t("resumes.builder.bulletPlaceholder")}
                  value={bullet}
                  onChange={(e) => onUpdateBullet(i, j, e.target.value)}
                />
                {exp.bullets.length > 1 && (
                  <button onClick={() => onRemoveBullet(i, j)} className="mt-0.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-neutral-400 hover:text-error hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400" aria-label={t("common.removeBullet")}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => onAddBullet(i)} className="rounded-lg px-2 py-1 text-xs font-medium text-primary-400 hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
              {t("common.addBullet")}
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
