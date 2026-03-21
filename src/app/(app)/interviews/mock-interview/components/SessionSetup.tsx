"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { JDAnalysis } from "../../jd-decoder/types";
import type { MockInterviewQuestion } from "../types";

const GENERIC_QUESTIONS: MockInterviewQuestion[] = [
  { question: "Tell me about yourself.", type: "behavioral", talkingPoints: ["Keep it under 2 minutes", "Focus on relevant experience", "End with why you're excited about this role"] },
  { question: "Why are you interested in this position?", type: "culture_fit", talkingPoints: ["Show you've researched the company", "Connect your skills to the role", "Express genuine enthusiasm"] },
  { question: "Describe a time you faced a challenge at work or school. How did you handle it?", type: "behavioral", talkingPoints: ["Use STAR format", "Focus on your specific actions", "Quantify the result"] },
  { question: "What are your greatest strengths?", type: "behavioral", talkingPoints: ["Pick 2-3 relevant strengths", "Back each with a brief example", "Align with job requirements"] },
  { question: "Where do you see yourself in five years?", type: "situational", talkingPoints: ["Show ambition but be realistic", "Connect growth to the company", "Demonstrate long-term thinking"] },
  { question: "Tell me about a time you worked on a team.", type: "behavioral", talkingPoints: ["Highlight your specific contribution", "Show collaboration skills", "Mention the outcome"] },
];

interface SessionSetupProps {
  jdAnalyses: JDAnalysis[];
  onStart: (questions: MockInterviewQuestion[], jobContext: string, sourceLabel: string, sourceType: "jd_analysis" | "generic") => void;
}

export function SessionSetup({ jdAnalyses, onStart }: SessionSetupProps) {
  const [selectedJD, setSelectedJD] = useState<string | null>(null);

  function startGeneric() {
    onStart(GENERIC_QUESTIONS, "Entry-level position", "Generic Practice", "generic");
  }

  function startFromJD(analysis: JDAnalysis) {
    const questions: MockInterviewQuestion[] = analysis.mockQuestions.map((q) => ({
      question: q.question,
      type: q.type,
      talkingPoints: q.talkingPoints,
    }));
    if (questions.length === 0) {
      startGeneric();
      return;
    }
    onStart(
      questions,
      `${analysis.jobTitle}${analysis.company ? ` at ${analysis.company}` : ""}`,
      `${analysis.jobTitle}${analysis.company ? ` — ${analysis.company}` : ""}`,
      "jd_analysis"
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-neutral-800">General Practice</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Practice with 6 common interview questions suited for any role.
        </p>
        <Button className="mt-3" onClick={startGeneric}>
          Start Generic Practice
        </Button>
      </div>

      {jdAnalyses.length > 0 && (
        <div className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-neutral-800">Practice from a JD Analysis</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Use mock questions tailored to a specific job description you've decoded.
          </p>
          <div className="mt-3 space-y-2">
            {jdAnalyses.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedJD(a.id === selectedJD ? null : a.id)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  selectedJD === a.id
                    ? "border-primary-400 bg-primary-50 text-primary-700"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                }`}
              >
                <span className="font-medium">{a.jobTitle || "Untitled"}</span>
                {a.company && <span className="text-neutral-500"> — {a.company}</span>}
                <span className="ml-2 text-xs text-neutral-400">
                  {a.mockQuestions.length} questions
                </span>
              </button>
            ))}
          </div>
          {selectedJD && (
            <Button
              variant="ai"
              className="mt-3"
              onClick={() => {
                const analysis = jdAnalyses.find((a) => a.id === selectedJD);
                if (analysis) startFromJD(analysis);
              }}
            >
              Start JD Practice
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
