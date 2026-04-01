"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface StrengthRatingProps {
  value: number;
  onChange: (value: number) => void;
}

export function StrengthRating({ value, onChange }: StrengthRatingProps) {
  const { t } = useLanguage();

  return (
    <div>
      <p className="mb-1 text-sm font-medium text-neutral-700">{t("interviews.starMethod.storyStrength")}</p>
      <div role="radiogroup" aria-label={t("interviews.starMethod.storyStrength")} className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n !== 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            type="button"
            className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
          >
            <Star
              size={20}
              className={cn(
                n <= value
                  ? "fill-warning text-warning"
                  : "text-neutral-300"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
