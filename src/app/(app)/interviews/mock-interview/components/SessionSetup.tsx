"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import en from "@/lib/i18n/en.json";
import zh from "@/lib/i18n/zh.json";
import type { JDAnalysis } from "../../jd-decoder/types";
import type { MockInterviewQuestion } from "../types";

interface SessionSetupProps {
  jdAnalyses: JDAnalysis[];
  onStart: (questions: MockInterviewQuestion[], jobContext: string, sourceLabel: string, sourceType: "jd_analysis" | "generic") => void;
}

export function SessionSetup({ jdAnalyses, onStart }: SessionSetupProps) {
  const { t, language } = useLanguage();
  const translations = language === "zh" ? zh : en;
  const gq = translations.interviews.mockInterview.genericQuestions;
  const [selectedJD, setSelectedJD] = useState<string | null>(null);

  const GENERIC_QUESTIONS: MockInterviewQuestion[] = [
    { question: gq.q1, type: "behavioral", talkingPoints: gq.q1Tips },
    { question: gq.q2, type: "culture_fit", talkingPoints: gq.q2Tips },
    { question: gq.q3, type: "behavioral", talkingPoints: gq.q3Tips },
    { question: gq.q4, type: "behavioral", talkingPoints: gq.q4Tips },
    { question: gq.q5, type: "situational", talkingPoints: gq.q5Tips },
    { question: gq.q6, type: "behavioral", talkingPoints: gq.q6Tips },
  ];

  function startGeneric() {
    onStart(GENERIC_QUESTIONS, t("interviews.mockInterview.entryLevel"), t("interviews.mockInterview.genericLabel"), "generic");
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
        <h3 className="font-semibold text-neutral-800">{t("interviews.mockInterview.quickPractice")}</h3>
        <p className="mt-1 text-sm text-neutral-500">
          {t("interviews.mockInterview.quickPracticeDesc")}
        </p>
        <Button className="mt-3" onClick={startGeneric}>
          {t("interviews.mockInterview.startQuickPractice")}
        </Button>
      </div>

      {jdAnalyses.length > 0 && (
        <div className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-neutral-800">{t("interviews.mockInterview.specificJob")}</h3>
          <p className="mt-1 text-sm text-neutral-500">
            {t("interviews.mockInterview.specificJobDesc")}
          </p>
          <div className="mt-3 space-y-2">
            {jdAnalyses.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedJD(a.id === selectedJD ? null : a.id)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                  selectedJD === a.id
                    ? "border-primary-400 bg-primary-50 text-primary-700"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                }`}
              >
                <span className="font-medium">{a.jobTitle || t("common.untitled")}</span>
                {a.company && <span className="text-neutral-500"> — {a.company}</span>}
                <span className="ml-2 text-xs text-neutral-400">
                  {a.mockQuestions.length} {t("common.questionsAbbr")}
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
              {t("interviews.mockInterview.startJobSpecific")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
