"use client";

import { useState, useEffect, useCallback } from "react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Sparkles } from "lucide-react";

export default function BrandingPage() {
  const { saved, save, storage } = useProfileSave();
  const [field, setField] = useState("");
  const [position, setPosition] = useState("");
  const [skills, setSkills] = useState("");
  const [accomplishments, setAccomplishments] = useState("");
  const [brandStatement, setBrandStatement] = useState("");

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.brandStatement) setBrandStatement(profile.brandStatement);
      const bd = profile?.brandDiscovery;
      if (bd) {
        if (bd.field) setField(bd.field);
        if (bd.position) setPosition(bd.position);
        if (bd.skills) setSkills(bd.skills);
        if (bd.accomplishments) setAccomplishments(bd.accomplishments);
      }
    });
  }, [storage]);

  const handleSave = useCallback(
    () => save({ brandStatement, brandDiscovery: { field, position, skills, accomplishments } }),
    [save, brandStatement, field, position, skills, accomplishments]
  );

  return (
    <div>
      <Breadcrumb href="/know-yourself" label="Know Yourself" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Personal Branding</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Write 1-2 sentences that tell employers what you're good at and why.
          </p>
        </div>
        <SavedIndicator visible={saved} />
      </div>

      <Callout type="tip" className="mb-6">
        Your brand statement can be used on your resume, LinkedIn profile, and in networking conversations.
        It should be 1-2 sentences covering what you do best, who you serve, and how you do it uniquely.
      </Callout>

      {/* Discovery */}
      <section className="mb-6 rounded-xl border-l-4 border-l-primary-400 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-neutral-800">Identify Your Brand</h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Target Field / Industry" placeholder="e.g., Marketing, Healthcare" value={field} onChange={(e) => setField(e.target.value)} />
            <Input label="Target Position" placeholder="e.g., Marketing Coordinator" value={position} onChange={(e) => setPosition(e.target.value)} />
          </div>
          <Textarea label="Key Skills & Qualities" placeholder="What skills, qualities, and attributes should your brand convey?" value={skills} onChange={(e) => setSkills(e.target.value)} rows={3} />
          <Textarea label="Accomplishments" placeholder="What are your accomplishments related to your brand?" value={accomplishments} onChange={(e) => setAccomplishments(e.target.value)} rows={3} />
        </div>
      </section>

      {/* Brand Statement */}
      <section className="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-6">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-600" />
          <h2 className="font-semibold text-primary-800">Your Personal Brand Statement</h2>
        </div>
        <p className="mb-3 text-sm text-primary-700">
          Write 1-2 sentences about what you are best at (value), who you serve (audience), and how you do it uniquely.
        </p>
        <Textarea
          placeholder='e.g., "Marketing graduate who ran social media for two campus organizations. I grew one account from 200 to 2,000 followers in a semester."'
          value={brandStatement}
          onChange={(e) => setBrandStatement(e.target.value)}
          rows={4}
          className="border-primary-200 bg-white"
        />
      </section>

      {/* Example */}
      <div className="mb-6 rounded-lg border border-neutral-150 bg-neutral-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-neutral-600">Example Brand Statements</h3>
        <ul className="space-y-2 text-sm text-neutral-500 italic">
          <li>"I helped customers find the right product at a busy retail store and consistently hit 110% of my weekly sales target."</li>
          <li>"CS graduate who built three full-stack apps in school. I care about making websites that work for everyone, including people using screen readers."</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">Save Brand Statement</Button>
      </div>
    </div>
  );
}
