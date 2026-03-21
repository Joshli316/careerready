"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import type { JDAnalysis } from "../types";

interface JDInputFormProps {
  savedAnalyses: JDAnalysis[];
  onDecode: (jd: string) => void;
  onSelectAnalysis: (analysis: JDAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
  loading: boolean;
}

export function JDInputForm({
  savedAnalyses,
  onDecode,
  onSelectAnalysis,
  onDeleteAnalysis,
  loading,
}: JDInputFormProps) {
  const [jdText, setJdText] = useState("");

  return (
    <div className="space-y-4">
      {savedAnalyses.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-medium uppercase text-neutral-500">Saved Analyses</h3>
          <div className="flex flex-wrap gap-2">
            {savedAnalyses.map((a) => (
              <div key={a.id} className="group flex items-center gap-1">
                <button
                  onClick={() => onSelectAnalysis(a)}
                  className="rounded-lg bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                >
                  {a.jobTitle || "Untitled"}{a.company ? ` — ${a.company}` : ""}
                </button>
                <button
                  onClick={() => onDeleteAnalysis(a.id)}
                  className="rounded p-1 text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
                  aria-label={`Delete ${a.jobTitle} analysis`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <textarea
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
        placeholder="Paste a job description here..."
        rows={8}
        maxLength={15000}
        className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 resize-y"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400">{jdText.length.toLocaleString()} / 15,000</span>
        <Button
          variant="ai"
          onClick={() => onDecode(jdText)}
          disabled={loading || jdText.trim().length < 50}
        >
          {loading ? "Analyzing..." : "Decode JD"}
        </Button>
      </div>
    </div>
  );
}
