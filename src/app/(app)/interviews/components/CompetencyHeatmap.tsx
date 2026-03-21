import type { StarStory } from "@/types/interview";
import { COMPETENCIES } from "@/types/interview";

interface Props {
  stories: StarStory[];
}

export function CompetencyHeatmap({ stories }: Props) {
  function countForCompetency(competency: (typeof COMPETENCIES)[number]): number {
    return stories.filter(
      (s) => s.primarySkill === competency || s.secondarySkill === competency
    ).length;
  }

  return (
    <div>
      <p className="text-sm font-medium text-neutral-600 mb-3">Competency Coverage</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {COMPETENCIES.map((competency) => {
          const count = countForCompetency(competency);
          const colorClass =
            count === 0
              ? "bg-neutral-100 text-neutral-400"
              : count === 1
                ? "bg-warning/10 text-warning border border-warning/30"
                : "bg-success/10 text-success border border-success/30";

          return (
            <div
              key={competency}
              className={`rounded-lg p-3 text-center ${colorClass}`}
            >
              <p className="text-xs leading-tight">{competency}</p>
              <p className="text-lg font-bold mt-1">{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
