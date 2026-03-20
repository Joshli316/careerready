"use client";

import { useState, useEffect, useCallback } from "react";
import { useStorage } from "@/hooks/useStorage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { CheckCircle, Target } from "lucide-react";

interface FocusGoal {
  goal: string;
  steps: { today: string[]; threeWeeks: string[]; threeMonths: string[] };
  resources: string[];
  purpose: string;
  deadline: string;
  fullStatement: string;
}

const emptyGoal: FocusGoal = {
  goal: "",
  steps: { today: [""], threeWeeks: [""], threeMonths: [""] },
  resources: [""],
  purpose: "",
  deadline: "",
  fullStatement: "",
};

export default function FocusGoalsPage() {
  const storage = useStorage();
  const [focusGoal, setFocusGoal] = useState<FocusGoal>(emptyGoal);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.focusGoals?.length) {
        setFocusGoal(profile.focusGoals[0]);
      }
    });
  }, [storage]);

  const save = useCallback(async () => {
    const profile = (await storage.getProfile()) ?? {};
    await storage.setProfile({ ...profile, focusGoals: [focusGoal] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [storage, focusGoal]);

  function updateSteps(phase: keyof FocusGoal["steps"], index: number, value: string) {
    const steps = { ...focusGoal.steps };
    const arr = [...steps[phase]];
    arr[index] = value;
    steps[phase] = arr;
    setFocusGoal({ ...focusGoal, steps });
  }

  function addStep(phase: keyof FocusGoal["steps"]) {
    const steps = { ...focusGoal.steps };
    steps[phase] = [...steps[phase], ""];
    setFocusGoal({ ...focusGoal, steps });
  }

  const focusSteps = [
    { letter: "F", title: "Find and Define", description: "What exactly do you want to achieve? Be specific.", field: "goal" as const },
    { letter: "U", title: "Understand the Purpose", description: "Why is this goal important to you?", field: "purpose" as const },
    { letter: "S", title: "Set a Time Frame", description: "When will you achieve this goal?", field: "deadline" as const },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Goal Setting with FOCUS</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Create structured employment goals using the FOCUS framework.
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-success">
            <CheckCircle className="h-4 w-4" />
            Saved
          </div>
        )}
      </div>

      <Callout type="tip" className="mb-6">
        If your goal is just a dream, take specific action steps to make it happen.
        The FOCUS framework breaks your goal into achievable parts.
      </Callout>

      {/* F, U, S — text fields */}
      {focusSteps.map((step) => (
        <section key={step.letter} className="mb-6 rounded-xl border-l-4 border-l-primary-400 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-400 text-lg font-bold text-white">
              {step.letter}
            </div>
            <div>
              <h2 className="font-semibold text-neutral-800">{step.title}</h2>
              <p className="text-sm text-neutral-500">{step.description}</p>
            </div>
          </div>
          {step.field === "deadline" ? (
            <Input
              type="date"
              value={focusGoal[step.field]}
              onChange={(e) => setFocusGoal({ ...focusGoal, [step.field]: e.target.value })}
            />
          ) : (
            <Textarea
              value={focusGoal[step.field]}
              onChange={(e) => setFocusGoal({ ...focusGoal, [step.field]: e.target.value })}
              placeholder={step.description}
              rows={3}
            />
          )}
        </section>
      ))}

      {/* O — Outline Steps */}
      <section className="mb-6 rounded-xl border-l-4 border-l-primary-400 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-400 text-lg font-bold text-white">
            O
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800">Outline Steps</h2>
            <p className="text-sm text-neutral-500">Break your goal into smaller, achievable steps.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {(["today", "threeWeeks", "threeMonths"] as const).map((phase) => (
            <div key={phase} className="rounded-lg border border-neutral-150 p-4">
              <h3 className="mb-2 text-sm font-medium text-neutral-700">
                {phase === "today" ? "Today" : phase === "threeWeeks" ? "In 3 Weeks" : "In 3 Months"}
              </h3>
              <div className="space-y-2">
                {focusGoal.steps[phase].map((step, i) => (
                  <Input
                    key={i}
                    placeholder={`Step ${i + 1}`}
                    value={step}
                    onChange={(e) => updateSteps(phase, i, e.target.value)}
                  />
                ))}
                <button
                  onClick={() => addStep(phase)}
                  className="text-xs font-medium text-primary-400 hover:text-primary-500"
                >
                  + Add step
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* C — Resources */}
      <section className="mb-6 rounded-xl border-l-4 border-l-primary-400 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-400 text-lg font-bold text-white">
            C
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800">Create a List of Resources</h2>
            <p className="text-sm text-neutral-500">Who and what can help you achieve this goal?</p>
          </div>
        </div>
        <div className="space-y-2">
          {focusGoal.resources.map((resource, i) => (
            <Input
              key={i}
              placeholder={`Resource ${i + 1} (person, place, or organization)`}
              value={resource}
              onChange={(e) => {
                const updated = [...focusGoal.resources];
                updated[i] = e.target.value;
                setFocusGoal({ ...focusGoal, resources: updated });
              }}
            />
          ))}
          <button
            onClick={() => setFocusGoal({ ...focusGoal, resources: [...focusGoal.resources, ""] })}
            className="text-xs font-medium text-primary-400 hover:text-primary-500"
          >
            + Add resource
          </button>
        </div>
      </section>

      {/* Full Goal Statement */}
      <section className="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-6">
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary-600" />
          <h2 className="font-semibold text-primary-800">Your Complete Goal Statement</h2>
        </div>
        <Textarea
          placeholder="Combine all FOCUS elements into one complete goal statement..."
          value={focusGoal.fullStatement}
          onChange={(e) => setFocusGoal({ ...focusGoal, fullStatement: e.target.value })}
          rows={4}
          className="border-primary-200 bg-white"
        />
      </section>

      <div className="flex justify-end">
        <Button onClick={save} size="lg">
          Save Goal
        </Button>
      </div>
    </div>
  );
}
