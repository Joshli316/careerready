"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";

export default function ThankYouPage() {
  const [interviewer, setInterviewer] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [highlights, setHighlights] = useState("");

  const preview = `Dear ${interviewer || "[Interviewer Name]"},

Thank you for meeting with me today. It was a pleasure to learn more about the ${position || "[Position]"} role and the team at ${company || "[Company]"}.

${highlights || "I am excited about the opportunity to contribute to your team and believe my skills and experience are a strong fit for this position."}

Please do not hesitate to contact me if I can provide additional information. I look forward to hearing from you about the next steps in the hiring process.

Best Regards,
[Your Name]
[Your Phone]
[Your Email]`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Thank You Note Generator</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Send a thank you note within 24 hours of your interview.
        </p>
      </div>

      <Callout type="tip" className="mb-6">
        Thank you notes show professional etiquette and reinforce your interest in the position.
        Mail or email within 24 hours to leave a positive, memorable impression.
      </Callout>

      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm space-y-4">
            <Input label="Interviewer Name" value={interviewer} onChange={(e) => setInterviewer(e.target.value)} placeholder="e.g., Ms. Johnson" />
            <Input label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
            <Input label="Position" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Position you interviewed for" />
            <Textarea label="Key Discussion Points / Why You're Excited" value={highlights} onChange={(e) => setHighlights(e.target.value)} rows={4} placeholder="Mention specific things discussed, what excited you about the role..." />
          </div>
          <Button variant="secondary" onClick={() => navigator.clipboard.writeText(preview)}>
            Copy to Clipboard
          </Button>
        </div>

        <div className="hidden md:block w-[400px] shrink-0">
          <div className="sticky top-20 rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-neutral-500">Preview</h3>
            <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-neutral-700 font-sans">{preview}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
