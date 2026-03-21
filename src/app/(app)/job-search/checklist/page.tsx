"use client";

import { useState, useEffect, useCallback } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { useProfileSave } from "@/hooks/useProfileSave";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Button } from "@/components/ui/Button";

const progressItems = [
  "I can access my resume through email, cloud, or flash drive",
  "I have registered with and completed profiles on job websites",
  "I have registered with staffing agencies",
  "I am contacting at least 2 people in my network each week",
  "I have contacted companies through cold calls or walk-ins",
  "I have attended recruitments or interviews",
  "I practice my Power Statement regularly",
  "I practice interview questions daily",
  "I have attended Job Fairs or Career Expos",
  "I follow up on each of my applications and interviews",
];

const methods = [
  "Networking", "Cold Calling", "Face-to-Face/Walk-In", "Online Job Boards",
  "Help Wanted Signs", "Classified Ads", "Employment Centers",
  "Staffing Agencies", "Professional Organizations", "Job Fairs",
  "Recruitments", "Company Websites", "Social Media",
];

export default function ChecklistPage() {
  const { saved, save, storage } = useProfileSave();
  const [checkedProgress, setCheckedProgress] = useState<Set<number>>(new Set());
  const [checkedMethods, setCheckedMethods] = useState<Set<number>>(new Set());

  useEffect(() => {
    storage.getProfile().then((profile) => {
      const jsc = profile?.jobSearchChecklist;
      if (jsc) {
        if (jsc.progress) setCheckedProgress(new Set(jsc.progress));
        if (jsc.methods) setCheckedMethods(new Set(jsc.methods));
      }
    });
  }, [storage]);

  const handleSave = useCallback(
    () => save({ jobSearchChecklist: { progress: Array.from(checkedProgress), methods: Array.from(checkedMethods) } }),
    [save, checkedProgress, checkedMethods]
  );

  function toggleProgress(i: number) {
    const s = new Set(checkedProgress);
    s.has(i) ? s.delete(i) : s.add(i);
    setCheckedProgress(s);
  }

  function toggleMethod(i: number) {
    const s = new Set(checkedMethods);
    s.has(i) ? s.delete(i) : s.add(i);
    setCheckedMethods(s);
  }

  return (
    <div>
      <Breadcrumb href="/job-search" label="Job Search" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Job Search Checklist</h1>
        <p className="mt-1 text-sm text-neutral-500">Check off each item as you go so you don't miss any channels.</p>
      </div>

      <SavedIndicator visible={saved} />

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-neutral-800">My Job Search Progress</h2>
          <div className="space-y-2">
            {progressItems.map((item, i) => (
                <ToggleButton
                  key={i}
                  label={item}
                  checked={checkedProgress.has(i)}
                  onToggle={() => toggleProgress(i)}
                />
            ))}
          </div>
          <div className="mt-3 text-sm text-neutral-500">
            {checkedProgress.size} of {progressItems.length} completed
          </div>
        </section>

        <section className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-neutral-800">Methods I Have Used</h2>
          <div className="space-y-2">
            {methods.map((method, i) => (
                <ToggleButton
                  key={i}
                  label={method}
                  checked={checkedMethods.has(i)}
                  onToggle={() => toggleMethod(i)}
                />
            ))}
          </div>
          <div className="mt-3 text-sm text-neutral-500">
            {checkedMethods.size} of {methods.length} methods used
          </div>
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} size="lg">Save Progress</Button>
      </div>
    </div>
  );
}
