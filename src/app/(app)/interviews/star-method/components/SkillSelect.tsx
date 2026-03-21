"use client";

import { COMPETENCIES, Competency } from "@/types/interview";

interface SkillSelectProps {
  label: string;
  value: Competency | "";
  onChange: (value: Competency | "") => void;
}

export function SkillSelect({ label, value, onChange }: SkillSelectProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Competency | "")}
        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
      >
        <option value="">Select a skill...</option>
        {COMPETENCIES.map((competency) => (
          <option key={competency} value={competency}>
            {competency}
          </option>
        ))}
      </select>
    </div>
  );
}
