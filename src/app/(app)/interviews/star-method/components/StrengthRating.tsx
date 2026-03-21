"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StrengthRatingProps {
  value: number;
  onChange: (value: number) => void;
}

export function StrengthRating({ value, onChange }: StrengthRatingProps) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-neutral-700">Story Strength</p>
      <div role="radiogroup" aria-label="Story Strength" className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n !== 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            type="button"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
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
