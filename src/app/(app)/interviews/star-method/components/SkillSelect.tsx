"use client";

import { Select } from "@/components/ui/Select";
import { COMPETENCIES, Competency } from "@/types/interview";

interface SkillSelectProps {
  label: string;
  value: Competency | "";
  onChange: (value: Competency | "") => void;
}

export function SkillSelect({ label, value, onChange }: SkillSelectProps) {
  return (
    <Select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as Competency | "")}
    >
      <option value="">Select a skill...</option>
      {COMPETENCIES.map((competency) => (
        <option key={competency} value={competency}>
          {competency}
        </option>
      ))}
    </Select>
  );
}
