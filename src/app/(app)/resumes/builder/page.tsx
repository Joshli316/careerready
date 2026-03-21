"use client";

import { useState, useEffect, useCallback } from "react";
import { useStorage } from "@/hooks/useStorage";
import { useSaveIndicator } from "@/hooks/useSaveIndicator";
import { usePdfExport } from "@/hooks/usePdfExport";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { ContactInfoSection } from "./components/ContactInfoSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ResumePreview } from "./components/ResumePreview";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
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
  const storage = useStorage();
  const [resume, setResume] = useState<Resume>(emptyResume());
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const { saved, showSaved } = useSaveIndicator();
  const { exportResume, exporting } = usePdfExport();
  const { toast } = useToast();

  const setContent = useCallback((patch: Partial<Resume["content"]>) => {
    setResume((r) => ({ ...r, content: { ...r.content, ...patch } }));
  }, []);

  useEffect(() => {
    Promise.all([storage.getResumes(), storage.getProfile()]).then(([lr, lp]) => {
      setResumes(lr);
      setProfile(lp);
      if (lr.length > 0) { setResume(lr[0]); setActiveId(lr[0].id); }
    });
  }, [storage]);

  const save = useCallback(async () => {
    try {
      const updated = { ...resume, updatedAt: new Date().toISOString() };
      await storage.saveResume(updated);
      setResume(updated);
      setResumes(await storage.getResumes());
      showSaved();
      toast("Resume saved successfully");
    } catch { toast("Failed to save resume", "error"); }
  }, [storage, resume, showSaved, toast]);

  function updateContact(field: keyof Resume["content"]["contactInfo"], value: string) {
    setResume((r) => ({ ...r, content: { ...r.content, contactInfo: { ...r.content.contactInfo, [field]: value } } }));
  }

  function updateExperience(index: number, field: string, value: string) {
    const exp = [...resume.content.experience];
    exp[index] = { ...exp[index], [field]: value };
    setContent({ experience: exp });
  }

  function updateBullet(expIdx: number, bIdx: number, value: string) {
    const exp = [...resume.content.experience];
    const bullets = [...exp[expIdx].bullets];
    bullets[bIdx] = value;
    exp[expIdx] = { ...exp[expIdx], bullets };
    setContent({ experience: exp });
  }

  function addBullet(expIdx: number) {
    const exp = [...resume.content.experience];
    exp[expIdx] = { ...exp[expIdx], bullets: [...exp[expIdx].bullets, ""] };
    setContent({ experience: exp });
  }

  function removeBullet(expIdx: number, bIdx: number) {
    const exp = [...resume.content.experience];
    const bullets = exp[expIdx].bullets.filter((_, i) => i !== bIdx);
    exp[expIdx] = { ...exp[expIdx], bullets: bullets.length ? bullets : [""] };
    setContent({ experience: exp });
  }

  function addExperience() { setContent({ experience: [...resume.content.experience, emptyExperience()] }); }
  function removeExperience(i: number) { setContent({ experience: resume.content.experience.filter((_, idx) => idx !== i) }); }

  function updateEducation(index: number, field: string, value: string) {
    const edu = [...resume.content.education];
    edu[index] = { ...edu[index], [field]: value };
    setContent({ education: edu });
  }

  function addEducation() { setContent({ education: [...resume.content.education, emptyEducation()] }); }
  function removeEducation(i: number) { setContent({ education: resume.content.education.filter((_, idx) => idx !== i) }); }

  function autoPopulateFromProfile() {
    if (!profile) return;
    const c = resume.content;
    setContent({
      profileOverview: profile.brandStatement || profile.powerStatement || c.profileOverview,
      skills: profile.skills?.map((s) => s.name) ?? c.skills,
    });
  }

  function addSkill(skill: string) {
    if (!skill.trim() || resume.content.skills.includes(skill.trim())) return;
    setContent({ skills: [...resume.content.skills, skill.trim()] });
  }
  function removeSkill(i: number) { setContent({ skills: resume.content.skills.filter((_, idx) => idx !== i) }); }

  function newResume() { const r = emptyResume(); setResume(r); setActiveId(r.id); }
  function switchResume(id: string) {
    const found = resumes.find((r) => r.id === id);
    if (found) { setResume(found); setActiveId(found.id); }
  }

  return (
    <div>
      <Breadcrumb href="/resumes" label="Resumes" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Resume Builder</h1>
          <p className="mt-1 text-sm text-neutral-500">Build a professional resume step by step.</p>
        </div>
        <div className="flex items-center gap-2">
          <SavedIndicator visible={saved} />
          <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)} className="md:hidden">
            {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 overflow-x-auto">
        {resumes.map((r) => (
          <button key={r.id} onClick={() => switchResume(r.id)} className={`rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap ${r.id === resume.id ? "bg-primary-400 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}>{r.title}</button>
        ))}
        <button onClick={newResume} className="flex items-center gap-1 rounded-lg border border-dashed border-neutral-300 px-3 py-1.5 text-sm text-neutral-500 hover:border-primary-300"><Plus className="h-3.5 w-3.5" /> New</button>
      </div>

      {profile?.skills?.length || profile?.brandStatement ? (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
          <span className="text-sm text-primary-700">Auto-fill skills and profile from your Know Yourself data?</span>
          <Button variant="secondary" size="sm" onClick={autoPopulateFromProfile}><Wand2 className="mr-1 h-4 w-4" /> Auto-Fill</Button>
        </div>
      ) : (
        <Callout type="tip" className="mb-4">Complete the <strong>Know Yourself</strong> tools first to auto-populate your skills and profile overview here.</Callout>
      )}

      <div className="flex flex-col gap-6 md:flex-row">
        <div className={`flex-1 space-y-6 ${showPreview ? "hidden md:block" : ""}`}>
          <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Resume Title" value={resume.title} onChange={(e) => setResume({ ...resume, title: e.target.value })} placeholder="e.g., Marketing Resume" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">Template</label>
                <select value={resume.template} onChange={(e) => setResume({ ...resume, template: e.target.value as ResumeTemplate })} className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm">
                  <option value="chronological">Chronological</option>
                  <option value="functional">Functional</option>
                  <option value="combination">Combination</option>
                </select>
              </div>
            </div>
          </div>

          <ContactInfoSection contactInfo={resume.content.contactInfo} onChange={updateContact} />

          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold text-neutral-800">Profile Overview</h2>
            <p className="mb-3 text-sm text-neutral-500">A branding statement, summary, or list of qualifications. This is the top third of your resume.</p>
            <Textarea value={resume.content.profileOverview} onChange={(e) => setContent({ profileOverview: e.target.value })} placeholder="e.g., Detail-oriented computer science graduate skilled in full-stack development..." rows={4} />
          </section>

          <ExperienceSection experience={resume.content.experience} onUpdate={updateExperience} onUpdateBullet={updateBullet} onAddBullet={addBullet} onRemoveBullet={removeBullet} onAdd={addExperience} onRemove={removeExperience} />

          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">Education</h2>
              <Button variant="ghost" size="sm" onClick={addEducation}><Plus className="mr-1 h-4 w-4" /> Add</Button>
            </div>
            {resume.content.education.length === 0 && <p className="text-sm text-neutral-400 italic">Add your degrees, certificates, and training.</p>}
            {resume.content.education.map((edu, i) => (
              <div key={i} className="mb-3 rounded-lg border border-neutral-100 p-4 last:mb-0">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-600">Education {i + 1}</span>
                  <button onClick={() => removeEducation(i)} className="text-neutral-400 hover:text-error"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input placeholder="School / Institution" value={edu.school} onChange={(e) => updateEducation(i, "school", e.target.value)} />
                  <Input placeholder="Degree / Certificate" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} />
                  <Input placeholder="Location" value={edu.location} onChange={(e) => updateEducation(i, "location", e.target.value)} />
                  <Input placeholder="Dates" value={edu.dates} onChange={(e) => updateEducation(i, "dates", e.target.value)} />
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-neutral-800">Skills</h2>
            <div className="mb-3 flex flex-wrap gap-2">
              {resume.content.skills.map((skill, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm text-primary-700">
                  {skill}
                  <button onClick={() => removeSkill(i)} className="ml-0.5 hover:text-error"><Trash2 className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add a skill..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); setSkillInput(""); } }} className="flex-1" />
              <Button variant="secondary" size="md" onClick={() => { addSkill(skillInput); setSkillInput(""); }}>Add</Button>
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="lg" onClick={() => exportResume(resume)} disabled={exporting}>
              <Download className="mr-1.5 h-4 w-4" /> {exporting ? "Exporting..." : "Export PDF"}
            </Button>
            <Button onClick={save} size="lg">Save Resume</Button>
          </div>
        </div>

        <div className={`w-full md:w-[400px] lg:w-[480px] shrink-0 ${showPreview ? "" : "hidden md:block"}`}>
          <ResumePreview resume={resume} />
        </div>
      </div>
    </div>
  );
}
