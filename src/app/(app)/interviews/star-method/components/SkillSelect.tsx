"use client";

import { Select } from "@/components/ui/Select";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { COMPETENCIES, Competency } from "@/types/interview";

interface SkillSelectProps {
  label: string;
  value: Competency | "";
  onChange: (value: Competency | "") => void;
}

export function SkillSelect({ label, value, onChange }: SkillSelectProps) {
  const { t } = useLanguage();

  return (
    <Select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as Competency | "")}
    >
      <option value="">{t("interviews.starMethod.selectSkill")}</option>
      {COMPETENCIES.map((competency) => (
        <option key={competency} value={competency}>
          {competency}
        </option>
      ))}
    </Select>
  );
}
