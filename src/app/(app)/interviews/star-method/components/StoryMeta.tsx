"use client";

import { Input } from "@/components/ui/Input";
import { StrengthRating } from "./StrengthRating";
import { SkillSelect } from "./SkillSelect";
import type { StarStory, Competency } from "@/types/interview";

interface StoryMetaProps {
  story: StarStory;
  onUpdate: (field: keyof StarStory, value: string | number) => void;
}

export function StoryMeta({ story, onUpdate }: StoryMetaProps) {
  return (
    <div className="space-y-4">
      {/* Strength rating — full width */}
      <StrengthRating
        value={story.strength}
        onChange={(v) => onUpdate("strength", v)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SkillSelect
          label="Primary Skill"
          value={story.primarySkill}
          onChange={(v: Competency | "") => onUpdate("primarySkill", v)}
        />

        <SkillSelect
          label="Secondary Skill"
          value={story.secondarySkill}
          onChange={(v: Competency | "") => onUpdate("secondarySkill", v)}
        />

        <Input
          label="Best deployed for"
          placeholder="e.g., Amazon leadership principles, startup culture fit"
          value={story.deployFor}
          onChange={(e) => onUpdate("deployFor", e.target.value)}
        />

        {/* useCount with +/- controls */}
        <div>
          <p className="mb-1.5 block text-sm font-medium text-neutral-700">
            Use Count
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
              Used {story.useCount} {story.useCount === 1 ? "time" : "times"}
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
