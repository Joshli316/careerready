"use client";

import { useState, useEffect, useCallback } from "react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const VALUES = [
  { value: "Achievement", description: "Jobs that let you use your best abilities with a feeling of accomplishment." },
  { value: "Relationships", description: "Jobs where co-workers are friendly and you can be of service to others." },
  { value: "Support", description: "Jobs with competent and fair management that stands behind its workers." },
  { value: "Independence", description: "Jobs where you are encouraged to take initiative and make decisions." },
  { value: "Recognition", description: "Jobs with good possibilities for advancement, prestige, and leadership." },
  { value: "Working Conditions", description: "Jobs with desired pay, security, location, and work style." },
];

export default function WorkValuesPage() {
  const { saved, save, storage } = useProfileSave();
  const [rankings, setRankings] = useState(VALUES.map((v, i) => ({ ...v, rank: i + 1 })));

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.workValues?.length) {
        const ranked = VALUES.map((v) => {
          const found = profile.workValues?.find((wv) => wv.value === v.value);
          return { ...v, rank: found?.rank ?? VALUES.indexOf(v) + 1 };
        }).sort((a, b) => a.rank - b.rank);
        setRankings(ranked);
      }
    });
  }, [storage]);

  const handleSave = useCallback(
    () => save({ workValues: rankings.map((r, i) => ({ value: r.value, rank: i + 1 })) }),
    [save, rankings]
  );

  function moveUp(index: number) {
    if (index === 0) return;
    const updated = [...rankings];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setRankings(updated);
  }

  function moveDown(index: number) {
    if (index === rankings.length - 1) return;
    const updated = [...rankings];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setRankings(updated);
  }

  return (
    <div>
      <Breadcrumb href="/know-yourself" label="Know Yourself" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Work Values Assessment</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Rank what matters most to you in a workplace. This helps you target jobs that align with your priorities.
          </p>
        </div>
        <SavedIndicator visible={saved} />
      </div>

      <Callout type="tip" className="mb-6">
        Use the arrows to reorder. #1 is most important to you.
        Your values may change over time. Revisit this periodically.
      </Callout>

      <div className="space-y-3">
        {rankings.map((item, index) => (
          <div
            key={item.value}
            className="flex items-center gap-3 rounded-xl border border-neutral-150 bg-white p-4 shadow-sm"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-700">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-neutral-800">{item.value}</div>
              <div className="text-sm text-neutral-500">{item.description}</div>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveUp(index)}
                disabled={index === 0}
                aria-label={`Move ${item.value} up`}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-30"
              >
                ▲
              </button>
              <button
                onClick={() => moveDown(index)}
                disabled={index === rankings.length - 1}
                aria-label={`Move ${item.value} down`}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-30"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} size="lg">Save Rankings</Button>
      </div>
    </div>
  );
}
