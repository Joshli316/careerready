"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { QUESTION_TYPE_BADGE_STYLES, QUESTION_TYPE_LABELS } from "../../lib/questionConstants";
import type { MockQuestion } from "../types";

interface MockQuestionCardProps {
  question: MockQuestion;
  index: number;
}

export function MockQuestionCard({ question, index }: MockQuestionCardProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-neutral-150 bg-white p-4 shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-start gap-3 text-left"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-600">
          {index + 1}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`rounded px-2 py-0.5 text-xs font-medium ${QUESTION_TYPE_BADGE_STYLES[question.type] ?? "bg-neutral-100 text-neutral-600"}`}>
              {QUESTION_TYPE_LABELS[question.type] ?? question.type}
            </span>
          </div>
          <p className="text-sm font-medium text-neutral-800">{question.question}</p>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400 mt-1" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400 mt-1" />
        )}
      </button>
      {expanded && (
        <div className="mt-3 ml-9 space-y-2">
          <div>
            <h4 className="text-xs font-medium text-neutral-500 uppercase">{t("interviews.jdDecoder.talkingPoints")}</h4>
            <ul className="mt-1 space-y-1">
              {question.talkingPoints.map((tp, i) => (
                <li key={i} className="text-sm text-neutral-600 list-disc ml-4">{tp}</li>
              ))}
            </ul>
          </div>
          {question.suggestedStoryIds.length > 0 && (
            <p className="text-xs text-neutral-500">
              {t("interviews.jdDecoder.suggestedStories")} {question.suggestedStoryIds.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
