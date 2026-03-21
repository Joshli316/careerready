"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { StarStory } from "@/types/interview";
import { useStorage } from "@/hooks/useStorage";
import { hydrateStory } from "@/app/(app)/interviews/star-method/lib/storyUtils";
import { ReadinessScore } from "./ReadinessScore";
import { CompetencyHeatmap } from "./CompetencyHeatmap";
import { StoryProgress } from "./StoryProgress";

export function ReadinessDashboard() {
  const storage = useStorage();
  const [stories, setStories] = useState<StarStory[] | null>(null);

  useEffect(() => {
    storage.getInterviewPrep().then((prep) => {
      if (prep?.starStories) {
        setStories(prep.starStories.map(hydrateStory));
      } else {
        setStories([]);
      }
    });
  }, [storage]);

  if (stories === null) {
    return null;
  }

  return (
    <div className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm mb-8">
      <h2 className="text-lg font-semibold mb-4">Interview Readiness</h2>

      {stories.length === 0 ? (
        <div className="rounded-lg border border-neutral-150 p-4 text-sm text-neutral-600">
          Build your first STAR story to see your interview readiness dashboard.{" "}
          <Link
            href="/interviews/star-method"
            className="text-primary-600 underline hover:text-primary-700"
          >
            Get started
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <ReadinessScore stories={stories} />
          <div className="grid sm:grid-cols-2 gap-6">
            <CompetencyHeatmap stories={stories} />
            <StoryProgress stories={stories} />
          </div>
        </div>
      )}
    </div>
  );
}
