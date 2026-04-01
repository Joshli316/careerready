"use client";

import { useState, useEffect, useCallback } from "react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Plus, X } from "lucide-react";
import { ToggleButton } from "@/components/ui/ToggleButton";


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

const SOFT_SKILL_KEYS: Record<string, string> = {
  "Professionalism": "knowYourself.skills.skillNames.professionalism",
  "Enthusiasm": "knowYourself.skills.skillNames.enthusiasm",
  "Communication": "knowYourself.skills.skillNames.communication",
  "Customer Service": "knowYourself.skills.skillNames.customerService",
  "Commitment": "knowYourself.skills.skillNames.commitment",
  "Teamwork": "knowYourself.skills.skillNames.teamwork",
  "Adaptability": "knowYourself.skills.skillNames.adaptability",
  "Organization": "knowYourself.skills.skillNames.organization",
  "Time Management": "knowYourself.skills.skillNames.timeManagement",
  "Decision Making": "knowYourself.skills.skillNames.decisionMaking",
  "Problem Solving": "knowYourself.skills.skillNames.problemSolving",
  "Leadership": "knowYourself.skills.skillNames.leadership",
  "Creativity": "knowYourself.skills.skillNames.creativity",
  "Critical Thinking": "knowYourself.skills.skillNames.criticalThinking",
  "Attention to Detail": "knowYourself.skills.skillNames.attentionToDetail",
};

const HARD_SKILL_CATEGORY_KEYS: { categoryKey: string; examplesKey: string }[] = [
  { categoryKey: "knowYourself.skills.categories.technology", examplesKey: "knowYourself.skills.categories.technologyEx" },
  { categoryKey: "knowYourself.skills.categories.business", examplesKey: "knowYourself.skills.categories.businessEx" },
  { categoryKey: "knowYourself.skills.categories.healthcare", examplesKey: "knowYourself.skills.categories.healthcareEx" },
  { categoryKey: "knowYourself.skills.categories.trades", examplesKey: "knowYourself.skills.categories.tradesEx" },
  { categoryKey: "knowYourself.skills.categories.creative", examplesKey: "knowYourself.skills.categories.creativeEx" },
  { categoryKey: "knowYourself.skills.categories.other", examplesKey: "knowYourself.skills.categories.otherEx" },
];

interface Skill {
  name: string;
  category: "soft" | "hard";
  source: string;
}

export default function SkillsPage() {
  const { saved, save, storage } = useProfileSave();
  const { t } = useLanguage();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState<"soft" | "hard">("soft");
  const [newSource, setNewSource] = useState("");

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.skills) {
        setSkills(profile.skills);
      }
    });
  }, [storage]);

  const saveSkills = useCallback(
    (updated: Skill[]) => save({ skills: updated }),
    [save]
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
    saveSkills(updated);
  }

  function addCustomSkill() {
    if (!newSkill.trim()) return;
    const updated = [...skills, { name: newSkill.trim(), category: newCategory, source: newSource.trim() }];
    setSkills(updated);
    setNewSkill("");
    setNewSource("");
    saveSkills(updated);
  }

  function removeSkill(index: number) {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    saveSkills(updated);
  }

  const softSkills = skills.filter((s) => s.category === "soft");
  const hardSkills = skills.filter((s) => s.category === "hard");

  return (
    <div>
      <Breadcrumb href="/know-yourself" label={t("knowYourself.title")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("knowYourself.skills.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("knowYourself.skills.description")}
          </p>
        </div>
        <SavedIndicator visible={saved} />
      </div>

      <Callout type="tip" className="mb-6">
        {t("knowYourself.skills.callout")}
      </Callout>

      {/* Soft Skills Checklist */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-neutral-800">{t("knowYourself.skills.softSkillsTitle")}</h2>
        <p className="mb-4 text-sm text-neutral-500">
          {t("knowYourself.skills.softSkillsDesc")}
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {SOFT_SKILLS.map((skill) => (
              <ToggleButton
                key={skill}
                label={t(SOFT_SKILL_KEYS[skill])}
                checked={skills.some((s) => s.name === skill && s.category === "soft")}
                onToggle={() => toggleSoftSkill(skill)}
              />
          ))}
        </div>
      </section>

      {/* Hard Skills */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-neutral-800">{t("knowYourself.skills.hardSkillsTitle")}</h2>
        <p className="mb-4 text-sm text-neutral-500">
          {t("knowYourself.skills.hardSkillsDesc")}
        </p>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {HARD_SKILL_CATEGORY_KEYS.map((cat) => (
            <div key={cat.categoryKey} className="rounded-lg border border-neutral-150 bg-white p-3">
              <div className="text-sm font-medium text-neutral-700">{t(cat.categoryKey)}</div>
              <div className="text-xs text-neutral-400">{t(cat.examplesKey)}</div>
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
                    className="ml-1 rounded-full p-1 min-w-[28px] min-h-[28px] flex items-center justify-center hover:bg-primary-100"
                    aria-label={`${t("common.remove")} ${skill.name}`}
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </section>

      {/* Add custom skill */}
      <section className="rounded-xl border border-neutral-150 bg-white p-5">
        <h3 className="mb-3 font-semibold text-neutral-800">{t("knowYourself.skills.addSkill")}</h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder={t("knowYourself.skills.skillPlaceholder")}
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1"
          />
          <Select
            aria-label="Skill category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as "soft" | "hard")}
          >
            <option value="soft">{t("common.softSkill")}</option>
            <option value="hard">{t("common.hardSkill")}</option>
          </Select>
          <Input
            placeholder={t("knowYourself.skills.sourcePlaceholder")}
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addCustomSkill} size="md">
            <Plus className="mr-1 h-4 w-4" />
            {t("common.add")}
          </Button>
        </div>
      </section>

      {/* Summary */}
      <div className="mt-6 rounded-xl border border-neutral-150 bg-neutral-50 p-4">
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="font-semibold text-neutral-800">{softSkills.length}</span>
            <span className="ml-1 text-neutral-500">{t("knowYourself.skills.softSkills")}</span>
          </div>
          <div>
            <span className="font-semibold text-neutral-800">{hardSkills.length}</span>
            <span className="ml-1 text-neutral-500">{t("knowYourself.skills.hardSkills")}</span>
          </div>
          <div>
            <span className="font-semibold text-neutral-800">{skills.length}</span>
            <span className="ml-1 text-neutral-500">{t("common.total")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
