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
import { Download, Copy, Eye, EyeOff } from "lucide-react";

export default function ThankYouPage() {
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

Thank you for meeting with me today. It was a pleasure to learn more about the ${position || "[Position]"} role and the team at ${company || "[Company]"}.

${highlights || "Our conversation confirmed that this role is a great match for what I do best. I'm looking forward to the possibility of joining the team."}

Feel free to reach out if you need anything else from me. I hope to hear from you soon.

Best Regards,
${senderName || "[Your Name]"}
${senderPhone || "[Your Phone]"}
${senderEmail || "[Your Email]"}`;

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Couldn't copy — try selecting the text manually.", "error");
    }
  }, [preview, toast]);

  return (
    <div>
      <Breadcrumb href="/interviews" label="Interviews" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Thank You Note Generator</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Send a thank you note within 24 hours of your interview.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)} className="md:hidden">
          {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
          {showPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      <Callout type="tip" className="mb-6">
        A quick thank you note makes you stand out. Most candidates skip this step.
        Send it within 24 hours while the conversation is still fresh.
      </Callout>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className={`flex-1 space-y-4 ${showPreview ? "hidden md:block" : ""}`}>
          <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm space-y-4">
            <Input label="Interviewer Name" value={interviewer} onChange={(e) => setInterviewer(e.target.value)} placeholder="e.g., Ms. Johnson" />
            <Input label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
            <Input label="Position" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Position you interviewed for" />
            <Textarea label="Key Discussion Points / Why You're Excited" value={highlights} onChange={(e) => setHighlights(e.target.value)} rows={4} placeholder="Mention specific things discussed, what excited you about the role..." />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={copyToClipboard}>
              <Copy className="mr-1.5 h-4 w-4" />
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button variant="secondary" onClick={() => exportThankYou({ interviewer, company, position, body: preview, senderName: senderName || undefined, senderPhone: senderPhone || undefined, senderEmail: senderEmail || undefined })} disabled={exporting}>
              <Download className="mr-1.5 h-4 w-4" />
              {exporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>

        <div className={`w-full md:w-[400px] shrink-0 ${showPreview ? "" : "hidden md:block"}`}>
          <div className="sticky top-20 rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-neutral-500">Preview</h3>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-neutral-700 font-sans">{preview}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
