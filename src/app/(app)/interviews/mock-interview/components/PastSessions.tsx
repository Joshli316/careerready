"use client";

import { useState } from "react";
import { Trash2, ChevronRight, Clock } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { MockInterviewSession } from "../types";

interface PastSessionsProps {
  sessions: MockInterviewSession[];
  onSelect: (session: MockInterviewSession) => void;
  onDelete: (id: string) => void;
}

export function PastSessions({ sessions, onSelect, onDelete }: PastSessionsProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { t } = useLanguage();

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-150 bg-neutral-50 p-5 text-center">
        <Clock className="mx-auto h-6 w-6 text-neutral-400 mb-2" />
        <p className="text-sm text-neutral-500">{t("interviews.mockInterview.noSessions")}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-2 text-xs font-medium uppercase text-neutral-500">{t("interviews.mockInterview.yourSessions")}</h3>
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
                  {new Date(s.createdAt).toLocaleDateString()} — {s.exchanges.length} {t("interviews.mockInterview.questions")}
                  {s.completed ? ` — ${t("interviews.mockInterview.done")}` : ` — ${t("interviews.mockInterview.incomplete")}`}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </button>
            <button
              onClick={() => setDeleteId(s.id)}
              className="ml-2 rounded p-2 text-neutral-300 hover:text-red-500"
              aria-label={`Delete ${s.sourceLabel} session`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title={t("interviews.mockInterview.deleteSession")}
        message={t("interviews.mockInterview.deleteSessionConfirm")}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
