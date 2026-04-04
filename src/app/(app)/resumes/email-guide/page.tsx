"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { NextStepLink } from "@/components/ui/NextStepLink";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Download, Save } from "lucide-react";

const STORAGE_KEY = "careerready-email-draft";

interface EmailDraft {
  to: string;
  subject: string;
  body: string;
}

export default function EmailGuidePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [draft, setDraft] = useState<EmailDraft>({ to: "", subject: "", body: "" });
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDraft(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  function updateDraft(field: keyof EmailDraft, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function saveDraft() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setSaved(true);
    toast(t("resumes.emailGuide.draftSaved"), "success");
  }

  const exportPdf = useCallback(async () => {
    const current = draftRef.current;
    setExporting(true);
    try {
      const { pdf, Document, Page, Text, View, StyleSheet } = await import("@react-pdf/renderer");
      const { createElement: h } = await import("react");

      const styles = StyleSheet.create({
        page: { padding: 50, fontFamily: "Helvetica", fontSize: 11, lineHeight: 1.5 },
        header: { marginBottom: 4, fontSize: 10, color: "#555" },
        subject: { marginBottom: 16, fontSize: 12, fontFamily: "Helvetica-Bold" },
        body: { whiteSpace: "pre-wrap" as never },
      });

      const doc = h(Document, null,
        h(Page, { size: "LETTER", style: styles.page },
          h(View, null,
            h(Text, { style: styles.header }, `To: ${current.to}`),
            h(Text, { style: styles.subject }, `Subject: ${current.subject}`),
            h(Text, { style: styles.body }, current.body),
          )
        )
      );

      const blob = await pdf(doc as Parameters<typeof pdf>[0]).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Email Draft.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error("PDF export failed:", err);
      toast(t("common.pdfExportFailed"), "error");
    } finally {
      setExporting(false);
    }
  }, [toast, t]);

  const hasDraftContent = draft.to.trim() || draft.subject.trim() || draft.body.trim();

  return (
    <div>
      <Breadcrumb href="/resumes" label={t("resumes.title")} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{t("resumes.emailGuide.title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {t("resumes.emailGuide.description")}
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-400 text-sm font-bold text-white">1</div>
            <div>
              <h2 className="font-semibold text-neutral-800">{t("resumes.emailGuide.subjectLine")}</h2>
              <p className="mt-1 text-sm text-neutral-600">
                {t("resumes.emailGuide.subjectDesc")}
              </p>
              <div className="mt-2 rounded-lg bg-neutral-50 p-3 font-mono text-sm text-neutral-700">
                {t("resumes.emailGuide.subjectExample")}
              </div>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-400 text-sm font-bold text-white">2</div>
            <div>
              <h2 className="font-semibold text-neutral-800">{t("resumes.emailGuide.emailBody")}</h2>
              <p className="mt-1 text-sm text-neutral-600">
                {t("resumes.emailGuide.emailBodyDesc")}
              </p>
              <ul className="mt-2 space-y-1 text-sm text-neutral-600">
                <li className="flex gap-2"><span className="text-primary-400">&#10003;</span>{t("resumes.emailGuide.emailTip1")}</li>
                <li className="flex gap-2"><span className="text-primary-400">&#10003;</span>{t("resumes.emailGuide.emailTip2")}</li>
                <li className="flex gap-2"><span className="text-primary-400">&#10003;</span>{t("resumes.emailGuide.emailTip3")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-400 text-sm font-bold text-white">3</div>
            <div>
              <h2 className="font-semibold text-neutral-800">{t("resumes.emailGuide.contactInfo")}</h2>
              <p className="mt-1 text-sm text-neutral-600">
                {t("resumes.emailGuide.contactInfoDesc")}
              </p>
            </div>
          </div>
        </section>

        {/* Step 4 */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-400 text-sm font-bold text-white">4</div>
            <div>
              <h2 className="font-semibold text-neutral-800">{t("resumes.emailGuide.attachments")}</h2>
              <p className="mt-1 text-sm text-neutral-600">
                {t("resumes.emailGuide.attachmentsDesc")}
              </p>
              <div className="mt-2 space-y-1 rounded-lg bg-neutral-50 p-3 font-mono text-sm text-neutral-700">
                <div>{t("resumes.emailGuide.attachmentResume")}</div>
                <div>{t("resumes.emailGuide.attachmentCover")}</div>
              </div>
            </div>
          </div>
        </section>

        <Callout type="warning">
          {t("resumes.emailGuide.proofreadWarning")}
        </Callout>

        {/* Sample email */}
        <section className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800">{t("resumes.emailGuide.sampleEmail")}</h2>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700">
            <div className="mb-2 border-b border-neutral-200 pb-2">
              <div><strong>To:</strong> hiring@company.com</div>
              <div><strong>{t("resumes.emailGuide.subjectLine")}:</strong> {t("resumes.emailGuide.sampleSubject").replace("Subject: ", "")}</div>
            </div>
            <p>{t("resumes.emailGuide.sampleGreeting")}</p>
            <br />
            <p>
              {t("resumes.emailGuide.sampleBody")}
            </p>
            <br />
            <p>
              {t("resumes.emailGuide.sampleClosing")}
            </p>
            <br />
            <p>{t("common.sincerely")}</p>
            <p>{t("resumes.emailGuide.sampleName")}</p>
            <p>{t("resumes.emailGuide.samplePhone")}</p>
            <p>{t("resumes.emailGuide.sampleEmail2")}</p>
          </div>
        </section>

        {/* Draft your email */}
        <section className="rounded-xl border-2 border-primary-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-neutral-800">{t("resumes.emailGuide.draftTitle")}</h2>
          <p className="mb-4 text-sm text-neutral-500">{t("resumes.emailGuide.draftDescription")}</p>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t("resumes.emailGuide.toLabel")}
                placeholder={t("resumes.emailGuide.toPlaceholder")}
                value={draft.to}
                onChange={(e) => updateDraft("to", e.target.value)}
              />
              <Input
                label={t("resumes.emailGuide.subjectLine")}
                placeholder={t("resumes.emailGuide.subjectPlaceholder")}
                value={draft.subject}
                onChange={(e) => updateDraft("subject", e.target.value)}
              />
            </div>
            <Textarea
              label={t("resumes.emailGuide.bodyLabel")}
              placeholder={t("resumes.emailGuide.bodyPlaceholder")}
              value={draft.body}
              onChange={(e) => updateDraft("body", e.target.value)}
              rows={10}
            />
            <div className="flex items-center justify-end gap-3">
              <SavedIndicator visible={saved} />
              <Button
                variant="secondary"
                onClick={exportPdf}
                disabled={!hasDraftContent || exporting}
              >
                <Download className="mr-1.5 h-4 w-4" />
                {t("resumes.emailGuide.exportPdf")}
              </Button>
              <Button onClick={saveDraft} disabled={!hasDraftContent}>
                <Save className="mr-1.5 h-4 w-4" />
                {t("resumes.emailGuide.saveDraft")}
              </Button>
            </div>
          </div>
        </section>
      </div>

      <NextStepLink href="/job-search" labelKey="tools.jobSearch.name" prevHref="/resumes/references" prevLabelKey="resumes.sections.references.title" />
    </div>
  );
}
