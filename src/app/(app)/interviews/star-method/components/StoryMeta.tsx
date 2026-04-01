"use client";

import { Input } from "@/components/ui/Input";
import { StrengthRating } from "./StrengthRating";
import { SkillSelect } from "./SkillSelect";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { StarStory, Competency } from "@/types/interview";

interface StoryMetaProps {
  story: StarStory;
  onUpdate: (field: keyof StarStory, value: string | number) => void;
}

export function StoryMeta({ story, onUpdate }: StoryMetaProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Strength rating — full width */}
      <StrengthRating
        value={story.strength}
        onChange={(v) => onUpdate("strength", v)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SkillSelect
          label={t("interviews.starMethod.primarySkill")}
          value={story.primarySkill}
          onChange={(v: Competency | "") => onUpdate("primarySkill", v)}
        />

        <SkillSelect
          label={t("interviews.starMethod.secondarySkill")}
          value={story.secondarySkill}
          onChange={(v: Competency | "") => onUpdate("secondarySkill", v)}
        />

        <Input
          label={t("interviews.starMethod.bestDeployedFor")}
          placeholder={t("interviews.starMethod.bestDeployedForPlaceholder")}
          value={story.deployFor}
          onChange={(e) => onUpdate("deployFor", e.target.value)}
        />

        {/* useCount with +/- controls */}
        <div>
          <p className="mb-1.5 block text-sm font-medium text-neutral-700">
            {t("interviews.starMethod.useCount")}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease use count"
              onClick={() => onUpdate("useCount", Math.max(0, story.useCount - 1))}
              className="rounded border border-neutral-200 px-2 py-0.5 text-xs text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
            >
              −
            </button>
            <span className="min-w-[6rem] text-sm text-neutral-700">
              {t("interviews.starMethod.usedCount")
                .replace("{count}", String(story.useCount))
                .replace("{unit}", story.useCount === 1 ? t("interviews.starMethod.time") : t("interviews.starMethod.times"))}
            </span>
            <button
              type="button"
              aria-label="Increase use count"
              onClick={() => onUpdate("useCount", story.useCount + 1)}
              className="rounded border border-neutral-200 px-2 py-0.5 text-xs text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
