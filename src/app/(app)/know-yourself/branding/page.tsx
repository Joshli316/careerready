"use client";

import { useState, useEffect, useCallback } from "react";
import { useStorage } from "@/hooks/useStorage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { CheckCircle, Sparkles } from "lucide-react";

export default function BrandingPage() {
  const storage = useStorage();
  const [field, setField] = useState("");
  const [position, setPosition] = useState("");
  const [skills, setSkills] = useState("");
  const [accomplishments, setAccomplishments] = useState("");
  const [brandStatement, setBrandStatement] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.brandStatement) setBrandStatement(profile.brandStatement);
    });
  }, [storage]);

  const save = useCallback(async () => {
    const profile = (await storage.getProfile()) ?? {};
    await storage.setProfile({ ...profile, brandStatement });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [storage, brandStatement]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Personal Branding</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Create a personal brand statement that conveys your strengths and what sets you apart.
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
          placeholder='e.g., "Energetic marketing graduate with expertise in social media strategy and content creation. Passionate about helping brands connect with Gen Z audiences through authentic storytelling."'
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
          <li>"Energetic sales professional with expertise in matching customers with optimal products and services to meet their specific needs."</li>
          <li>"Detail-oriented computer science graduate skilled in full-stack development, passionate about building accessible web applications."</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} size="lg">Save Brand Statement</Button>
      </div>
    </div>
  );
}
