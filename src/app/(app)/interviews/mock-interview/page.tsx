"use client";

import { useState, useEffect, useCallback } from "react";
import { useStorage } from "@/hooks/useStorage";
import { useToast } from "@/components/ui/Toast";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { nanoid } from "nanoid";
import type { JDAnalysis } from "../jd-decoder/types";
import type { MockInterviewQuestion, MockInterviewExchange, MockInterviewSession } from "./types";
import { SessionSetup } from "./components/SessionSetup";
import { InterviewExchange } from "./components/InterviewExchange";
import { FeedbackCard } from "./components/FeedbackCard";
import { SessionSummary } from "./components/SessionSummary";
import { PastSessions } from "./components/PastSessions";

type Phase = "setup" | "answering" | "feedback" | "summary" | "review";

interface SummaryData {
  overall: string;
  strengths: string[];
  improvements: string[];
  confidenceRating: number;
  confidenceNote: string;
}

export default function MockInterviewPage() {
  const storage = useStorage();
  const { toast } = useToast();
  const [jdAnalyses, setJDAnalyses] = useState<JDAnalysis[]>([]);
  const [savedSessions, setSavedSessions] = useState<MockInterviewSession[]>([]);
  const [phase, setPhase] = useState<Phase>("setup");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<MockInterviewQuestion[]>([]);
  const [exchanges, setExchanges] = useState<MockInterviewExchange[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobContext, setJobContext] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [sourceType, setSourceType] = useState<"jd_analysis" | "generic">("generic");
  const [sessionId, setSessionId] = useState("");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [activeSession, setActiveSession] = useState<MockInterviewSession | null>(null);

  useEffect(() => {
    storage.getJDAnalyses().then(setJDAnalyses);
    storage.getMockSessions().then(setSavedSessions);
  }, [storage]);

  const handleStart = useCallback(
    (qs: MockInterviewQuestion[], ctx: string, label: string, type: "jd_analysis" | "generic") => {
      setQuestions(qs); setJobContext(ctx); setSourceLabel(label); setSourceType(type);
      setExchanges([]); setCurrentIndex(0); setSessionId(nanoid());
      setSummaryData(null); setActiveSession(null); setPhase("answering");
    }, []
  );

  const handleSubmitAnswer = useCallback(async (answer: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/coach-response", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questions[currentIndex].question, answer, jobContext }),
      });
      if (!res.ok) {
        const errData = (await res.json()) as { error?: string };
        toast(errData.error || "Failed to get feedback.", "error");
        return;
      }
      const { result } = (await res.json()) as { result: string };
      const exchange: MockInterviewExchange = {
        question: questions[currentIndex].question, type: questions[currentIndex].type,
        answer, feedback: result,
      };
      setExchanges((prev) => [...prev, exchange]);
      setPhase("feedback");
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally { setLoading(false); }
  }, [questions, currentIndex, jobContext, toast]);

  const handleFinish = useCallback(async () => {
    setPhase("summary"); setLoading(true);
    const session: MockInterviewSession = {
      id: sessionId, createdAt: new Date().toISOString(), sourceType, sourceLabel,
      jobContext, exchanges, summary: null, completed: true,
    };
    setActiveSession(session);
    try {
      const res = await fetch("/api/ai/mock-summary", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobContext, exchanges }),
      });
      if (res.ok) {
        const { result } = (await res.json()) as { result: SummaryData };
        setSummaryData(result);
        session.summary = result.overall;
      } else {
        toast("Summary not available. Your answers are still saved.", "warning");
      }
    } catch {
      toast("Summary not available. Your answers are still saved.", "warning");
    }
    await storage.saveMockSession(session);
    setSavedSessions((prev) => [...prev, session]);
    setLoading(false);
  }, [sessionId, sourceType, sourceLabel, jobContext, exchanges, storage, toast]);

  const handleNewSession = useCallback(() => {
    setPhase("setup"); setQuestions([]); setExchanges([]);
    setCurrentIndex(0); setSummaryData(null); setActiveSession(null);
  }, []);

  const handleDeleteSession = useCallback(async (id: string) => {
    await storage.deleteMockSession(id);
    setSavedSessions((prev) => prev.filter((s) => s.id !== id));
    toast("Session deleted");
  }, [storage, toast]);

  return (
    <div>
      <Breadcrumb href="/interviews" label="Interviews" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">AI Mock Interview</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Pick a question set, answer each one, and get feedback before moving on.
        </p>
      </div>

      {phase === "setup" && (
        <div className="space-y-6">
          <PastSessions sessions={savedSessions} onSelect={(s) => { setActiveSession(s); setPhase("review"); }} onDelete={handleDeleteSession} />
          <SessionSetup jdAnalyses={jdAnalyses} onStart={handleStart} />
        </div>
      )}

      {phase === "answering" && questions[currentIndex] && (
        <InterviewExchange questionIndex={currentIndex} totalQuestions={questions.length}
          question={questions[currentIndex]} onSubmit={handleSubmitAnswer} loading={loading} />
      )}

      {phase === "feedback" && exchanges[exchanges.length - 1] && (
        <FeedbackCard exchange={exchanges[exchanges.length - 1]} questionIndex={currentIndex}
          totalQuestions={questions.length} isLast={currentIndex >= questions.length - 1}
          onNext={() => { setCurrentIndex((p) => p + 1); setPhase("answering"); }} onFinish={handleFinish} />
      )}

      {phase === "summary" && activeSession && (
        <SessionSummary session={activeSession} summaryData={summaryData} loading={loading} onNewSession={handleNewSession} />
      )}

      {phase === "review" && activeSession && (
        <SessionSummary session={activeSession} summaryData={null} loading={false} onNewSession={handleNewSession} />
      )}
    </div>
  );
}
