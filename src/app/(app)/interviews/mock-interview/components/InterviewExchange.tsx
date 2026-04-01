"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { QUESTION_TYPE_BADGE_STYLES, QUESTION_TYPE_LABELS } from "../../lib/questionConstants";
import type { MockInterviewQuestion } from "../types";

interface InterviewExchangeProps {
  questionIndex: number;
  totalQuestions: number;
  question: MockInterviewQuestion;
  onSubmit: (answer: string) => void;
  loading: boolean;
}

export function InterviewExchange({
  questionIndex,
  totalQuestions,
  question,
  onSubmit,
  loading,
}: InterviewExchangeProps) {
  const [answer, setAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-neutral-400">
          {t("interviews.mockInterview.questionOf").replace("{current}", String(questionIndex + 1)).replace("{total}", String(totalQuestions))}
        </span>
        <div className="h-1.5 flex-1 rounded-full bg-neutral-100" role="progressbar">
          <div
            className="h-1.5 rounded-full bg-primary-400 transition-all"
            style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${QUESTION_TYPE_BADGE_STYLES[question.type] ?? "bg-neutral-100 text-neutral-600"}`}>
            {QUESTION_TYPE_LABELS[question.type] ?? question.type}
          </span>
        </div>
        <p className="text-lg font-medium text-neutral-800">{question.question}</p>

        {question.talkingPoints.length > 0 && (
          <button
            onClick={() => setShowHints(!showHints)}
            aria-expanded={showHints}
            className="mt-3 flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700"
          >
            {showHints ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            {showHints ? t("interviews.mockInterview.hideTips") : t("interviews.mockInterview.showTips")}
          </button>
        )}
        {showHints && (
          <ul className="mt-2 ml-4 space-y-1">
            {question.talkingPoints.map((tp, i) => (
              <li key={i} className="text-xs text-neutral-500 list-disc">{tp}</li>
            ))}
          </ul>
        )}
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={t("interviews.mockInterview.answerPlaceholder")}
        rows={6}
        maxLength={5000}
        className="w-full min-h-[120px] rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 resize-y"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400">{answer.length.toLocaleString()} / 5,000</span>
        <Button
          variant="ai"
          onClick={() => onSubmit(answer)}
          disabled={loading || answer.trim().length < 10}
        >
          {loading ? t("interviews.mockInterview.reviewing") : t("interviews.mockInterview.submit")}
        </Button>
      </div>
    </div>
  );
}
