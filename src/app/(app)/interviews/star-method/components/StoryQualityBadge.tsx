"use client";

import { cn } from "@/lib/utils/cn";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface StoryQualityBadgeProps {
  score: number;
}

export function StoryQualityBadge({ score }: StoryQualityBadgeProps) {
  const { t } = useLanguage();
  const color =
    score >= 80 ? "bg-success" : score >= 50 ? "bg-warning" : "bg-error";

  return (
    <span
      className={cn("inline-block h-2 w-2 rounded-full", color)}
      aria-label={t("interviews.starMethod.storyQuality").replace("{score}", String(score))}
    />
  );
}
