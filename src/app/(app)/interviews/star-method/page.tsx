"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useStorage } from "@/hooks/useStorage";
import { useSaveIndicator } from "@/hooks/useSaveIndicator";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { TabStrip } from "@/components/ui/TabStrip";
import { CheckCircle, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import type { StarStory } from "@/types/interview";
import { hydrateStory, computeQualityScore, isStoryComplete } from "./lib/storyUtils";
import { StoryForm } from "./components/StoryForm";
import { StoryMeta } from "./components/StoryMeta";
import { StoryQualityBadge } from "./components/StoryQualityBadge";
import { QuestionCoverage } from "./components/QuestionCoverage";

const SAMPLE_QUESTIONS = [
  "Describe a difficult problem you solved.",
  "Describe a time when you disagreed with a supervisor.",
  "How do you deal with a difficult customer or client?",
  "Give an example of a time when you showed initiative.",
  "Tell me about a time you worked effectively under pressure.",
  "Describe a situation where you had to learn something new quickly.",
];

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
  const storage = useStorage();
  const searchParams = useSearchParams();
  const [stories, setStories] = useState<StarStory[]>([emptyStory()]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const { saved, showSaved } = useSaveIndicator();
  const { toast } = useToast();
  const deepLinkHandled = useRef(false);

  useEffect(() => {
    storage.getInterviewPrep().then((prep) => {
      if (prep?.starStories?.length) {
        setStories(prep.starStories.map(hydrateStory));
      }
    });
  }, [storage]);

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
      toast("Story added — fill in your STAR answer below.", "success");
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
      toast("Saved successfully", "success");
    } catch {
      toast("Failed to save. Please try again.", "error");
    }
  }, [storage, stories, showSaved, toast]);

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
    toast("Story deleted");
  }

  const story = stories[activeIndex];
  const completeCount = stories.filter(isStoryComplete).length;

  return (
    <div>
      <Breadcrumb href="/interviews" label="Interviews" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Storybank</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage your behavioral interview stories. Rate quality, tag skills, and track question coverage.
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-success">
            <CheckCircle className="h-4 w-4" />
            Saved
          </div>
        )}
      </div>

      {/* STAR explanation */}
      <div className="mb-6 grid grid-cols-4 gap-3">
        {[
          { letter: "S", label: "Situation", desc: "Share the situation you experienced." },
          { letter: "T", label: "Task", desc: "Describe the challenging task." },
          { letter: "A", label: "Action", desc: "Explain the actions you took." },
          { letter: "R", label: "Result", desc: "Report the results achieved." },
        ].map((item) => (
          <div key={item.letter} className="rounded-lg border border-primary-200 bg-primary-50 p-3 text-center">
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
              <span>Story {i + 1}</span>{" "}
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
                className="flex items-center gap-1.5 text-sm text-error hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete this story
              </button>
            )}
            <div className="ml-auto">
              <Button onClick={save}>Save Stories</Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <QuestionCoverage stories={stories} />
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-lg bg-neutral-50 border border-neutral-150 p-4 text-sm text-neutral-500">
        You have <strong className="text-neutral-800">{stories.length}</strong>{" "}
        {stories.length === 1 ? "story" : "stories"} (
        <strong className="text-neutral-800">{completeCount}</strong> complete).
        Aim for 6-8 polished stories.
      </div>

      <ConfirmDialog
        open={deleteIndex !== null}
        title="Delete Story"
        message="This story will be permanently deleted."
        onConfirm={() => {
          deleteStory(deleteIndex!);
          setDeleteIndex(null);
        }}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
}
