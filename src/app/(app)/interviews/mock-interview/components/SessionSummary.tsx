"use client";

import { Button } from "@/components/ui/Button";
import type { MockInterviewSession } from "../types";

interface SessionSummaryProps {
  session: MockInterviewSession;
  summaryData: {
    overall: string;
    strengths: string[];
    improvements: string[];
    confidenceRating: number;
    confidenceNote: string;
  } | null;
  loading: boolean;
  onNewSession: () => void;
}

export function SessionSummary({ session, summaryData, loading, onNewSession }: SessionSummaryProps) {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-48 rounded bg-neutral-200" />
        <div className="h-32 rounded-xl bg-neutral-100" />
        <div className="h-24 rounded-xl bg-neutral-100" />
        <p className="text-center text-sm text-neutral-500">Reviewing your full interview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">How You Did</h3>
          <span className="text-sm text-neutral-500">
            {session.exchanges.length} answers reviewed
          </span>
        </div>

        {summaryData ? (
          <div className="space-y-5">
            <p className="text-sm text-neutral-700">{summaryData.overall}</p>

            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50">
                <span className="text-xl font-bold text-primary-700">
                  {summaryData.confidenceRating}<span className="text-xs font-normal text-primary-500">/10</span>
                </span>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Interview Readiness</p>
                <p className="text-sm text-neutral-600">{summaryData.confidenceNote}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h4 className="text-xs font-medium uppercase text-green-700 mb-2">What Went Well</h4>
                <ul className="space-y-1">
                  {summaryData.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-green-800 list-disc ml-4">{s}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <h4 className="text-xs font-medium uppercase text-amber-700 mb-2">Work On Next</h4>
                <ul className="space-y-1">
                  {summaryData.improvements.map((s, i) => (
                    <li key={i} className="text-sm text-amber-800 list-disc ml-4">{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">{session.summary || "Summary not available for this session."}</p>
        )}
      </div>

      {/* Exchange review */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-neutral-800">Your Answers</h3>
        <div className="space-y-3">
          {session.exchanges.map((ex, i) => (
            <div key={i} className="rounded-xl border border-neutral-150 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-neutral-500 mb-1">Q{i + 1}</p>
              <p className="text-sm font-medium text-neutral-800 mb-2">{ex.question}</p>
              <p className="text-sm text-neutral-600 mb-2 whitespace-pre-wrap">{ex.answer}</p>
              <div className="rounded-lg bg-primary-50 p-3">
                <p className="text-sm text-neutral-700 whitespace-pre-wrap">{ex.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={onNewSession}>Practice Again</Button>
      </div>
    </div>
  );
}
