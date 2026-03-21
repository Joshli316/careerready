"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, PenLine } from "lucide-react";
import type { JDRequirement, StoryMatch, GapItem } from "../types";
import type { StarStory } from "@/types/interview";

interface RequirementCardProps {
  requirement: JDRequirement;
  match: StoryMatch | null;
  gap: GapItem | null;
  stories: StarStory[];
}

export function RequirementCard({ requirement, match, gap, stories }: RequirementCardProps) {
  const [expanded, setExpanded] = useState(false);
  const matchedStory = match ? stories.find((s) => s.id === match.storyId) : null;

  return (
    <div className="rounded-xl border border-neutral-150 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                requirement.importance === "must_have"
                  ? "bg-red-50 text-red-700"
                  : "bg-neutral-100 text-neutral-500"
              }`}
            >
              {requirement.importance === "must_have" ? "Must Have" : "Nice to Have"}
            </span>
            <span className="inline-block rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
              {requirement.category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
            {requirement.competency && (
              <span className="inline-block rounded bg-primary-50 px-2 py-0.5 text-xs text-primary-600">
                {requirement.competency}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-neutral-700">{requirement.description}</p>
        </div>
        {match && (
          <div className="flex shrink-0 items-center gap-1" aria-label={`Relevance: ${match.relevanceScore} of 5`}>
            {[1, 2, 3, 4, 5].map((dot) => (
              <div
                key={dot}
                className={`h-2 w-2 rounded-full ${
                  dot <= match.relevanceScore ? "bg-primary-400" : "bg-neutral-200"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {match && matchedStory && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            Matched: {matchedStory.question || `Story ${matchedStory.id.slice(0, 6)}`}
          </button>
          {expanded && (
            <ul className="mt-2 ml-5 space-y-1">
              {match.talkingPoints.map((tp, i) => (
                <li key={i} className="text-sm text-neutral-600 list-disc">{tp}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {gap && (
        <div className="mt-3 rounded-lg bg-amber-50 p-3">
          <p className="text-sm text-amber-800">{gap.suggestion}</p>
          <Link
            href={`/interviews/star-method?newStory=true&question=${encodeURIComponent(gap.suggestedQuestion)}`}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <PenLine className="h-3.5 w-3.5" />
            Draft Story
          </Link>
        </div>
      )}
    </div>
  );
}
