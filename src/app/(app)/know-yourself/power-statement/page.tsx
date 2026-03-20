"use client";

import { useState, useEffect, useCallback } from "react";
import { useStorage } from "@/hooks/useStorage";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { CheckCircle, Mic } from "lucide-react";

export default function PowerStatementPage() {
  const storage = useStorage();
  const [powerStatement, setPowerStatement] = useState("");
  const [brandStatement, setBrandStatement] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.powerStatement) setPowerStatement(profile.powerStatement);
      if (profile?.brandStatement) setBrandStatement(profile.brandStatement);
    });
  }, [storage]);

  const save = useCallback(async () => {
    const profile = (await storage.getProfile()) ?? {};
    await storage.setProfile({ ...profile, powerStatement });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [storage, powerStatement]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Power Statement</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Build your elevator pitch — a clear summary to introduce yourself and your brand.
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
        Your Power Statement can be used when networking, at job fairs, in interviews when asked
        "Tell me about yourself," and as the summary statement on your resume.
      </Callout>

      {/* Tips */}
      <section className="mb-6 rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-neutral-800">What to Include</h2>
        <ul className="space-y-2 text-sm text-neutral-600">
          <li className="flex gap-2"><span className="text-primary-400">&#10003;</span> Be brief and conversational, but not too wordy</li>
          <li className="flex gap-2"><span className="text-primary-400">&#10003;</span> Emphasize your brand and show enthusiasm</li>
          <li className="flex gap-2"><span className="text-primary-400">&#10003;</span> Speak in results — avoid overused phrases like "I am a team player"</li>
          <li className="flex gap-2"><span className="text-primary-400">&#10003;</span> Focus on the benefits you bring to the employer</li>
        </ul>
      </section>

      {/* Brand statement reference */}
      {brandStatement && (
        <div className="mb-6 rounded-lg border border-primary-100 bg-primary-50 p-4">
          <div className="mb-1 text-xs font-medium text-primary-600">Your Brand Statement (from Branding tool)</div>
          <p className="text-sm text-primary-800 italic">"{brandStatement}"</p>
        </div>
      )}

      {/* Example */}
      <div className="mb-6 rounded-lg border border-neutral-150 bg-neutral-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-neutral-600">Example</h3>
        <p className="text-sm text-neutral-500 italic">
          "My name is Sarah Chen and I recently graduated with a degree in Marketing from UCLA.
          I specialize in social media strategy and content creation, with internship experience
          managing campaigns that increased engagement by 40%. I'm looking for an entry-level
          marketing coordinator role where I can bring fresh ideas and data-driven creativity to your team."
        </p>
      </div>

      {/* Power Statement Builder */}
      <section className="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-6">
        <div className="mb-3 flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary-600" />
          <h2 className="font-semibold text-primary-800">Your Power Statement</h2>
        </div>
        <Textarea
          placeholder="Write your power statement here. Include your name, key qualifications, relevant experience, and what you're looking for..."
          value={powerStatement}
          onChange={(e) => setPowerStatement(e.target.value)}
          rows={6}
          className="border-primary-200 bg-white"
        />
      </section>

      <div className="flex justify-end">
        <Button onClick={save} size="lg">Save Power Statement</Button>
      </div>
    </div>
  );
}
