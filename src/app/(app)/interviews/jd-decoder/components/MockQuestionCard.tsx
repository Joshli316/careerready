"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { MockQuestion } from "../types";

interface MockQuestionCardProps {
  question: MockQuestion;
  index: number;
}

const typeBadgeStyles: Record<MockQuestion["type"], string> = {
  behavioral: "bg-blue-50 text-blue-700",
  situational: "bg-purple-50 text-purple-700",
  technical: "bg-emerald-50 text-emerald-700",
  culture_fit: "bg-orange-50 text-orange-700",
};

const typeLabels: Record<MockQuestion["type"], string> = {
  behavioral: "Behavioral",
  situational: "Situational",
  technical: "Technical",
  culture_fit: "Culture Fit",
};

export function MockQuestionCard({ question, index }: MockQuestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-neutral-150 bg-white p-4 shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 text-left"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-600">
          {index + 1}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`rounded px-2 py-0.5 text-xs font-medium ${typeBadgeStyles[question.type]}`}>
              {typeLabels[question.type]}
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
            <h4 className="text-xs font-medium text-neutral-500 uppercase">Talking Points</h4>
            <ul className="mt-1 space-y-1">
              {question.talkingPoints.map((tp, i) => (
                <li key={i} className="text-sm text-neutral-600 list-disc ml-4">{tp}</li>
              ))}
            </ul>
          </div>
          {question.suggestedStoryIds.length > 0 && (
            <p className="text-xs text-neutral-500">
              Use stories: {question.suggestedStoryIds.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
