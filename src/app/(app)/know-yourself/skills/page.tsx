"use client";

import { useState, useEffect, useCallback } from "react";
import { useStorage } from "@/hooks/useStorage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Callout } from "@/components/ui/Callout";
import { Plus, X, CheckCircle } from "lucide-react";
import type { UserProfile } from "@/types/profile";

const SOFT_SKILLS = [
  "Professionalism",
  "Enthusiasm",
  "Communication",
  "Customer Service",
  "Commitment",
  "Teamwork",
  "Adaptability",
  "Organization",
  "Time Management",
  "Decision Making",
  "Problem Solving",
  "Leadership",
  "Creativity",
  "Critical Thinking",
  "Attention to Detail",
];

const HARD_SKILL_CATEGORIES = [
  { category: "Technology", examples: "Microsoft Office, Google Suite, programming, data analysis" },
  { category: "Business", examples: "Accounting, marketing, project management, sales" },
  { category: "Healthcare", examples: "CPR, patient care, medical records, lab procedures" },
  { category: "Trades", examples: "Construction, electrical, plumbing, HVAC, automotive" },
  { category: "Creative", examples: "Graphic design, video editing, photography, writing" },
  { category: "Other", examples: "Forklift certified, bilingual, CDL, food handling" },
];

interface Skill {
  name: string;
  category: "soft" | "hard";
  source: string;
}

export default function SkillsPage() {
  const storage = useStorage();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState<"soft" | "hard">("soft");
  const [newSource, setNewSource] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.skills) {
        setSkills(profile.skills);
      }
    });
  }, [storage]);

  const save = useCallback(
    async (updated: Skill[]) => {
      const profile = (await storage.getProfile()) ?? {};
      await storage.setProfile({ ...profile, skills: updated });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    [storage]
  );

  function toggleSoftSkill(name: string) {
    const exists = skills.find((s) => s.name === name && s.category === "soft");
    let updated: Skill[];
    if (exists) {
      updated = skills.filter((s) => !(s.name === name && s.category === "soft"));
    } else {
      updated = [...skills, { name, category: "soft", source: "" }];
    }
    setSkills(updated);
    save(updated);
  }

  function addCustomSkill() {
    if (!newSkill.trim()) return;
    const updated = [...skills, { name: newSkill.trim(), category: newCategory, source: newSource.trim() }];
    setSkills(updated);
    setNewSkill("");
    setNewSource("");
    save(updated);
  }

  function removeSkill(index: number) {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    save(updated);
  }

  const softSkills = skills.filter((s) => s.category === "soft");
  const hardSkills = skills.filter((s) => s.category === "hard");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Transferable Skills Inventory</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Identify the soft and hard skills you bring from all your experiences — jobs, internships,
            volunteer work, campus activities, and coursework.
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
        Skills you select here will be available to auto-populate your resume and interview preparation.
      </Callout>

      {/* Soft Skills Checklist */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-neutral-800">Soft Skills</h2>
        <p className="mb-4 text-sm text-neutral-500">
          Personal qualities and interpersonal abilities. Select all that apply to you.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SOFT_SKILLS.map((skill) => {
            const selected = skills.some((s) => s.name === skill && s.category === "soft");
            return (
              <button
                key={skill}
                onClick={() => toggleSoftSkill(skill)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  selected
                    ? "border-primary-400 bg-primary-50 text-primary-700"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                }`}
              >
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    selected ? "border-primary-400 bg-primary-400" : "border-neutral-300"
                  }`}
                >
                  {selected && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                {skill}
              </button>
            );
          })}
        </div>
      </section>

      {/* Hard Skills */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-neutral-800">Hard Skills</h2>
        <p className="mb-4 text-sm text-neutral-500">
          Specific, teachable abilities. Think about skills from coursework, certifications, projects, and jobs.
        </p>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {HARD_SKILL_CATEGORIES.map((cat) => (
            <div key={cat.category} className="rounded-lg border border-neutral-150 bg-white p-3">
              <div className="text-sm font-medium text-neutral-700">{cat.category}</div>
              <div className="text-xs text-neutral-400">{cat.examples}</div>
            </div>
          ))}
        </div>

        {/* Hard skills list */}
        {hardSkills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {hardSkills.map((skill, i) => {
              const globalIdx = skills.indexOf(skill);
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm text-primary-700"
                >
                  {skill.name}
                  {skill.source && (
                    <span className="text-xs text-primary-400">({skill.source})</span>
                  )}
                  <button
                    onClick={() => removeSkill(globalIdx)}
                    className="ml-1 rounded-full p-0.5 hover:bg-primary-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </section>

      {/* Add custom skill */}
      <section className="rounded-xl border border-neutral-150 bg-white p-5">
        <h3 className="mb-3 font-semibold text-neutral-800">Add a Skill</h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Skill name (e.g., Python, QuickBooks)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as "soft" | "hard")}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm"
          >
            <option value="soft">Soft Skill</option>
            <option value="hard">Hard Skill</option>
          </select>
          <Input
            placeholder="Where learned (optional)"
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addCustomSkill} size="md">
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
      </section>

      {/* Summary */}
      <div className="mt-6 rounded-xl border border-neutral-150 bg-neutral-50 p-4">
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="font-semibold text-neutral-800">{softSkills.length}</span>
            <span className="ml-1 text-neutral-500">soft skills</span>
          </div>
          <div>
            <span className="font-semibold text-neutral-800">{hardSkills.length}</span>
            <span className="ml-1 text-neutral-500">hard skills</span>
          </div>
          <div>
            <span className="font-semibold text-neutral-800">{skills.length}</span>
            <span className="ml-1 text-neutral-500">total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
