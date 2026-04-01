"use client";

import type { StarStory } from "@/types/interview";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { isStoryComplete } from "@/app/(app)/interviews/star-method/lib/storyUtils";

const TARGET = 8;

interface Props {
  stories: StarStory[];
}

export function StoryProgress({ stories }: Props) {
  const { t } = useLanguage();
  const total = stories.length;
  const complete = stories.filter(isStoryComplete).length;
  const needsWork = total - complete;
  const pct = Math.min((total / TARGET) * 100, 100);

  return (
    <div>
      <p className="text-sm font-medium text-neutral-600 mb-3">Story Progress</p>
      <p className="text-sm text-neutral-600 mb-1">
        {total} / {TARGET} stories
      </p>
      <div className="h-2 rounded-full bg-neutral-100 mb-3">
        <div
          className="h-2 rounded-full bg-primary-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm text-neutral-600">
        {complete} complete &middot; {needsWork} needs work
      </p>
    </div>
  );
}
