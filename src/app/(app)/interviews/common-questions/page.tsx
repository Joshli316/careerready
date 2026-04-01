"use client";

import { useState, useEffect, useCallback } from "react";
import { useStorage } from "@/hooks/useStorage";
import { useSaveIndicator } from "@/hooks/useSaveIndicator";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { InterviewResponse, InterviewPrep } from "@/types/interview";
import en from "@/lib/i18n/en.json";
import zh from "@/lib/i18n/zh.json";

const QUESTION_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"] as const;

export default function CommonQuestionsPage() {
  const { t, language } = useLanguage();
  const translations = language === "zh" ? zh : en;
  const QUESTIONS = QUESTION_KEYS.map((key) => ({
    question: translations.interviews.commonQuestions.questions[key].question,
    tips: translations.interviews.commonQuestions.questions[key].tips,
  }));
  const storage = useStorage();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const { saved, showSaved } = useSaveIndicator();
  const { toast } = useToast();
  const [powerStatement, setPowerStatement] = useState("");

  useEffect(() => {
    storage.getInterviewPrep().then((prep) => {
      if (prep?.commonResponses?.length) {
        const map: Record<string, string> = {};
        prep.commonResponses.forEach((r) => { map[r.question] = r.answer; });
        setResponses(map);
      }
    });
    storage.getProfile().then((profile) => {
      if (profile?.powerStatement) setPowerStatement(profile.powerStatement);
    });
  }, [storage]);

  const save = useCallback(async () => {
    try {
      const prep = (await storage.getInterviewPrep()) ?? {
        commonResponses: [],
        starStories: [],
        companyResearch: [],
        thankYouNotes: [],
      };
      const commonResponses: InterviewResponse[] = Object.entries(responses)
        .filter(([_, answer]) => answer.trim())
        .map(([question, answer]) => ({ question, answer, category: "common" }));
      await storage.setInterviewPrep({ ...prep, commonResponses });
      showSaved();
      toast("Saved successfully", "success");
    } catch {
      toast("Failed to save. Please try again.", "error");
    }
  }, [storage, responses, showSaved, toast]);

  const answeredCount = Object.values(responses).filter((v) => v.trim()).length;

  return (
    <div>
      <Breadcrumb href="/interviews" label={t("interviews.title")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("interviews.commonQuestions.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("interviews.commonQuestions.description")}
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-success">
            <CheckCircle className="h-4 w-4" />
            {t("common.saved")}
          </div>
        )}
      </div>

      <Callout type="tip" className="mb-6">
        {t("interviews.commonQuestions.generalTips")}
      </Callout>

      {powerStatement ? (
        <div className="mb-6 rounded-lg border border-primary-100 bg-primary-50 p-4">
          <div className="mb-1 text-xs font-medium text-primary-600">{t("interviews.commonQuestions.powerStatementRef")}</div>
          <p className="text-sm text-primary-800 italic">&ldquo;{powerStatement}&rdquo;</p>
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm text-neutral-600">
            {t("interviews.commonQuestions.powerStatementPrompt").split("Power Statement").map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>{part}<a href="/know-yourself/power-statement" className="font-medium text-primary-600 underline hover:text-primary-700">Power Statement</a></span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        </div>
      )}

      <div className="mb-4 text-sm text-neutral-500">
        {t("interviews.commonQuestions.answeredCount")
          .replace("{answered}", String(answeredCount))
          .replace("{total}", String(QUESTIONS.length))}
      </div>

      <div className="space-y-3">
        {QUESTIONS.map((q, i) => {
          const isExpanded = expandedIndex === i;
          const hasAnswer = responses[q.question]?.trim();
          return (
            <div key={i} className="rounded-xl border border-neutral-150 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    hasAnswer ? "bg-success text-white" : "bg-neutral-100 text-neutral-500"
                  }`}>
                    {hasAnswer ? "✓" : i + 1}
                  </div>
                  <span className="font-medium text-neutral-800">{q.question}</span>
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
              </button>
              {isExpanded && (
                <div className="border-t border-neutral-100 p-4">
                  <div className="mb-3 rounded-lg bg-neutral-50 p-3">
                    <div className="mb-1 text-xs font-medium text-neutral-500">{t("interviews.commonQuestions.tipsLabel")}</div>
                    <ul className="space-y-1">
                      {q.tips.map((tip, j) => (
                        <li key={j} className="flex gap-2 text-sm text-neutral-600">
                          <span className="text-primary-400 shrink-0">&#10003;</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Textarea
                    placeholder={t("interviews.commonQuestions.responsePlaceholder")}
                    value={responses[q.question] ?? ""}
                    onChange={(e) => setResponses({ ...responses, [q.question]: e.target.value })}
                    rows={4}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={save} size="lg">{t("interviews.commonQuestions.saveResponses")}</Button>
      </div>
    </div>
  );
}
