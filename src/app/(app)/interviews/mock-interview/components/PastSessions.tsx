"use client";

import { Trash2, ChevronRight } from "lucide-react";
import type { MockInterviewSession } from "../types";

interface PastSessionsProps {
  sessions: MockInterviewSession[];
  onSelect: (session: MockInterviewSession) => void;
  onDelete: (id: string) => void;
}

export function PastSessions({ sessions, onSelect, onDelete }: PastSessionsProps) {
  if (sessions.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-xs font-medium uppercase text-neutral-500">Past Sessions</h3>
      <div className="space-y-2">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="group flex items-center justify-between rounded-lg border border-neutral-150 bg-white px-4 py-3 shadow-sm"
          >
            <button
              onClick={() => onSelect(s)}
              className="flex flex-1 items-center gap-3 text-left"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800">{s.sourceLabel}</p>
                <p className="text-xs text-neutral-500">
                  {new Date(s.createdAt).toLocaleDateString()} — {s.exchanges.length} questions
                  {s.completed ? " (completed)" : " (in progress)"}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </button>
            <button
              onClick={() => onDelete(s.id)}
              className="ml-2 rounded p-1 text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
              aria-label="Delete session"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
