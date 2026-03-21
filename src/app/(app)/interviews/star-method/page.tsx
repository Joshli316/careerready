"use client";

import { useState, useEffect, useCallback } from "react";
import { useStorage } from "@/hooks/useStorage";
import { useSaveIndicator } from "@/hooks/useSaveIndicator";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CheckCircle, Plus, Star, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import type { StarStory, InterviewPrep } from "@/types/interview";

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
});

export default function StarMethodPage() {
  const storage = useStorage();
  const [stories, setStories] = useState<StarStory[]>([emptyStory()]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const { saved, showSaved } = useSaveIndicator();
  const { toast } = useToast();

  useEffect(() => {
    storage.getInterviewPrep().then((prep) => {
      if (prep?.starStories?.length) {
        setStories(prep.starStories);
      }
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
      await storage.setInterviewPrep({ ...prep, starStories: stories });
      showSaved();
      toast("Saved successfully", "success");
    } catch {
      toast("Failed to save. Please try again.", "error");
    }
  }, [storage, stories, showSaved, toast]);

  function updateStory(field: keyof StarStory, value: string) {
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

  return (
    <div>
      <Breadcrumb href="/interviews" label="Interviews" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">STAR Method Practice</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Build compelling behavioral interview responses using the Situation, Task, Action, Result framework.
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
      <div className="mb-4 flex items-center gap-2 overflow-x-auto">
        {stories.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveIndex(i)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              i === activeIndex
                ? "bg-primary-400 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            <Star className="h-3.5 w-3.5" />
            Story {i + 1}
          </button>
        ))}
        <button
          onClick={addStory}
          className="flex items-center gap-1 rounded-lg border border-dashed border-neutral-300 px-3 py-1.5 text-sm text-neutral-500 hover:border-primary-300 hover:text-primary-500"
        >
          <Plus className="h-3.5 w-3.5" />
          New
        </button>
      </div>

      {/* Suggested questions */}
      <Callout type="tip" className="mb-4">
        <strong>Pick a question to practice:</strong>
        <div className="mt-2 flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => updateStory("question", q)}
              className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-600 hover:border-primary-300 hover:text-primary-600"
            >
              {q}
            </button>
          ))}
        </div>
      </Callout>

      {/* Active story form */}
      {story && (
        <div className="space-y-4 rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
          <Input
            label="Behavioral Question"
            placeholder="The interview question you're preparing for..."
            value={story.question}
            onChange={(e) => updateStory("question", e.target.value)}
          />
          <Textarea
            label="Situation"
            placeholder="Set the scene. What was happening? Where were you working/studying?"
            value={story.situation}
            onChange={(e) => updateStory("situation", e.target.value)}
            rows={3}
          />
          <Textarea
            label="Task"
            placeholder="What was your responsibility or challenge?"
            value={story.task}
            onChange={(e) => updateStory("task", e.target.value)}
            rows={3}
          />
          <Textarea
            label="Action"
            placeholder="What specific steps did you take? Focus on YOUR actions."
            value={story.action}
            onChange={(e) => updateStory("action", e.target.value)}
            rows={3}
          />
          <Textarea
            label="Result"
            placeholder="What was the outcome? Use numbers when possible (%, $, time saved)."
            value={story.result}
            onChange={(e) => updateStory("result", e.target.value)}
            rows={3}
          />

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
              <Button onClick={save}>Save All Stories</Button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 rounded-lg bg-neutral-50 border border-neutral-150 p-4 text-sm text-neutral-500">
        You have <strong className="text-neutral-800">{stories.length}</strong> STAR {stories.length === 1 ? "story" : "stories"} saved.
        Aim for 4-6 stories that cover different scenarios.
      </div>

      <ConfirmDialog
        open={deleteIndex !== null}
        title="Delete STAR Story"
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
