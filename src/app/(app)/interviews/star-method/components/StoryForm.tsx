"use client";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { StarStory } from "@/types/interview";

interface StoryFormProps {
  story: StarStory;
  onUpdate: (field: keyof StarStory, value: string) => void;
  sampleQuestions: string[];
}

export function StoryForm({ story, onUpdate, sampleQuestions }: StoryFormProps) {
  return (
    <div className="space-y-4">
      {sampleQuestions.length > 0 && (
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-3">
          <p className="text-sm font-medium text-primary-700">
            Pick a question to practice:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sampleQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onUpdate("question", q)}
                className="rounded-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-600 hover:border-primary-300 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <Input
        label="Behavioral Question"
        placeholder="The interview question you're preparing for..."
        value={story.question}
        onChange={(e) => onUpdate("question", e.target.value)}
      />

      <Textarea
        label="Situation"
        placeholder="Set the scene. What was happening? Where were you working/studying?"
        value={story.situation}
        onChange={(e) => onUpdate("situation", e.target.value)}
        rows={3}
      />

      <Textarea
        label="Task"
        placeholder="What was your responsibility or challenge?"
        value={story.task}
        onChange={(e) => onUpdate("task", e.target.value)}
        rows={3}
      />

      <Textarea
        label="Action"
        placeholder="What specific steps did you take? Focus on YOUR actions."
        value={story.action}
        onChange={(e) => onUpdate("action", e.target.value)}
        rows={3}
      />

      <Textarea
        label="Result"
        placeholder="What was the outcome? Use numbers when possible (%, $, time saved)."
        value={story.result}
        onChange={(e) => onUpdate("result", e.target.value)}
        rows={3}
      />

      <Textarea
        label="Earned Secret"
        placeholder="What hidden insight or lesson did you earn from this experience?"
        value={story.earnedSecret}
        onChange={(e) => onUpdate("earnedSecret", e.target.value)}
        rows={2}
      />
    </div>
  );
}
