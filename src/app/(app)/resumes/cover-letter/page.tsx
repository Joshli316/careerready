"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useStorage } from "@/hooks/useStorage";
import { useSaveIndicator } from "@/hooks/useSaveIndicator";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Download, Eye, EyeOff } from "lucide-react";
import { nanoid } from "nanoid";
import { usePdfExport } from "@/hooks/usePdfExport";
import type { CoverLetter, Resume } from "@/types/resume";
import { AICoverLetterForm } from "./components/AICoverLetterForm";

export default function CoverLetterPage() {
  const { t } = useLanguage();
  const storage = useStorage();
  const [savedResume, setSavedResume] = useState<Resume | null>(null);
  const [letter, setLetter] = useState<CoverLetter>({
    id: nanoid(),
    title: "My Cover Letter",
    content: {
      recipientName: "",
      recipientTitle: "",
      company: "",
      address: "",
      opening: "",
      body: "",
      closing: "",
    },
    createdAt: new Date().toISOString(),
  });
  const { exportCoverLetter, exporting } = usePdfExport();
  const { saved, showSaved } = useSaveIndicator();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [profile, setProfile] = useState<{ brandStatement?: string; powerStatement?: string } | null>(null);

  useEffect(() => {
    Promise.all([storage.getCoverLetters(), storage.getProfile(), storage.getResumes()]).then(([letters, p, resumes]) => {
      if (letters.length > 0) setLetter(letters[0]);
      setProfile(p);
      if (resumes.length > 0) setSavedResume(resumes[0]);
    }).catch((err) => {
      console.error("[CoverLetter] Failed to load data:", err);
      toast(t("common.saveFailed"), "error");
    });
  }, [storage, toast, t]);

  const save = useCallback(async () => {
    try {
      await storage.saveCoverLetter(letter);
      showSaved();
      toast(t("resumes.coverLetter.savedSuccessfully"), "success");
    } catch {
      toast(t("resumes.coverLetter.saveFailed"), "error");
    }
  }, [storage, letter, showSaved, toast, t]);

  function updateContent(field: keyof CoverLetter["content"], value: string) {
    setLetter({ ...letter, content: { ...letter.content, [field]: value } });
  }

  return (
    <div>
      <Breadcrumb href="/resumes" label={t("resumes.title")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("resumes.coverLetter.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("resumes.coverLetter.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SavedIndicator visible={saved} />
          <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)} className="md:hidden">
            {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showPreview ? t("common.edit") : t("common.preview")}
          </Button>
        </div>
      </div>

      <Callout type="tip" className="mb-6">
        {t("resumes.coverLetter.callout")}
      </Callout>

      <AICoverLetterForm
        savedResume={savedResume}
        hasExistingContent={Boolean(letter.content.opening || letter.content.body || letter.content.closing)}
        onGenerated={(result) => {
          setLetter((prev) => ({
            ...prev,
            content: {
              ...prev.content,
              recipientName: result.recipientName || prev.content.recipientName,
              company: prev.content.company || result.company,
              opening: result.opening,
              body: result.body,
              closing: result.closing,
            },
          }));
        }}
      />

      <div className="flex flex-col gap-6 md:flex-row">
        <div className={`flex-1 space-y-6 ${showPreview ? "hidden md:block" : ""}`}>
          {/* Recipient */}
          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-neutral-800">{t("resumes.coverLetter.recipient")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label={t("resumes.coverLetter.hiringManagerName")} placeholder={t("resumes.coverLetter.hiringManagerPlaceholder")} value={letter.content.recipientName} onChange={(e) => updateContent("recipientName", e.target.value)} />
              <Input label={t("resumes.coverLetter.titleOptional")} placeholder={t("resumes.coverLetter.titlePlaceholder")} value={letter.content.recipientTitle} onChange={(e) => updateContent("recipientTitle", e.target.value)} />
              <Input label={t("resumes.coverLetter.company")} placeholder={t("resumes.coverLetter.companyPlaceholder")} value={letter.content.company} onChange={(e) => updateContent("company", e.target.value)} />
              <Input label={t("resumes.coverLetter.addressOptional")} placeholder={t("resumes.coverLetter.addressPlaceholder")} value={letter.content.address} onChange={(e) => updateContent("address", e.target.value)} />
            </div>
          </section>

          {/* Paragraph 1 */}
          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold text-neutral-800">{t("resumes.coverLetter.openingParagraph")}</h2>
            <p className="mb-3 text-sm text-neutral-500">
              {t("resumes.coverLetter.openingDesc")}
            </p>
            <Textarea
              value={letter.content.opening}
              onChange={(e) => updateContent("opening", e.target.value)}
              placeholder={t("resumes.coverLetter.openingPlaceholder")}
              rows={5}
            />
          </section>

          {/* Paragraph 2 */}
          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold text-neutral-800">{t("resumes.coverLetter.bodyParagraph")}</h2>
            <p className="mb-3 text-sm text-neutral-500">
              {t("resumes.coverLetter.bodyDesc")}
            </p>
            <Textarea
              value={letter.content.body}
              onChange={(e) => updateContent("body", e.target.value)}
              placeholder={t("resumes.coverLetter.bodyPlaceholder")}
              rows={6}
            />
          </section>

          {/* Paragraph 3 */}
          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold text-neutral-800">{t("resumes.coverLetter.closingParagraph")}</h2>
            <p className="mb-3 text-sm text-neutral-500">
              {t("resumes.coverLetter.closingDesc")}
            </p>
            <Textarea
              value={letter.content.closing}
              onChange={(e) => updateContent("closing", e.target.value)}
              placeholder={t("resumes.coverLetter.closingPlaceholder")}
              rows={4}
            />
          </section>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="lg" onClick={() => exportCoverLetter(letter, savedResume?.content?.contactInfo ? { name: savedResume.content.contactInfo.name, phone: savedResume.content.contactInfo.phone, email: savedResume.content.contactInfo.email } : undefined)} disabled={exporting}>
              <Download className="mr-1.5 h-4 w-4" />
              {exporting ? t("common.exporting") : t("common.exportPdf")}
            </Button>
            <Button onClick={save} size="lg">{t("resumes.coverLetter.saveCoverLetter")}</Button>
          </div>
        </div>

        {/* Preview */}
        <div className={`w-full md:w-[400px] shrink-0 ${showPreview ? "" : "hidden md:block"}`}>
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-neutral-150 bg-white p-6 shadow-sm text-xs sm:text-sm leading-relaxed space-y-3">
            <h3 className="text-sm font-medium text-neutral-500 mb-3">{t("common.preview")}</h3>
            <p className="text-neutral-500">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            {letter.content.recipientName && (
              <div className="text-neutral-700">
                <div>{letter.content.recipientName}</div>
                {letter.content.recipientTitle && <div>{letter.content.recipientTitle}</div>}
                {letter.content.company && <div>{letter.content.company}</div>}
                {letter.content.address && <div>{letter.content.address}</div>}
              </div>
            )}
            <p className="text-neutral-700">{t("resumes.coverLetter.dear").replace("{name}", letter.content.recipientName || t("resumes.coverLetter.hiringManagerName"))}</p>
            {letter.content.opening && <p className="text-neutral-600">{letter.content.opening}</p>}
            {letter.content.body && <p className="text-neutral-600">{letter.content.body}</p>}
            {letter.content.closing && <p className="text-neutral-600">{letter.content.closing}</p>}
            <div className="text-neutral-700">
              <p>{t("common.sincerely")}</p>
              <p className="mt-2 font-medium">{savedResume?.content.contactInfo.name || t("common.yourName")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
