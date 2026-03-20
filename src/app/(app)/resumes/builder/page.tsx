"use client";

import { useState, useEffect, useCallback } from "react";
import { useStorage } from "@/hooks/useStorage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { CheckCircle, Plus, Trash2, Eye, EyeOff, Download, Wand2 } from "lucide-react";
import { nanoid } from "nanoid";
import type { Resume, ResumeContent, ResumeTemplate } from "@/types/resume";
import type { UserProfile } from "@/types/profile";

const emptyResume = (): Resume => ({
  id: nanoid(),
  title: "My Resume",
  template: "chronological",
  content: {
    contactInfo: { name: "", phone: "", email: "", linkedin: "" },
    profileOverview: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const emptyExperience = () => ({
  title: "",
  company: "",
  location: "",
  dates: "",
  bullets: [""],
});

const emptyEducation = () => ({
  school: "",
  degree: "",
  location: "",
  dates: "",
});

export default function ResumeBuilderPage() {
  const storage = useStorage();
  const [resume, setResume] = useState<Resume>(emptyResume());
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([storage.getResumes(), storage.getProfile()]).then(
      ([loadedResumes, loadedProfile]) => {
        setResumes(loadedResumes);
        setProfile(loadedProfile);
        if (loadedResumes.length > 0) {
          setResume(loadedResumes[0]);
          setActiveId(loadedResumes[0].id);
        }
      }
    );
  }, [storage]);

  const save = useCallback(async () => {
    const updated = { ...resume, updatedAt: new Date().toISOString() };
    await storage.saveResume(updated);
    setResume(updated);
    const all = await storage.getResumes();
    setResumes(all);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [storage, resume]);

  function updateContact(field: keyof Resume["content"]["contactInfo"], value: string) {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        contactInfo: { ...resume.content.contactInfo, [field]: value },
      },
    });
  }

  function updateExperience(index: number, field: string, value: string) {
    const exp = [...resume.content.experience];
    exp[index] = { ...exp[index], [field]: value };
    setResume({ ...resume, content: { ...resume.content, experience: exp } });
  }

  function updateBullet(expIndex: number, bulletIndex: number, value: string) {
    const exp = [...resume.content.experience];
    const bullets = [...exp[expIndex].bullets];
    bullets[bulletIndex] = value;
    exp[expIndex] = { ...exp[expIndex], bullets };
    setResume({ ...resume, content: { ...resume.content, experience: exp } });
  }

  function addBullet(expIndex: number) {
    const exp = [...resume.content.experience];
    exp[expIndex] = { ...exp[expIndex], bullets: [...exp[expIndex].bullets, ""] };
    setResume({ ...resume, content: { ...resume.content, experience: exp } });
  }

  function removeBullet(expIndex: number, bulletIndex: number) {
    const exp = [...resume.content.experience];
    const bullets = exp[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    exp[expIndex] = { ...exp[expIndex], bullets: bullets.length ? bullets : [""] };
    setResume({ ...resume, content: { ...resume.content, experience: exp } });
  }

  function addExperience() {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        experience: [...resume.content.experience, emptyExperience()],
      },
    });
  }

  function removeExperience(index: number) {
    const exp = resume.content.experience.filter((_, i) => i !== index);
    setResume({ ...resume, content: { ...resume.content, experience: exp } });
  }

  function updateEducation(index: number, field: string, value: string) {
    const edu = [...resume.content.education];
    edu[index] = { ...edu[index], [field]: value };
    setResume({ ...resume, content: { ...resume.content, education: edu } });
  }

  function addEducation() {
    setResume({
      ...resume,
      content: {
        ...resume.content,
        education: [...resume.content.education, emptyEducation()],
      },
    });
  }

  function removeEducation(index: number) {
    const edu = resume.content.education.filter((_, i) => i !== index);
    setResume({ ...resume, content: { ...resume.content, education: edu } });
  }

  function autoPopulateFromProfile() {
    if (!profile) return;
    const c = resume.content;
    setResume({
      ...resume,
      content: {
        ...c,
        profileOverview: profile.brandStatement || profile.powerStatement || c.profileOverview,
        skills: profile.skills?.map((s) => s.name) ?? c.skills,
      },
    });
  }

  function addSkill(skill: string) {
    if (!skill.trim() || resume.content.skills.includes(skill.trim())) return;
    setResume({
      ...resume,
      content: { ...resume.content, skills: [...resume.content.skills, skill.trim()] },
    });
  }

  function removeSkill(index: number) {
    const skills = resume.content.skills.filter((_, i) => i !== index);
    setResume({ ...resume, content: { ...resume.content, skills } });
  }

  function newResume() {
    const r = emptyResume();
    setResume(r);
    setActiveId(r.id);
  }

  function switchResume(id: string) {
    const found = resumes.find((r) => r.id === id);
    if (found) {
      setResume(found);
      setActiveId(found.id);
    }
  }

  const [skillInput, setSkillInput] = useState("");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Resume Builder</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Build a professional resume step by step.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <div className="flex items-center gap-1.5 text-sm text-success">
              <CheckCircle className="h-4 w-4" />
              Saved
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="md:hidden"
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {/* Resume tabs */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto">
        {resumes.map((r) => (
          <button
            key={r.id}
            onClick={() => switchResume(r.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
              r.id === resume.id
                ? "bg-primary-400 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {r.title}
          </button>
        ))}
        <button
          onClick={newResume}
          className="flex items-center gap-1 rounded-lg border border-dashed border-neutral-300 px-3 py-1.5 text-sm text-neutral-500 hover:border-primary-300"
        >
          <Plus className="h-3.5 w-3.5" />
          New
        </button>
      </div>

      {/* Auto-populate banner */}
      {profile?.skills?.length || profile?.brandStatement ? (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
          <span className="text-sm text-primary-700">
            Auto-fill skills and profile from your Know Yourself data?
          </span>
          <Button variant="secondary" size="sm" onClick={autoPopulateFromProfile}>
            <Wand2 className="mr-1 h-4 w-4" />
            Auto-Fill
          </Button>
        </div>
      ) : (
        <Callout type="tip" className="mb-4">
          Complete the <strong>Know Yourself</strong> tools first to auto-populate your skills and profile overview here.
        </Callout>
      )}

      <div className="flex gap-6">
        {/* Form panel */}
        <div className={`flex-1 space-y-6 ${showPreview ? "hidden md:block" : ""}`}>
          {/* Resume title + template */}
          <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Resume Title"
                value={resume.title}
                onChange={(e) => setResume({ ...resume, title: e.target.value })}
                placeholder="e.g., Marketing Resume"
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700">Template</label>
                <select
                  value={resume.template}
                  onChange={(e) =>
                    setResume({ ...resume, template: e.target.value as ResumeTemplate })
                  }
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm"
                >
                  <option value="chronological">Chronological</option>
                  <option value="functional">Functional</option>
                  <option value="combination">Combination</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-neutral-800">Contact Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Full Name" value={resume.content.contactInfo.name} onChange={(e) => updateContact("name", e.target.value)} placeholder="First Last" />
              <Input label="Phone" value={resume.content.contactInfo.phone} onChange={(e) => updateContact("phone", e.target.value)} placeholder="(555) 555-5555" />
              <Input label="Email" value={resume.content.contactInfo.email} onChange={(e) => updateContact("email", e.target.value)} placeholder="name@email.com" />
              <Input label="LinkedIn (optional)" value={resume.content.contactInfo.linkedin ?? ""} onChange={(e) => updateContact("linkedin", e.target.value)} placeholder="linkedin.com/in/yourname" />
            </div>
          </section>

          {/* Profile Overview */}
          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold text-neutral-800">Profile Overview</h2>
            <p className="mb-3 text-sm text-neutral-500">
              A branding statement, summary, or list of qualifications. This is the top third of your resume.
            </p>
            <Textarea
              value={resume.content.profileOverview}
              onChange={(e) =>
                setResume({ ...resume, content: { ...resume.content, profileOverview: e.target.value } })
              }
              placeholder="e.g., Detail-oriented computer science graduate skilled in full-stack development..."
              rows={4}
            />
          </section>

          {/* Experience */}
          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">Experience</h2>
              <Button variant="ghost" size="sm" onClick={addExperience}>
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </div>
            {resume.content.experience.length === 0 && (
              <p className="text-sm text-neutral-400 italic">
                No experience added yet. Include jobs, internships, volunteer work, and campus roles.
              </p>
            )}
            {resume.content.experience.map((exp, i) => (
              <div key={i} className="mb-4 rounded-lg border border-neutral-100 p-4 last:mb-0">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-600">Position {i + 1}</span>
                  <button onClick={() => removeExperience(i)} className="text-neutral-400 hover:text-error">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input placeholder="Job Title" value={exp.title} onChange={(e) => updateExperience(i, "title", e.target.value)} />
                  <Input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
                  <Input placeholder="Location" value={exp.location} onChange={(e) => updateExperience(i, "location", e.target.value)} />
                  <Input placeholder="Dates (e.g., 06/2024 - Present)" value={exp.dates} onChange={(e) => updateExperience(i, "dates", e.target.value)} />
                </div>
                <div className="mt-3">
                  <label className="mb-1.5 block text-sm font-medium text-neutral-600">
                    Bullet Points (use result-oriented statements)
                  </label>
                  {exp.bullets.map((bullet, j) => (
                    <div key={j} className="mb-2 flex items-start gap-2">
                      <span className="mt-2.5 text-neutral-400">&#8226;</span>
                      <Input
                        className="flex-1"
                        placeholder="e.g., Increased customer satisfaction by 20% through..."
                        value={bullet}
                        onChange={(e) => updateBullet(i, j, e.target.value)}
                      />
                      {exp.bullets.length > 1 && (
                        <button onClick={() => removeBullet(i, j)} className="mt-2 text-neutral-400 hover:text-error">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addBullet(i)} className="text-xs font-medium text-primary-400 hover:text-primary-500">
                    + Add bullet
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Education */}
          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">Education</h2>
              <Button variant="ghost" size="sm" onClick={addEducation}>
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </div>
            {resume.content.education.length === 0 && (
              <p className="text-sm text-neutral-400 italic">Add your degrees, certificates, and training.</p>
            )}
            {resume.content.education.map((edu, i) => (
              <div key={i} className="mb-3 rounded-lg border border-neutral-100 p-4 last:mb-0">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-600">Education {i + 1}</span>
                  <button onClick={() => removeEducation(i)} className="text-neutral-400 hover:text-error">
                    <Trash2 className="h-4 w-4" />
                  </button>
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

          {/* Skills */}
          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-neutral-800">Skills</h2>
            <div className="mb-3 flex flex-wrap gap-2">
              {resume.content.skills.map((skill, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm text-primary-700">
                  {skill}
                  <button onClick={() => removeSkill(i)} className="ml-0.5 hover:text-error">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(skillInput);
                    setSkillInput("");
                  }
                }}
                className="flex-1"
              />
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  addSkill(skillInput);
                  setSkillInput("");
                }}
              >
                Add
              </Button>
            </div>
          </section>

          <div className="flex justify-end">
            <Button onClick={save} size="lg">
              Save Resume
            </Button>
          </div>
        </div>

        {/* Preview panel */}
        <div
          className={`w-full md:w-[400px] lg:w-[480px] shrink-0 ${
            showPreview ? "" : "hidden md:block"
          }`}
        >
          <div className="sticky top-20 rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-neutral-500">Live Preview</h3>
            </div>
            <div className="space-y-4 text-[11px] leading-relaxed">
              {/* Header */}
              <div className="text-center">
                <div className="text-base font-bold text-neutral-900">
                  {resume.content.contactInfo.name || "Your Name"}
                </div>
                <div className="text-neutral-500">
                  {[
                    resume.content.contactInfo.phone,
                    resume.content.contactInfo.email,
                    resume.content.contactInfo.linkedin,
                  ]
                    .filter(Boolean)
                    .join(" | ") || "Phone | Email | LinkedIn"}
                </div>
              </div>

              {/* Profile */}
              {resume.content.profileOverview && (
                <div>
                  <div className="mb-1 border-b border-neutral-200 pb-0.5 text-xs font-bold uppercase tracking-wide text-neutral-700">
                    Profile
                  </div>
                  <p className="text-neutral-600">{resume.content.profileOverview}</p>
                </div>
              )}

              {/* Experience */}
              {resume.content.experience.length > 0 && (
                <div>
                  <div className="mb-1 border-b border-neutral-200 pb-0.5 text-xs font-bold uppercase tracking-wide text-neutral-700">
                    Experience
                  </div>
                  {resume.content.experience.map((exp, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-neutral-800">
                          {exp.title || "Job Title"}{exp.company ? ` | ${exp.company}` : ""}
                        </span>
                        <span className="text-neutral-400">{exp.dates}</span>
                      </div>
                      {exp.location && <div className="text-neutral-400">{exp.location}</div>}
                      <ul className="mt-0.5 space-y-0.5">
                        {exp.bullets.filter(Boolean).map((b, j) => (
                          <li key={j} className="flex gap-1">
                            <span>&#8226;</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {resume.content.education.length > 0 && (
                <div>
                  <div className="mb-1 border-b border-neutral-200 pb-0.5 text-xs font-bold uppercase tracking-wide text-neutral-700">
                    Education
                  </div>
                  {resume.content.education.map((edu, i) => (
                    <div key={i} className="mb-1 flex justify-between">
                      <div>
                        <span className="font-semibold">{edu.school || "School"}</span>
                        {edu.degree && <span className="text-neutral-500"> — {edu.degree}</span>}
                      </div>
                      <span className="text-neutral-400">{edu.dates}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {resume.content.skills.length > 0 && (
                <div>
                  <div className="mb-1 border-b border-neutral-200 pb-0.5 text-xs font-bold uppercase tracking-wide text-neutral-700">
                    Skills
                  </div>
                  <p className="text-neutral-600">{resume.content.skills.join(" | ")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
