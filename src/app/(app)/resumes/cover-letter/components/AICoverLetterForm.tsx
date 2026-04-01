"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { Sparkles, ChevronDown, ChevronUp, FileText } from "lucide-react";
import type { Resume } from "@/types/resume";
import { resumeToText } from "./resumeToText";
import { useLanguage } from "@/lib/i18n/LanguageContext";

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
  const { t } = useLanguage();
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
      const confirmed = window.confirm(t("resumes.aiCoverLetter.replaceConfirm"));
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
        const errBody = await res.json().catch(() => ({ error: t("resumes.aiCoverLetter.failedDefault") })) as { error?: string };
        toast(errBody.error || t("resumes.aiCoverLetter.failedDefault"), "error");
        return;
      }

      const { result, remaining } = await res.json() as { result: { recipientName?: string; opening?: string; body?: string; closing?: string }; remaining?: number };
      onGenerated({
        recipientName: result.recipientName || t("resumes.coverLetter.hiringManagerName"),
        company: company.trim(),
        opening: result.opening || "",
        body: result.body || "",
        closing: result.closing || "",
      });

      const remainingMsg = typeof remaining === "number" ? ` (${t("resumes.aiCoverLetter.aiUsesLeft").replace("{remaining}", String(remaining))})` : "";
      toast(`${t("resumes.aiCoverLetter.successMessage")}${remainingMsg}`, "success");
      setCollapsed(true);
    } catch {
      toast(t("resumes.aiCoverLetter.failedGeneric"), "error");
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
          <h2 className="text-lg font-semibold text-neutral-800">{t("resumes.aiCoverLetter.title")}</h2>
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
            {t("resumes.aiCoverLetter.description")}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t("resumes.aiCoverLetter.companyLabel")}
              placeholder={t("resumes.aiCoverLetter.companyPlaceholder")}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Input
              label={t("resumes.aiCoverLetter.jobTitleLabel")}
              placeholder={t("resumes.aiCoverLetter.jobTitlePlaceholder")}
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <Textarea
            label={t("resumes.aiCoverLetter.jdLabel")}
            placeholder={t("resumes.aiCoverLetter.jdPlaceholder")}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            className="bg-white"
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              {t("resumes.aiCoverLetter.yourResume")}
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
                      <div className="font-medium">{savedResume.title || t("resumes.aiCoverLetter.savedResume")}</div>
                      <div className="text-xs text-neutral-400">
                        {savedResume.content.contactInfo.name || t("resumes.aiCoverLetter.noName")} &middot;{" "}
                        {savedResume.content.skills.length} {t("resumes.aiCoverLetter.skills")} &middot;{" "}
                        {savedResume.content.experience.length} {savedResume.content.experience.length !== 1 ? t("resumes.aiCoverLetter.experiences") : t("resumes.aiCoverLetter.experience")}
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
                  {t("resumes.aiCoverLetter.pasteText")}
                </button>
              </div>
            )}

            {(resumeSource === "pasted" || !savedResume) && (
              <Textarea
                placeholder={t("resumes.aiCoverLetter.pastePlaceholder")}
                value={pastedResume}
                onChange={(e) => setPastedResume(e.target.value)}
                rows={6}
                className="bg-white"
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              {canGenerate ? t("resumes.aiCoverLetter.ready") : t("resumes.aiCoverLetter.notReady")}
            </span>
            <Button
              variant="ai"
              size="lg"
              onClick={generate}
              disabled={!canGenerate || generating}
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              {generating ? t("resumes.aiCoverLetter.generating") : t("resumes.aiCoverLetter.generateButton")}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
