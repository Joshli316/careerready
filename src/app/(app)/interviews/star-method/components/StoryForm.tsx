"use client";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { StarStory } from "@/types/interview";

interface StoryFormProps {
  story: StarStory;
  onUpdate: (field: keyof StarStory, value: string) => void;
  sampleQuestions: string[];
}

export function StoryForm({ story, onUpdate, sampleQuestions }: StoryFormProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {sampleQuestions.length > 0 && (
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-3">
          <p className="text-sm font-medium text-primary-700">
            {t("interviews.starMethod.pickQuestion")}
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
        label={t("interviews.starMethod.behavioralQuestion")}
        placeholder={t("interviews.starMethod.behavioralQuestionPlaceholder")}
        value={story.question}
        onChange={(e) => onUpdate("question", e.target.value)}
      />

      <Textarea
        label={t("interviews.starMethod.situation")}
        placeholder={t("interviews.starMethod.situationPlaceholder")}
        value={story.situation}
        onChange={(e) => onUpdate("situation", e.target.value)}
        rows={3}
      />

      <Textarea
        label={t("interviews.starMethod.task")}
        placeholder={t("interviews.starMethod.taskPlaceholder")}
        value={story.task}
        onChange={(e) => onUpdate("task", e.target.value)}
        rows={3}
      />

      <Textarea
        label={t("interviews.starMethod.action")}
        placeholder={t("interviews.starMethod.actionPlaceholder")}
        value={story.action}
        onChange={(e) => onUpdate("action", e.target.value)}
        rows={3}
      />

      <Textarea
        label={t("interviews.starMethod.result")}
        placeholder={t("interviews.starMethod.resultPlaceholder")}
        value={story.result}
        onChange={(e) => onUpdate("result", e.target.value)}
        rows={3}
      />

      <Textarea
        label={t("interviews.starMethod.earnedSecret")}
        placeholder={t("interviews.starMethod.earnedSecretPlaceholder")}
        value={story.earnedSecret}
        onChange={(e) => onUpdate("earnedSecret", e.target.value)}
        rows={2}
      />
    </div>
  );
}
