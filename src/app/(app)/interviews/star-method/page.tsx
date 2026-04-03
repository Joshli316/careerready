"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useStorage } from "@/hooks/useStorage";
import { useSaveIndicator } from "@/hooks/useSaveIndicator";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { TabStrip } from "@/components/ui/TabStrip";
import { NextStepLink } from "@/components/ui/NextStepLink";
import { CheckCircle, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import type { StarStory } from "@/types/interview";
import { hydrateStory, computeQualityScore, isStoryComplete } from "./lib/storyUtils";
import { StoryForm } from "./components/StoryForm";
import { StoryMeta } from "./components/StoryMeta";
import { StoryQualityBadge } from "./components/StoryQualityBadge";
import { QuestionCoverage } from "./components/QuestionCoverage";

const SAMPLE_QUESTION_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

const emptyStory = (): StarStory => ({
  id: nanoid(),
  question: "",
  situation: "",
  task: "",
  action: "",
  result: "",
  tags: [],
  strength: 0,
  earnedSecret: "",
  primarySkill: "",
  secondarySkill: "",
  deployFor: "",
  useCount: 0,
});

export default function StarMethodPage() {
  const { t } = useLanguage();
  const storage = useStorage();
  const searchParams = useSearchParams();
  const SAMPLE_QUESTIONS = SAMPLE_QUESTION_KEYS.map((key) => t(`interviews.starMethod.sampleQuestions.${key}`));
  const [stories, setStories] = useState<StarStory[]>([emptyStory()]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const { saved, showSaved } = useSaveIndicator();
  const { toast } = useToast();
  const deepLinkHandled = useRef(false);

  useEffect(() => {
    storage.getInterviewPrep()
      .then((prep) => {
        if (prep?.starStories?.length) {
          setStories(prep.starStories.map(hydrateStory));
        }
      })
      .catch(() => toast(t("common.error"), "error"));
  }, [storage, toast, t]);

  const pendingSaveRef = useRef(false);

  // Handle "Draft Story" deep link from JD Decoder
  useEffect(() => {
    if (deepLinkHandled.current) return;
    const isNew = searchParams.get("newStory");
    const question = searchParams.get("question");
    if (isNew === "true" && question) {
      deepLinkHandled.current = true;
      const newStory = { ...emptyStory(), question };
      setStories((prev) => {
        const updated = [...prev, newStory];
        setActiveIndex(updated.length - 1);
        return updated;
      });
      pendingSaveRef.current = true;
      toast(t("interviews.starMethod.storyAdded"), "success");
    }
  }, [searchParams, toast]);

  const save = useCallback(async () => {
    try {
      const prep = (await storage.getInterviewPrep()) ?? {
        commonResponses: [],
        starStories: [],
        companyResearch: [],
        thankYouNotes: [],
      };
      await storage.setInterviewPrep({ ...prep, starStories: stories });
      showSaved();
      toast(t("common.savedSuccessfully"), "success");
    } catch {
      toast(t("common.saveFailed"), "error");
    }
  }, [storage, stories, showSaved, toast, t]);

  // Auto-save after deep-link story is added to state
  useEffect(() => {
    if (pendingSaveRef.current && stories.length > 0) {
      pendingSaveRef.current = false;
      save();
    }
  }, [stories, save]);

  function updateStory(field: keyof StarStory, value: string | number) {
    const updated = [...stories];
    updated[activeIndex] = { ...updated[activeIndex], [field]: value };
    setStories(updated);
  }

  function addStory() {
    const newStory = emptyStory();
    setStories([...stories, newStory]);
    setActiveIndex(stories.length);
  }

  function deleteStory(index: number) {
    if (stories.length <= 1) return;
    const updated = stories.filter((_, i) => i !== index);
    setStories(updated);
    setActiveIndex(Math.min(activeIndex, updated.length - 1));
    toast(t("interviews.starMethod.storyDeleted"));
  }

  const story = stories[activeIndex];
  const completeCount = stories.filter(isStoryComplete).length;

  return (
    <div>
      <Breadcrumb href="/interviews" label={t("interviews.title")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("interviews.starMethod.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("interviews.starMethod.description")}
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-success">
            <CheckCircle className="h-4 w-4" />
            {t("common.saved")}
          </div>
        )}
      </div>

      {/* STAR explanation */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { letter: "S", label: t("interviews.starMethod.situation"), desc: t("interviews.starMethod.situationDesc") },
          { letter: "T", label: t("interviews.starMethod.task"), desc: t("interviews.starMethod.taskDesc") },
          { letter: "A", label: t("interviews.starMethod.action"), desc: t("interviews.starMethod.actionDesc") },
          { letter: "R", label: t("interviews.starMethod.result"), desc: t("interviews.starMethod.resultDesc") },
        ].map((item) => (
          <div key={item.letter} className="rounded-lg border border-primary-200 bg-primary-50 p-2 sm:p-3 text-center">
            <div className="text-2xl font-bold text-primary-400">{item.letter}</div>
            <div className="text-xs font-medium text-primary-700">{item.label}</div>
            <div className="mt-1 text-xs text-primary-600 hidden sm:block">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Story tabs */}
      <TabStrip
        tabs={stories.map((s, i) => ({
          id: s.id,
          label: (
            <>
              <span>{t("interviews.starMethod.storyN").replace("{n}", String(i + 1))}</span>{" "}
              <StoryQualityBadge score={computeQualityScore(s)} />
            </>
          ),
        }))}
        activeId={stories[activeIndex]?.id ?? ""}
        onSelect={(id) => {
          const idx = stories.findIndex((s) => s.id === id);
          if (idx >= 0) setActiveIndex(idx);
        }}
        onAdd={addStory}
      />

      {/* Active story form */}
      {story && (
        <div className="space-y-4 rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
          <StoryForm story={story} onUpdate={updateStory} sampleQuestions={SAMPLE_QUESTIONS} />
          <StoryMeta story={story} onUpdate={updateStory} />

          <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
            {stories.length > 1 && (
              <button
                onClick={() => setDeleteIndex(activeIndex)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-error hover:text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                {t("interviews.starMethod.deleteStory")}
              </button>
            )}
            <div className="ml-auto">
              <Button onClick={save}>{t("interviews.starMethod.saveStories")}</Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <QuestionCoverage stories={stories} />
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-lg bg-neutral-50 border border-neutral-150 p-4 text-sm text-neutral-500">
        {(() => {
          const storyWord = stories.length === 1 ? t("interviews.starMethod.story") : t("interviews.starMethod.stories");
          const text = t("interviews.starMethod.summary")
            .replace("{storyWord}", storyWord);
          const parts = text.split(/\{count\}|\{complete\}/);
          return (
            <>
              {parts[0]}<strong className="text-neutral-800">{stories.length}</strong>
              {parts[1]}<strong className="text-neutral-800">{completeCount}</strong>
              {parts[2]}
            </>
          );
        })()}
      </div>

      <NextStepLink href="/interviews/common-questions" labelKey="interviews.sections.commonQuestions.title" />

      <ConfirmDialog
        open={deleteIndex !== null}
        title={t("interviews.starMethod.deleteStoryTitle")}
        message={t("interviews.starMethod.deleteStoryConfirm")}
        onConfirm={() => {
          deleteStory(deleteIndex!);
          setDeleteIndex(null);
        }}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
}
