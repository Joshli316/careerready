"use client";

import { useState, useEffect, useCallback } from "react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Target } from "lucide-react";

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
  const { saved, save, storage } = useProfileSave();
  const { t } = useLanguage();
  const [focusGoal, setFocusGoal] = useState<FocusGoal>(emptyGoal);

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.focusGoals?.length) {
        setFocusGoal(profile.focusGoals[0]);
      }
    });
  }, [storage]);

  const handleSave = useCallback(() => save({ focusGoals: [focusGoal] }), [save, focusGoal]);

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

  const phaseLabels: Record<string, string> = {
    today: t("knowYourself.focusGoals.today"),
    threeWeeks: t("knowYourself.focusGoals.threeWeeks"),
    threeMonths: t("knowYourself.focusGoals.threeMonths"),
  };

  return (
    <div>
      <Breadcrumb href="/know-yourself" label={t("knowYourself.title")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("knowYourself.focusGoals.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("knowYourself.focusGoals.description")}
          </p>
        </div>
        <SavedIndicator visible={saved} />
      </div>

      <Callout type="tip" className="mb-6">
        {t("knowYourself.focusGoals.callout")}
      </Callout>

      {/* F — Find and Define */}
      <section className="mb-6 rounded-xl border-l-4 border-l-primary-400 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-400 text-lg font-bold text-white">
            F
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800">{t("knowYourself.focusGoals.findTitle")}</h2>
            <p className="text-sm text-neutral-500">{t("knowYourself.focusGoals.findDesc")}</p>
          </div>
        </div>
        <Textarea
          value={focusGoal.goal}
          onChange={(e) => setFocusGoal({ ...focusGoal, goal: e.target.value })}
          placeholder={t("knowYourself.focusGoals.findPlaceholder")}
          rows={3}
        />
      </section>

      {/* O — Outline Steps */}
      <section className="mb-6 rounded-xl border-l-4 border-l-primary-400 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-400 text-lg font-bold text-white">
            O
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800">{t("knowYourself.focusGoals.outlineTitle")}</h2>
            <p className="text-sm text-neutral-500">{t("knowYourself.focusGoals.outlineDesc")}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {(["today", "threeWeeks", "threeMonths"] as const).map((phase) => (
            <div key={phase} className="rounded-lg border border-neutral-150 p-4">
              <h3 className="mb-2 text-sm font-medium text-neutral-700">
                {phaseLabels[phase]}
              </h3>
              <div className="space-y-2">
                {focusGoal.steps[phase].map((step, i) => (
                  <Input
                    key={i}
                    placeholder={`${t("common.step")} ${i + 1}`}
                    value={step}
                    onChange={(e) => updateSteps(phase, i, e.target.value)}
                  />
                ))}
                <button
                  onClick={() => addStep(phase)}
                  className="text-xs font-medium text-primary-400 hover:text-primary-500"
                >
                  {t("knowYourself.focusGoals.addStep")}
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
            <h2 className="font-semibold text-neutral-800">{t("knowYourself.focusGoals.resourcesTitle")}</h2>
            <p className="text-sm text-neutral-500">{t("knowYourself.focusGoals.resourcesDesc")}</p>
          </div>
        </div>
        <div className="space-y-2">
          {focusGoal.resources.map((resource, i) => (
            <Input
              key={i}
              placeholder={t("knowYourself.focusGoals.resourcePlaceholder")}
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
            {t("knowYourself.focusGoals.addResource")}
          </button>
        </div>
      </section>

      {/* U — Understand the Purpose */}
      <section className="mb-6 rounded-xl border-l-4 border-l-primary-400 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-400 text-lg font-bold text-white">
            U
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800">{t("knowYourself.focusGoals.purposeTitle")}</h2>
            <p className="text-sm text-neutral-500">{t("knowYourself.focusGoals.purposeDesc")}</p>
          </div>
        </div>
        <Textarea
          value={focusGoal.purpose}
          onChange={(e) => setFocusGoal({ ...focusGoal, purpose: e.target.value })}
          placeholder={t("knowYourself.focusGoals.purposePlaceholder")}
          rows={3}
        />
      </section>

      {/* S — Set a Time Frame */}
      <section className="mb-6 rounded-xl border-l-4 border-l-primary-400 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-400 text-lg font-bold text-white">
            S
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800">{t("knowYourself.focusGoals.timeframeTitle")}</h2>
            <p className="text-sm text-neutral-500">{t("knowYourself.focusGoals.timeframeDesc")}</p>
          </div>
        </div>
        <Input
          type="date"
          value={focusGoal.deadline}
          onChange={(e) => setFocusGoal({ ...focusGoal, deadline: e.target.value })}
        />
      </section>

      {/* Full Goal Statement */}
      <section className="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-6">
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary-600" />
          <h2 className="font-semibold text-primary-800">{t("knowYourself.focusGoals.goalStatementTitle")}</h2>
        </div>
        <Textarea
          placeholder={t("knowYourself.focusGoals.goalStatementPlaceholder")}
          value={focusGoal.fullStatement}
          onChange={(e) => setFocusGoal({ ...focusGoal, fullStatement: e.target.value })}
          rows={4}
          className="border-primary-200 bg-white"
        />
      </section>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          {t("knowYourself.focusGoals.saveGoal")}
        </Button>
      </div>
    </div>
  );
}
