"use client";

import { type ReactNode } from "react";
import { Plus } from "lucide-react";

interface Tab {
  id: string;
  label: string | ReactNode;
}

interface TabStripProps {
  tabs: Tab[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd?: () => void;
  addLabel?: string;
}

export function TabStrip({ tabs, activeId, onSelect, onAdd, addLabel = "New" }: TabStripProps) {
  return (
    <div className="mb-4 flex items-center gap-2 overflow-x-auto" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
              isActive
                ? "bg-primary-400 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1 rounded-lg border border-dashed border-neutral-300 px-3 py-1.5 text-sm text-neutral-500 hover:border-primary-300 hover:text-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </button>
      )}
    </div>
  );
}
