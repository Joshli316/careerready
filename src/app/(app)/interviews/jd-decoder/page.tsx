"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useStorage } from "@/hooks/useStorage";
import { useToast } from "@/components/ui/Toast";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { nanoid } from "nanoid";
import type { StarStory } from "@/types/interview";
import { hydrateStory } from "../star-method/lib/storyUtils";
import type { JDAnalysis } from "./types";
import { JDInputForm } from "./components/JDInputForm";
import { AnalysisLoading } from "./components/AnalysisLoading";
import { AnalysisSummary } from "./components/AnalysisSummary";
import { RequirementCard } from "./components/RequirementCard";
import { PrepChecklist } from "./components/PrepChecklist";
import { MockQuestionCard } from "./components/MockQuestionCard";

export default function JDDecoderPage() {
  const storage = useStorage();
  const { toast } = useToast();
  const [stories, setStories] = useState<StarStory[]>([]);
  const [savedAnalyses, setSavedAnalyses] = useState<JDAnalysis[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<JDAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    storage.getInterviewPrep().then((prep) => {
      if (prep?.starStories?.length) {
        setStories(prep.starStories.map(hydrateStory));
      }
    });
    storage.getJDAnalyses().then(setSavedAnalyses);
  }, [storage]);

  const handleDecode = useCallback(
    async (jdText: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/ai/decode-jd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription: jdText, stories }),
        });
        if (!res.ok) {
          const errData = (await res.json()) as { error?: string };
          toast(errData.error || "Analysis failed.", "error");
          return;
        }
        const { result } = (await res.json()) as {
          result: Omit<JDAnalysis, "id" | "createdAt" | "rawJD">;
        };
        const analysis: JDAnalysis = {
          id: nanoid(),
          createdAt: new Date().toISOString(),
          rawJD: jdText,
          jobTitle: result.jobTitle || "Untitled Role",
          company: result.company || "",
          summary: result.summary || "",
          requirements: Array.isArray(result.requirements) ? result.requirements : [],
          storyMatches: Array.isArray(result.storyMatches) ? result.storyMatches : [],
          gaps: Array.isArray(result.gaps) ? result.gaps : [],
          mockQuestions: Array.isArray(result.mockQuestions) ? result.mockQuestions : [],
          prepChecklist: (Array.isArray(result.prepChecklist) ? result.prepChecklist : []).map(
            (item) => ({ ...item, done: false })
          ),
        };
        await storage.saveJDAnalysis(analysis);
        setSavedAnalyses((prev) => [...prev, analysis]);
        setActiveAnalysis(analysis);
        toast("JD decoded successfully!", "success");
      } catch {
        toast("Something went wrong. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    },
    [storage, stories, toast]
  );

  const handleToggleChecklist = useCallback(
    async (itemId: string) => {
      if (!activeAnalysis) return;
      const updated: JDAnalysis = {
        ...activeAnalysis,
        prepChecklist: activeAnalysis.prepChecklist.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        ),
      };
      setActiveAnalysis(updated);
      setSavedAnalyses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      await storage.saveJDAnalysis(updated);
    },
    [activeAnalysis, storage]
  );

  const handleDeleteAnalysis = useCallback(
    async (id: string) => {
      await storage.deleteJDAnalysis(id);
      setSavedAnalyses((prev) => prev.filter((a) => a.id !== id));
      if (activeAnalysis?.id === id) setActiveAnalysis(null);
      toast("Analysis deleted");
    },
    [storage, activeAnalysis, toast]
  );

  const { matchedReqs, gapReqs, otherReqs } = useMemo(() => {
    if (!activeAnalysis) return { matchedReqs: [], gapReqs: [], otherReqs: [] };
    const matchedIds = new Set(activeAnalysis.storyMatches.map((m) => m.requirementId));
    const gapIds = new Set(activeAnalysis.gaps.map((g) => g.requirementId));
    return {
      matchedReqs: activeAnalysis.requirements.filter((r) => matchedIds.has(r.id)),
      gapReqs: activeAnalysis.requirements.filter((r) => gapIds.has(r.id)),
      otherReqs: activeAnalysis.requirements.filter(
        (r) => !matchedIds.has(r.id) && !gapIds.has(r.id)
      ),
    };
  }, [activeAnalysis]);

  return (
    <div>
      <Breadcrumb href="/interviews" label="Interviews" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">JD Decoder</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Paste a job posting. The AI pulls out what they want, checks which of your stories fit, and flags what&apos;s missing.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
        <JDInputForm
          savedAnalyses={savedAnalyses}
          onDecode={handleDecode}
          onSelectAnalysis={setActiveAnalysis}
          onDeleteAnalysis={handleDeleteAnalysis}
          loading={loading}
        />
      </div>

      {loading && (
        <div className="mt-6">
          <AnalysisLoading />
        </div>
      )}

      {!loading && activeAnalysis && (
        <div className="mt-6 space-y-8">
          <AnalysisSummary analysis={activeAnalysis} />

          <section aria-labelledby="req-heading">
            <h2 id="req-heading" className="mb-3 text-lg font-semibold text-neutral-800">Requirements</h2>
            <div className="space-y-3">
              {matchedReqs.map((req) => (
                <RequirementCard
                  key={req.id}
                  requirement={req}
                  match={activeAnalysis.storyMatches.find((m) => m.requirementId === req.id) ?? null}
                  gap={null}
                  stories={stories}
                />
              ))}
              {gapReqs.map((req) => (
                <RequirementCard
                  key={req.id}
                  requirement={req}
                  match={null}
                  gap={activeAnalysis.gaps.find((g) => g.requirementId === req.id) ?? null}
                  stories={stories}
                />
              ))}
              {otherReqs.map((req) => (
                <RequirementCard key={req.id} requirement={req} match={null} gap={null} stories={stories} />
              ))}
            </div>
          </section>

          {activeAnalysis.prepChecklist.length > 0 && (
            <section aria-labelledby="checklist-heading">
              <h2 id="checklist-heading" className="mb-3 text-lg font-semibold text-neutral-800">Prep Checklist</h2>
              <div className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
                <PrepChecklist items={activeAnalysis.prepChecklist} onToggle={handleToggleChecklist} />
              </div>
            </section>
          )}

          {activeAnalysis.mockQuestions.length > 0 && (
            <section aria-labelledby="mock-heading">
              <h2 id="mock-heading" className="mb-3 text-lg font-semibold text-neutral-800">Mock Interview Questions</h2>
              <div className="space-y-3">
                {activeAnalysis.mockQuestions.map((q, i) => (
                  <MockQuestionCard key={i} question={q} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
