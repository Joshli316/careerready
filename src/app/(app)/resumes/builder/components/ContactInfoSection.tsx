"use client";

import { Input } from "@/components/ui/Input";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Resume } from "@/types/resume";

interface Props {
  contactInfo: Resume["content"]["contactInfo"];
  onChange: (field: keyof Resume["content"]["contactInfo"], value: string) => void;
}

export function ContactInfoSection({ contactInfo, onChange }: Props) {
  const { t } = useLanguage();

  return (
    <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-neutral-800">{t("resumes.builder.contactInfo")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={t("resumes.builder.fullNameLabel")} value={contactInfo.name} onChange={(e) => onChange("name", e.target.value)} placeholder={t("resumes.builder.fullNamePlaceholder")} />
        <Input label={t("resumes.builder.phoneLabel")} value={contactInfo.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder={t("resumes.builder.phonePlaceholder")} inputMode="tel" />
        <Input label={t("resumes.builder.emailLabel")} value={contactInfo.email} onChange={(e) => onChange("email", e.target.value)} placeholder={t("resumes.builder.emailPlaceholder")} inputMode="email" />
        <Input label={t("resumes.builder.linkedinLabel")} value={contactInfo.linkedin ?? ""} onChange={(e) => onChange("linkedin", e.target.value)} placeholder={t("resumes.builder.linkedinPlaceholder")} />
      </div>
    </section>
  );
}
