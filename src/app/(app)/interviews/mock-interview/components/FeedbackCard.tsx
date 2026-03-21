"use client";

import { Button } from "@/components/ui/Button";
import type { MockInterviewExchange } from "../types";

interface FeedbackCardProps {
  exchange: MockInterviewExchange;
  questionIndex: number;
  totalQuestions: number;
  isLast: boolean;
  onNext: () => void;
  onFinish: () => void;
}

export function FeedbackCard({
  exchange,
  questionIndex,
  totalQuestions,
  isLast,
  onNext,
  onFinish,
}: FeedbackCardProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-neutral-500">
          Question {questionIndex + 1} of {totalQuestions}
        </p>
        <p className="mt-1 text-neutral-800">{exchange.question}</p>
      </div>

      <div className="rounded-xl border border-neutral-150 bg-neutral-50 p-6">
        <p className="text-xs font-medium uppercase text-neutral-500 mb-2">Your Answer</p>
        <p className="text-sm text-neutral-700 whitespace-pre-wrap">{exchange.answer}</p>
      </div>

      <div className="rounded-xl border border-primary-200 bg-primary-50 p-6">
        <p className="text-xs font-medium uppercase text-primary-600 mb-2">AI Feedback</p>
        <p className="text-sm text-neutral-700 whitespace-pre-wrap">{exchange.feedback}</p>
      </div>

      <div className="flex justify-end gap-3">
        {isLast ? (
          <Button variant="ai" onClick={onFinish}>
            Finish Interview
          </Button>
        ) : (
          <Button onClick={onNext}>Next</Button>
        )}
      </div>
    </div>
  );
}
