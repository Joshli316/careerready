"use client";

import { CheckCircle } from "lucide-react";

interface ToggleButtonProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function ToggleButton({ label, checked, onToggle }: ToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      role="checkbox"
      aria-checked={checked}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 min-h-[44px] text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
        checked
          ? "border-primary-400 bg-primary-50 text-primary-700"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
      }`}
    >
      <div
        aria-hidden="true"
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border forced-colors:border-[ButtonText] ${
          checked ? "border-primary-400 bg-primary-400 forced-colors:bg-[Highlight]" : "border-neutral-300"
        }`}
      >
        {checked && <CheckCircle className="h-3 w-3 text-white" />}
      </div>
      {label}
    </button>
  );
}
