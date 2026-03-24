"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { Sparkles, ChevronDown, ChevronUp, FileText } from "lucide-react";
import type { Resume } from "@/types/resume";
import { resumeToText } from "./resumeToText";

interface GeneratedResult {
  recipientName: string;
  company: string;
  opening: string;
  body: string;
  closing: string;
}

interface AICoverLetterFormProps {
  savedResume: Resume | null;
  hasExistingContent: boolean;
  onGenerated: (result: GeneratedResult) => void;
}

export function AICoverLetterForm({ savedResume, hasExistingContent, onGenerated }: AICoverLetterFormProps) {
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeSource, setResumeSource] = useState<"saved" | "pasted">(savedResume ? "saved" : "pasted");
  const [pastedResume, setPastedResume] = useState("");
  const [generating, setGenerating] = useState(false);

  const resumeText = resumeSource === "saved" && savedResume
    ? resumeToText(savedResume)
    : pastedResume;

  const canGenerate = jobDescription.trim().length > 0 && resumeText.trim().length > 0;

  async function generate() {
    if (!canGenerate) return;
    if (hasExistingContent) {
      const confirmed = window.confirm(
        "This will replace your current cover letter content. Continue?"
      );
      if (!confirmed) return;
    }
    setGenerating(true);

    try {
      const res = await fetch("/api/ai/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: jobTitle.trim(),
          company: company.trim(),
          jobDescription: jobDescription.trim(),
          resume: resumeText.trim(),
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: "Request failed" })) as { error?: string };
        toast(errBody.error || "Generation failed. Try again.", "error");
        return;
      }

      const { result, remaining } = await res.json() as { result: { recipientName?: string; opening?: string; body?: string; closing?: string }; remaining?: number };
      onGenerated({
        recipientName: result.recipientName || "Hiring Manager",
        company: company.trim(),
        opening: result.opening || "",
        body: result.body || "",
        closing: result.closing || "",
      });

      const remainingMsg = typeof remaining === "number" ? ` (${remaining} AI uses left today)` : "";
      toast(`Cover letter generated! Edit it below to make it yours.${remainingMsg}`, "success");
      setCollapsed(true);
    } catch {
      toast("Cover letter generation failed. Please try again.", "error");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section className="mb-6 rounded-xl border-l-4 border-l-ai-accent bg-purple-50 shadow-sm">
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-ai-accent" />
          <h2 className="text-lg font-semibold text-neutral-800">Generate with AI</h2>
        </div>
        {collapsed ? (
          <ChevronDown className="h-4 w-4 text-neutral-400" />
        ) : (
          <ChevronUp className="h-4 w-4 text-neutral-400" />
        )}
      </button>

      {!collapsed && (
        <div className="space-y-4 px-5 pb-5">
          <p className="text-sm text-neutral-600">
            Paste a job description and your resume. The AI writes a first draft that maps your experience to the job. Edit it before saving.
          </p>

          {/* Job details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Company Name"
              placeholder="e.g., Cloudflare"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Input
              label="Job Title"
              placeholder="e.g., Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          {/* Job description */}
          <Textarea
            label="Job Description"
            placeholder="Paste the full job posting here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            className="bg-white"
          />

          {/* Resume source */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Your Resume
            </label>

            {savedResume && (
              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => setResumeSource("saved")}
                  aria-pressed={resumeSource === "saved"}
                  className={`flex-1 rounded-lg border p-3 text-left text-sm transition-colors ${
                    resumeSource === "saved"
                      ? "border-ai-accent bg-white text-neutral-800"
                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0" />
                    <div>
                      <div className="font-medium">{savedResume.title || "Saved Resume"}</div>
                      <div className="text-xs text-neutral-400">
                        {savedResume.content.contactInfo.name || "No name"} &middot;{" "}
                        {savedResume.content.skills.length} skills &middot;{" "}
                        {savedResume.content.experience.length} experience{savedResume.content.experience.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setResumeSource("pasted")}
                  aria-pressed={resumeSource === "pasted"}
                  className={`rounded-lg border px-4 py-3 text-sm transition-colors ${
                    resumeSource === "pasted"
                      ? "border-ai-accent bg-white text-neutral-800"
                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  Paste text
                </button>
              </div>
            )}

            {(resumeSource === "pasted" || !savedResume) && (
              <Textarea
                placeholder="Paste your resume text here..."
                value={pastedResume}
                onChange={(e) => setPastedResume(e.target.value)}
                rows={6}
                className="bg-white"
              />
            )}
          </div>

          {/* Generate button */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              {canGenerate ? "Ready to generate" : "Add a job description and resume to continue"}
            </span>
            <Button
              variant="ai"
              size="lg"
              onClick={generate}
              disabled={!canGenerate || generating}
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              {generating ? "Generating..." : "Generate Cover Letter"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
