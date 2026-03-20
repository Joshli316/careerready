"use client";

import { useState, useEffect, useCallback } from "react";
import { useStorage } from "@/hooks/useStorage";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { InterviewResponse, InterviewPrep } from "@/types/interview";

const QUESTIONS: Array<{ question: string; tips: string[] }> = [
  {
    question: "Tell me about yourself.",
    tips: [
      "Keep your response related to the job you are seeking.",
      "Use your power statement as a starting point.",
      "Highlight education, relevant experience, and key skills.",
    ],
  },
  {
    question: "Why are you the best person for this job?",
    tips: [
      "Match your qualifications to the job description.",
      "Describe specific skills and experience you bring.",
      "Use concrete examples to demonstrate your value.",
    ],
  },
  {
    question: "Why do you want to work here?",
    tips: [
      "Include information learned through researching the company.",
      "Convey enthusiasm about the company and the role.",
      "Show you understand the company's mission and values.",
    ],
  },
  {
    question: "What are your strengths?",
    tips: [
      "Identify 3 skills that qualify you for the job.",
      "Be genuine and strategic — choose strengths you can back up.",
      "Provide specific examples for each strength.",
    ],
  },
  {
    question: "What are your weaknesses?",
    tips: [
      "Choose a skill you've actively worked to improve.",
      "Describe the steps you've taken to improve.",
      "Don't mention weaknesses that would disqualify you.",
    ],
  },
  {
    question: "How would co-workers describe you?",
    tips: [
      "Share personality traits that match the job and culture.",
      "Focus on interpersonal skills and teamwork.",
    ],
  },
  {
    question: "Why did you leave your last job?",
    tips: [
      "Be honest, but don't criticize your last employer.",
      "Stay positive and focus on what you learned.",
      "Frame it as seeking growth or new opportunities.",
    ],
  },
  {
    question: "Where do you see yourself in five years?",
    tips: [
      "Mention career goals that align with the company.",
      "State that you see yourself advancing within the company.",
      "Show ambition while being realistic.",
    ],
  },
];

export default function CommonQuestionsPage() {
  const storage = useStorage();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [saved, setSaved] = useState(false);
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
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [storage, responses]);

  const answeredCount = Object.values(responses).filter((v) => v.trim()).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Common Interview Questions</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Prepare answers to the 8 most common interview questions.
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-success">
            <CheckCircle className="h-4 w-4" />
            Saved
          </div>
        )}
      </div>

      <Callout type="tip" className="mb-6">
        <strong>Every response should include these 4 points:</strong> (1) How your experience matches the job,
        (2) Use the employer's language with concrete examples, (3) A confident, positive answer,
        (4) Stay focused — don't overshare.
      </Callout>

      {powerStatement && (
        <div className="mb-6 rounded-lg border border-primary-100 bg-primary-50 p-4">
          <div className="mb-1 text-xs font-medium text-primary-600">Your Power Statement (reference for Q1)</div>
          <p className="text-sm text-primary-800 italic">"{powerStatement}"</p>
        </div>
      )}

      <div className="mb-4 text-sm text-neutral-500">
        {answeredCount} of {QUESTIONS.length} questions answered
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
                    <div className="mb-1 text-xs font-medium text-neutral-500">Tips for this question:</div>
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
                    placeholder="Write your response here..."
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
        <Button onClick={save} size="lg">Save All Responses</Button>
      </div>
    </div>
  );
}
