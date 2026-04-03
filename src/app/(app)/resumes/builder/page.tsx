"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useStorage } from "@/hooks/useStorage";
import { useSaveIndicator } from "@/hooks/useSaveIndicator";
import { usePdfExport } from "@/hooks/usePdfExport";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Callout } from "@/components/ui/Callout";
import { ContactInfoSection } from "./components/ContactInfoSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ResumePreview } from "./components/ResumePreview";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { NextStepLink } from "@/components/ui/NextStepLink";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { TabStrip } from "@/components/ui/TabStrip";
import { Plus, Trash2, Eye, EyeOff, Download, Wand2 } from "lucide-react";
import { nanoid } from "nanoid";
import type { Resume, ResumeTemplate } from "@/types/resume";
import type { UserProfile } from "@/types/profile";

const emptyResume = (): Resume => ({
  id: nanoid(), title: "My Resume", template: "chronological",
  content: { contactInfo: { name: "", phone: "", email: "", linkedin: "" }, profileOverview: "", experience: [], education: [], skills: [], certifications: [] },
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
});

const emptyExperience = () => ({ title: "", company: "", location: "", dates: "", bullets: [""] });
const emptyEducation = () => ({ school: "", degree: "", location: "", dates: "" });

export default function ResumeBuilderPage() {
  const { t } = useLanguage();
  const storage = useStorage();
  const [resume, setResume] = useState<Resume>(emptyResume());
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const { saved, showSaved } = useSaveIndicator();
  const { exportResume, exporting } = usePdfExport();
  const { toast } = useToast();

  const setContent = useCallback((patch: Partial<Resume["content"]>) => {
    setResume((r) => ({ ...r, content: { ...r.content, ...patch } }));
  }, []);

  const isDirty = useRef(false);

  useEffect(() => {
    Promise.all([storage.getResumes(), storage.getProfile()])
      .then(([savedResumes, savedProfile]) => {
        // Filter out corrupted resume objects that lack required structure
        const validResumes = (savedResumes ?? []).filter(
          (r): r is Resume =>
            r != null &&
            typeof r === "object" &&
            typeof r.id === "string" &&
            r.content != null &&
            typeof r.content === "object" &&
            r.content.contactInfo != null
        );
        setResumes(validResumes);
        setProfile(savedProfile);
        if (validResumes.length > 0) { setResume(validResumes[0]); setActiveId(validResumes[0].id); }
      })
      .catch(() => toast(t("common.error"), "error"))
      .finally(() => setInitialLoading(false));
  }, [storage, toast, t]);

  // Warn before navigating away with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty.current) { e.preventDefault(); }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // Mark dirty on any resume content change (after initial load)
  const setContentWithDirty = useCallback((patch: Partial<Resume["content"]>) => {
    isDirty.current = true;
    setContent(patch);
  }, [setContent]);

  const save = useCallback(async () => {
    try {
      const updated = { ...resume, updatedAt: new Date().toISOString() };
      await storage.saveResume(updated);
      setResume(updated);
      setResumes(await storage.getResumes());
      isDirty.current = false;
      showSaved();
      toast(t("resumes.builder.resumeSaved"));
    } catch { toast(t("resumes.builder.saveFailed"), "error"); }
  }, [storage, resume, showSaved, toast, t]);

  // Ctrl/Cmd+S keyboard shortcut to save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s" && !e.isComposing) {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  function updateContact(field: keyof Resume["content"]["contactInfo"], value: string) {
    isDirty.current = true;
    setResume((r) => ({ ...r, content: { ...r.content, contactInfo: { ...r.content.contactInfo, [field]: value } } }));
  }

  function updateExperience(index: number, field: string, value: string) {
    const exp = [...resume.content.experience];
    exp[index] = { ...exp[index], [field]: value };
    setContentWithDirty({ experience: exp });
  }

  function updateBullet(expIdx: number, bIdx: number, value: string) {
    const exp = [...resume.content.experience];
    const bullets = [...exp[expIdx].bullets];
    bullets[bIdx] = value;
    exp[expIdx] = { ...exp[expIdx], bullets };
    setContentWithDirty({ experience: exp });
  }

  function addBullet(expIdx: number) {
    const exp = [...resume.content.experience];
    exp[expIdx] = { ...exp[expIdx], bullets: [...exp[expIdx].bullets, ""] };
    setContentWithDirty({ experience: exp });
  }

  function removeBullet(expIdx: number, bIdx: number) {
    const exp = [...resume.content.experience];
    const bullets = exp[expIdx].bullets.filter((_, i) => i !== bIdx);
    exp[expIdx] = { ...exp[expIdx], bullets: bullets.length ? bullets : [""] };
    setContentWithDirty({ experience: exp });
  }

  function addExperience() { setContentWithDirty({ experience: [...resume.content.experience, emptyExperience()] }); }
  function removeExperience(i: number) { setContentWithDirty({ experience: resume.content.experience.filter((_, idx) => idx !== i) }); }

  function updateEducation(index: number, field: string, value: string) {
    const edu = [...resume.content.education];
    edu[index] = { ...edu[index], [field]: value };
    setContentWithDirty({ education: edu });
  }

  function addEducation() { setContentWithDirty({ education: [...resume.content.education, emptyEducation()] }); }
  function removeEducation(i: number) { setContentWithDirty({ education: resume.content.education.filter((_, idx) => idx !== i) }); }

  function autoPopulateFromProfile() {
    if (!profile) return;
    const c = resume.content;
    setContentWithDirty({
      profileOverview: profile.brandStatement || profile.powerStatement || c.profileOverview,
      skills: profile.skills?.map((s) => s.name) ?? c.skills,
    });
  }

  function addSkill(skill: string) {
    if (!skill.trim() || resume.content.skills.includes(skill.trim())) return;
    setContentWithDirty({ skills: [...resume.content.skills, skill.trim()] });
  }
  function removeSkill(i: number) { setContentWithDirty({ skills: resume.content.skills.filter((_, idx) => idx !== i) }); }

  function newResume() { const r = emptyResume(); setResume(r); setActiveId(r.id); isDirty.current = false; }
  function switchResume(id: string) {
    const found = resumes.find((r) => r.id === id);
    if (found) { setResume(found); setActiveId(found.id); isDirty.current = false; }
  }
  async function deleteResume(id: string) {
    if (resumes.length <= 1) {
      toast(t("resumes.builder.needOneResume"), "warning");
      return;
    }
    try {
      await storage.deleteResume(id);
      const remaining = await storage.getResumes();
      setResumes(remaining);
      if (resume.id === id) {
        const next = remaining[0] || emptyResume();
        setResume(next);
        setActiveId(next.id);
      }
      isDirty.current = false;
      toast(t("resumes.builder.resumeDeleted"));
    } catch {
      toast(t("resumes.builder.saveFailed"), "error");
    }
  }

  if (initialLoading) {
    return (
      <div className="space-y-4 py-8">
        <div className="h-6 w-48 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-64 animate-pulse rounded bg-neutral-100" />
        <div className="h-40 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb href="/resumes" label={t("resumes.title")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("resumes.builder.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">{t("resumes.builder.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <SavedIndicator visible={saved} />
          <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)} className="md:hidden">
            {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showPreview ? t("common.edit") : t("common.preview")}
          </Button>
        </div>
      </div>

      <TabStrip
        tabs={resumes.map((r) => ({ id: r.id, label: r.title }))}
        activeId={resume.id}
        onSelect={switchResume}
        onAdd={newResume}
      />

      {profile?.skills?.length || profile?.brandStatement ? (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
          <span className="text-sm text-primary-700">{t("resumes.builder.autoFillPrompt")}</span>
          <Button variant="secondary" size="sm" onClick={autoPopulateFromProfile}><Wand2 className="mr-1 h-4 w-4" /> {t("resumes.builder.autoFill")}</Button>
        </div>
      ) : (
        <Callout type="tip" className="mb-4">{t("resumes.builder.noDataCallout")}</Callout>
      )}

      <div className="flex flex-col gap-6 md:flex-row">
        <div className={`flex-1 space-y-6 ${showPreview ? "hidden md:block" : ""}`}>
          <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label={t("resumes.builder.resumeTitle")} value={resume.title} onChange={(e) => setResume({ ...resume, title: e.target.value })} placeholder={t("resumes.builder.resumeTitlePlaceholder")} />
              <Select label={t("resumes.builder.template")} value={resume.template} onChange={(e) => setResume({ ...resume, template: e.target.value as ResumeTemplate })}>
                  <option value="chronological">{t("resumes.builder.chronological")}</option>
                  <option value="functional">{t("resumes.builder.functional")}</option>
                  <option value="combination">{t("resumes.builder.combination")}</option>
              </Select>
            </div>
          </div>

          <ContactInfoSection contactInfo={resume.content.contactInfo} onChange={updateContact} />

          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold text-neutral-800">{t("resumes.builder.profileOverview")}</h2>
            <p className="mb-3 text-sm text-neutral-500">{t("resumes.builder.profileDesc")}</p>
            <Textarea value={resume.content.profileOverview} onChange={(e) => setContentWithDirty({ profileOverview: e.target.value })} placeholder={t("resumes.builder.profilePlaceholder")} rows={4} />
          </section>

          <ExperienceSection experience={resume.content.experience} onUpdate={updateExperience} onUpdateBullet={updateBullet} onAddBullet={addBullet} onRemoveBullet={removeBullet} onAdd={addExperience} onRemove={removeExperience} />

          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">{t("resumes.builder.education")}</h2>
              <Button variant="ghost" size="sm" onClick={addEducation}><Plus className="mr-1 h-4 w-4" /> {t("common.add")}</Button>
            </div>
            {resume.content.education.length === 0 && <p className="text-sm text-neutral-400 italic">{t("resumes.builder.educationDesc")}</p>}
            {resume.content.education.map((edu, i) => (
              <div key={i} className="mb-3 rounded-lg border border-neutral-100 p-4 last:mb-0">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-600">{t("resumes.builder.educationN").replace("{n}", String(i + 1))}</span>
                  <button onClick={() => removeEducation(i)} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg p-2 text-neutral-400 hover:text-error hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400" aria-label={`${t("common.remove")} ${t("resumes.builder.educationN").replace("{n}", String(i + 1))}`}><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input placeholder={t("resumes.builder.schoolPlaceholder")} value={edu.school} onChange={(e) => updateEducation(i, "school", e.target.value)} />
                  <Input placeholder={t("resumes.builder.degreePlaceholder")} value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} />
                  <Input placeholder={t("resumes.builder.locationPlaceholder")} value={edu.location} onChange={(e) => updateEducation(i, "location", e.target.value)} />
                  <Input placeholder={t("resumes.builder.datesPlaceholder")} helperText={t("resumes.builder.datesExample")} value={edu.dates} onChange={(e) => updateEducation(i, "dates", e.target.value)} />
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-neutral-800">{t("resumes.builder.skills")}</h2>
            <div className="mb-3 flex flex-wrap gap-2">
              {resume.content.skills.map((skill, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm text-primary-700">
                  {skill}
                  <button onClick={() => removeSkill(i)} className="ml-0.5 p-1 rounded-full hover:text-error hover:bg-red-50 min-w-[28px] min-h-[28px] flex items-center justify-center" aria-label={`${t("common.remove")} ${skill}`}><Trash2 className="h-3.5 w-3.5" /></button>
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input placeholder={t("resumes.builder.addSkillPlaceholder")} helperText={t("resumes.builder.skillExample")} value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); setSkillInput(""); } }} className="flex-1" />
              <Button variant="secondary" size="md" onClick={() => { addSkill(skillInput); setSkillInput(""); }} className="w-full sm:w-auto">{t("common.add")}</Button>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {resumes.length > 1 && (
              <button
                onClick={() => { if (window.confirm(t("resumes.builder.deleteResumeConfirm").replace("{title}", resume.title))) deleteResume(resume.id); }}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-neutral-400 hover:text-error hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" /> {t("resumes.builder.deleteResume")}
              </button>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:ml-auto">
              <Button variant="secondary" size="lg" onClick={() => exportResume(resume)} disabled={exporting} className="w-full sm:w-auto">
                <Download className="mr-1.5 h-4 w-4" /> {exporting ? t("common.exporting") : t("common.exportPdf")}
              </Button>
              <Button onClick={save} size="lg" className="w-full sm:w-auto">{t("resumes.builder.saveResume")}</Button>
            </div>
          </div>
        </div>

        <div className={`w-full md:w-[320px] lg:w-[400px] xl:w-[480px] shrink-0 ${showPreview ? "" : "hidden md:block"}`}>
          <ResumePreview resume={resume} />
        </div>
      </div>

      <NextStepLink href="/resumes/cover-letter" labelKey="resumes.sections.coverLetter.title" />
    </div>
  );
}
