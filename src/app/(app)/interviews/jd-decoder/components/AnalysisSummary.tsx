"use client";

import { CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";
import type { JDAnalysis } from "../types";

interface AnalysisSummaryProps {
  analysis: JDAnalysis;
}

export function AnalysisSummary({ analysis }: AnalysisSummaryProps) {
  const matchCount = analysis.storyMatches.length;
  const gapCount = analysis.gaps.length;
  const questionCount = analysis.mockQuestions.length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-neutral-800">
          {analysis.jobTitle}
          {analysis.company && (
            <span className="font-normal text-neutral-500"> at {analysis.company}</span>
          )}
        </h2>
        <p className="mt-2 text-sm text-neutral-600">{analysis.summary}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
          <CheckCircle className="mx-auto h-5 w-5 text-green-600 mb-1" />
          <div className="text-2xl font-bold text-green-700">{matchCount}</div>
          <div className="text-xs text-green-600">Stories Matched</div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <AlertTriangle className="mx-auto h-5 w-5 text-amber-600 mb-1" />
          <div className="text-2xl font-bold text-amber-700">{gapCount}</div>
          <div className="text-xs text-amber-600">Gaps to Fill</div>
        </div>
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-center">
          <HelpCircle className="mx-auto h-5 w-5 text-primary-600 mb-1" />
          <div className="text-2xl font-bold text-primary-700">{questionCount}</div>
          <div className="text-xs text-primary-600">Mock Questions</div>
        </div>
      </div>
    </div>
  );
}
