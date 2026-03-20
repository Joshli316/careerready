"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

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
  const [checkedProgress, setCheckedProgress] = useState<Set<number>>(new Set());
  const [checkedMethods, setCheckedMethods] = useState<Set<number>>(new Set());

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Job Search Checklist</h1>
        <p className="mt-1 text-sm text-neutral-500">Track your progress to ensure you're using all available resources.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-neutral-800">My Job Search Progress</h2>
          <div className="space-y-2">
            {progressItems.map((item, i) => {
              const checked = checkedProgress.has(i);
              return (
                <button key={i} onClick={() => toggleProgress(i)}
                  className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    checked ? "border-primary-400 bg-primary-50 text-primary-700" : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}>
                  <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-primary-400 bg-primary-400" : "border-neutral-300"}`}>
                    {checked && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  {item}
                </button>
              );
            })}
          </div>
          <div className="mt-3 text-sm text-neutral-500">
            {checkedProgress.size} of {progressItems.length} completed
          </div>
        </section>

        <section className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-neutral-800">Methods I Have Used</h2>
          <div className="space-y-2">
            {methods.map((method, i) => {
              const checked = checkedMethods.has(i);
              return (
                <button key={i} onClick={() => toggleMethod(i)}
                  className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    checked ? "border-primary-400 bg-primary-50 text-primary-700" : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}>
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-primary-400 bg-primary-400" : "border-neutral-300"}`}>
                    {checked && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  {method}
                </button>
              );
            })}
          </div>
          <div className="mt-3 text-sm text-neutral-500">
            {checkedMethods.size} of {methods.length} methods used
          </div>
        </section>
      </div>
    </div>
  );
}
