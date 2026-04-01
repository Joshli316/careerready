"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { usePdfExport } from "@/hooks/usePdfExport";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useStorage } from "@/hooks/useStorage";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Download, Copy, Eye, EyeOff } from "lucide-react";

export default function ThankYouPage() {
  const { t } = useLanguage();
  const storage = useStorage();
  const [interviewer, setInterviewer] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [highlights, setHighlights] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const { exportThankYou, exporting } = usePdfExport();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [showPreview, setShowPreview] = useState(false);

  // Clean up timeout on unmount
  useEffect(() => () => clearTimeout(copiedTimerRef.current), []);

  useEffect(() => {
    storage.getResumes().then((resumes) => {
      if (resumes.length > 0) {
        const c = resumes[0].content.contactInfo;
        if (c.name) setSenderName(c.name);
        if (c.phone) setSenderPhone(c.phone);
        if (c.email) setSenderEmail(c.email);
      }
    });
  }, [storage]);

  const preview = `Dear ${interviewer || "[Interviewer Name]"},

${t("interviews.thankYou.templatePara1").replace("{position}", position || "[Position]").replace("{company}", company || "[Company]")}

${highlights || t("interviews.thankYou.templatePara2")}

${t("interviews.thankYou.templatePara3")}

${t("common.bestRegards")}
${senderName || t("common.yourName")}
${senderPhone || t("common.yourPhone")}
${senderEmail || t("common.yourEmail")}`;

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast(t("common.couldNotCopy"), "error");
    }
  }, [preview, toast]);

  return (
    <div>
      <Breadcrumb href="/interviews" label={t("interviews.title")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("interviews.thankYou.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("interviews.thankYou.description")}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)} className="md:hidden">
          {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
          {showPreview ? t("common.edit") : t("common.preview")}
        </Button>
      </div>

      <Callout type="tip" className="mb-6">
        {t("interviews.thankYou.callout")}
      </Callout>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className={`flex-1 space-y-4 ${showPreview ? "hidden md:block" : ""}`}>
          <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm space-y-4">
            <Input label={t("interviews.thankYou.interviewerName")} value={interviewer} onChange={(e) => setInterviewer(e.target.value)} placeholder={t("interviews.thankYou.interviewerPlaceholder")} />
            <Input label={t("interviews.thankYou.company")} value={company} onChange={(e) => setCompany(e.target.value)} placeholder={t("interviews.thankYou.companyPlaceholder")} />
            <Input label={t("interviews.thankYou.position")} value={position} onChange={(e) => setPosition(e.target.value)} placeholder={t("interviews.thankYou.positionPlaceholder")} />
            <Textarea label={t("interviews.thankYou.keyPoints")} value={highlights} onChange={(e) => setHighlights(e.target.value)} rows={4} placeholder={t("interviews.thankYou.keyPointsPlaceholder")} />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={copyToClipboard}>
              <Copy className="mr-1.5 h-4 w-4" />
              {copied ? t("common.copied") : t("common.copyToClipboard")}
            </Button>
            <Button variant="secondary" onClick={() => exportThankYou({ interviewer, company, position, body: preview, senderName: senderName || undefined, senderPhone: senderPhone || undefined, senderEmail: senderEmail || undefined })} disabled={exporting}>
              <Download className="mr-1.5 h-4 w-4" />
              {exporting ? t("common.exporting") : t("common.exportPdf")}
            </Button>
          </div>
        </div>

        <div className={`w-full md:w-[400px] shrink-0 ${showPreview ? "" : "hidden md:block"}`}>
          <div className="sticky top-20 rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-neutral-500">{t("common.preview")}</h3>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-neutral-700 font-sans">{preview}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
