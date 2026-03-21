import type { StarStory } from "@/types/interview";
import { computeQualityScore } from "@/app/(app)/interviews/star-method/lib/storyUtils";
import { getCoveredCompetencies } from "@/app/(app)/interviews/star-method/lib/questionMap";

const TOTAL_COMPETENCIES = 10;
const TARGET_STORIES = 8;

interface Props {
  stories: StarStory[];
}

export function ReadinessScore({ stories }: Props) {
  const coveredCount = getCoveredCompetencies(stories).size;
  const competencyCoverage = coveredCount / TOTAL_COMPETENCIES;
  const storyCount = Math.min(stories.length, TARGET_STORIES) / TARGET_STORIES;
  const avgQuality =
    stories.length > 0
      ? stories.reduce((sum, s) => sum + computeQualityScore(s), 0) /
        stories.length /
        100
      : 0;

  const score = Math.round(
    competencyCoverage * 40 + storyCount * 30 + avgQuality * 30
  );

  const scoreColor =
    score >= 80
      ? "text-success"
      : score >= 50
        ? "text-warning"
        : "text-error";

  const barColor =
    score >= 80
      ? "bg-success"
      : score >= 50
        ? "bg-warning"
        : "bg-error";

  return (
    <div className="text-center">
      <p className={`text-4xl font-bold ${scoreColor}`}>{score}</p>
      <p className="text-sm text-neutral-600 mt-1 mb-3">Interview Readiness</p>
      <div className="h-2 rounded-full bg-neutral-100 max-w-xs mx-auto">
        <div
          className={`h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
