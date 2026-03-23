"use client";

import { useState, useEffect, useCallback } from "react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { Plus, X } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";


export default function BeliefsPage() {
  const { saved, save, storage } = useProfileSave();
  const [iAm, setIAm] = useState("");
  const [iCan, setICan] = useState("");
  const [iHave, setIHave] = useState("");
  const [challenges, setChallenges] = useState<Array<{ challenge: string; solution: string }>>([
    { challenge: "", solution: "" },
  ]);

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.beliefs) {
        const b = profile.beliefs;
        if (b.positive?.length >= 1) setIAm(b.positive[0] ?? "");
        if (b.positive?.length >= 2) setICan(b.positive[1] ?? "");
        if (b.positive?.length >= 3) setIHave(b.positive[2] ?? "");
        if (b.challenges?.length) setChallenges(b.challenges);
      }
    });
  }, [storage]);

  const handleSave = useCallback(
    () => save({
      beliefs: {
        positive: [iAm, iCan, iHave],
        challenges: challenges.filter((c) => c.challenge || c.solution),
      },
    }),
    [save, iAm, iCan, iHave, challenges]
  );

  function updateChallenge(index: number, field: "challenge" | "solution", value: string) {
    const updated = [...challenges];
    updated[index] = { ...updated[index], [field]: value };
    setChallenges(updated);
  }

  function addChallenge() {
    setChallenges([...challenges, { challenge: "", solution: "" }]);
  }

  function removeChallenge(index: number) {
    if (challenges.length <= 1) return;
    setChallenges(challenges.filter((_, i) => i !== index));
  }

  return (
    <div>
      <Breadcrumb href="/know-yourself" label="Know Yourself" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Challenge Your Belief System</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Identify positive beliefs about yourself and convert challenges into affirmations.
          </p>
        </div>
        <SavedIndicator visible={saved} />
      </div>

      <Callout type="tip" className="mb-6">
        Negative self-talk ("I don't have enough experience") kills interviews. This exercise helps you
        reframe those thoughts so you can talk about yourself confidently to employers.
      </Callout>

      {/* Positive Beliefs */}
      <section className="mb-8 rounded-xl border-l-4 border-l-primary-400 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-neutral-800">
          Share positive beliefs about yourself
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-600">
              I <strong>am</strong>...
            </label>
            <Input
              placeholder='e.g., "outgoing and get along well with others"'
              value={iAm}
              onChange={(e) => setIAm(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-600">
              I <strong>can</strong>...
            </label>
            <Input
              placeholder='e.g., "communicate with people from various backgrounds"'
              value={iCan}
              onChange={(e) => setICan(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-600">
              I <strong>have</strong>...
            </label>
            <Input
              placeholder='e.g., "the determination to do a good job"'
              value={iHave}
              onChange={(e) => setIHave(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Challenges to Affirmations */}
      <section className="mb-8 rounded-xl border-l-4 border-l-primary-400 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-neutral-800">
          Convert Challenges to Affirmations
        </h2>
        <p className="mb-4 text-sm text-neutral-500">
          Think of any negative beliefs about employment and convert them to positive affirmations.
        </p>
        <div className="space-y-4">
          {challenges.map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="I have had a challenge with..."
                  value={item.challenge}
                  onChange={(e) => updateChallenge(i, "challenge", e.target.value)}
                />
                <Input
                  placeholder="But I can overcome it by..."
                  value={item.solution}
                  onChange={(e) => updateChallenge(i, "solution", e.target.value)}
                />
              </div>
              {challenges.length > 1 && (
                <button
                  onClick={() => removeChallenge(i)}
                  className="mt-2 rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addChallenge}
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary-400 hover:text-primary-500"
        >
          <Plus className="h-4 w-4" />
          Add another challenge
        </button>
      </section>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Save Beliefs
        </Button>
      </div>
    </div>
  );
}
