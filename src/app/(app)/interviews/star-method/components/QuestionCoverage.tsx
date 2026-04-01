"use client";

import { cn } from "@/lib/utils/cn";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  BEHAVIORAL_QUESTIONS,
  getCoveredCompetencies,
  getUncoveredQuestions,
} from "../lib/questionMap";
import type { StarStory, Competency } from "@/types/interview";

interface QuestionCoverageProps {
  stories: StarStory[];
}

function SkillBadge({ skill, covered }: { skill: Competency; covered: boolean }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
        covered
          ? "bg-success/10 text-success"
          : "bg-neutral-100 text-neutral-500"
      )}
    >
      {skill}
    </span>
  );
}

export function QuestionCoverage({ stories }: QuestionCoverageProps) {
  const { t } = useLanguage();
  const coveredCompetencies = getCoveredCompetencies(stories);
  const uncoveredQuestions = getUncoveredQuestions(stories);
  const coveredQuestions = BEHAVIORAL_QUESTIONS.filter((q) =>
    q.skills.some((skill) => coveredCompetencies.has(skill))
  );

  return (
    <div className="space-y-6">
      {/* Covered Questions */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-700">
          {t("interviews.starMethod.coveredQuestions")}{" "}
          <span className="font-normal text-neutral-400">
            ({coveredQuestions.length})
          </span>
        </h3>
        {coveredQuestions.length === 0 ? (
          <p className="text-sm text-neutral-400 italic">
            {t("interviews.starMethod.noCoveredQuestions")}
          </p>
        ) : (
          <ul className="space-y-2">
            {coveredQuestions.map((item) => (
              <li
                key={item.question}
                className="rounded-lg border border-success/20 bg-success/5 px-4 py-3"
              >
                <p className="text-sm text-neutral-700">{item.question}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {item.skills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} covered />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Uncovered Questions */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-700">
          {t("interviews.starMethod.uncoveredQuestions")}{" "}
          <span className="font-normal text-neutral-400">
            ({uncoveredQuestions.length})
          </span>
        </h3>
        {uncoveredQuestions.length === 0 ? (
          <p className="text-sm text-neutral-400 italic">
            {t("interviews.starMethod.allQuestionsCovered")}
          </p>
        ) : (
          <ul className="space-y-2">
            {uncoveredQuestions.map((item) => (
              <li
                key={item.question}
                className="rounded-lg border border-neutral-150 bg-neutral-50 px-4 py-3"
              >
                <p className="text-sm text-neutral-600">{item.question}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {item.skills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} covered={false} />
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-neutral-400">
                  {t("interviews.starMethod.addStoryForCoverage")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
