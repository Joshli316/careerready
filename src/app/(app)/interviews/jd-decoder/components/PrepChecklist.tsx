"use client";

import { ToggleButton } from "@/components/ui/ToggleButton";
import type { PrepChecklistItem } from "../types";

interface PrepChecklistProps {
  items: PrepChecklistItem[];
  onToggle: (id: string) => void;
}

const groupLabels: Record<PrepChecklistItem["type"], string> = {
  polish_story: "Polish Existing Stories",
  draft_new_story: "Draft New Stories",
  research: "Research",
  practice: "Practice",
};

const groupOrder: PrepChecklistItem["type"][] = [
  "polish_story",
  "draft_new_story",
  "research",
  "practice",
];

export function PrepChecklist({ items, onToggle }: PrepChecklistProps) {
  const doneCount = items.filter((i) => i.done).length;
  const progress = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  const grouped = groupOrder
    .map((type) => ({
      type,
      label: groupLabels[type],
      items: items.filter((i) => i.type === type),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-neutral-100">
          <div
            className="h-2 rounded-full bg-primary-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-neutral-600">
          {doneCount}/{items.length}
        </span>
      </div>
      {grouped.map((group) => (
        <div key={group.type}>
          <h4 className="mb-2 text-xs font-medium uppercase text-neutral-500">{group.label}</h4>
          <div className="space-y-2">
            {group.items.map((item) => (
              <ToggleButton
                key={item.id}
                label={item.label}
                checked={item.done}
                onToggle={() => onToggle(item.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
