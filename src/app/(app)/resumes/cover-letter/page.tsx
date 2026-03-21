"use client";

import { useState, useEffect, useCallback } from "react";
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
import type { CoverLetter } from "@/types/resume";

export default function CoverLetterPage() {
  const storage = useStorage();
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
    Promise.all([storage.getCoverLetters(), storage.getProfile()]).then(([letters, p]) => {
      if (letters.length > 0) setLetter(letters[0]);
      setProfile(p);
    });
  }, [storage]);

  const save = useCallback(async () => {
    try {
      await storage.saveCoverLetter(letter);
      showSaved();
      toast("Saved successfully", "success");
    } catch {
      toast("Failed to save cover letter. Please try again.", "error");
    }
  }, [storage, letter, showSaved, toast]);

  function updateContent(field: keyof CoverLetter["content"], value: string) {
    setLetter({ ...letter, content: { ...letter.content, [field]: value } });
  }

  return (
    <div>
      <Breadcrumb href="/resumes" label="Resumes" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Cover Letter Builder</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Write a cover letter in three paragraphs: why you're interested, what you bring, and next steps.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SavedIndicator visible={saved} />
          <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)} className="md:hidden">
            {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      <Callout type="tip" className="mb-6">
        Don't repeat your resume. Instead, connect the dots between your experience and what this
        specific job needs. Tell them why you want to work there.
      </Callout>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className={`flex-1 space-y-6 ${showPreview ? "hidden md:block" : ""}`}>
          {/* Recipient */}
          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-neutral-800">Recipient</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Hiring Manager Name" placeholder='e.g., "Mr. Jim Howard" or "Hiring Manager"' value={letter.content.recipientName} onChange={(e) => updateContent("recipientName", e.target.value)} />
              <Input label="Title (optional)" placeholder="e.g., HR Director" value={letter.content.recipientTitle} onChange={(e) => updateContent("recipientTitle", e.target.value)} />
              <Input label="Company" placeholder="Company name" value={letter.content.company} onChange={(e) => updateContent("company", e.target.value)} />
              <Input label="Address (optional)" placeholder="Street, City, State ZIP" value={letter.content.address} onChange={(e) => updateContent("address", e.target.value)} />
            </div>
          </section>

          {/* Paragraph 1 */}
          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold text-neutral-800">Opening Paragraph</h2>
            <p className="mb-3 text-sm text-neutral-500">
              State the position, how you heard about it, your top qualifications, and why you're interested.
            </p>
            <Textarea
              value={letter.content.opening}
              onChange={(e) => updateContent("opening", e.target.value)}
              placeholder="I'm applying for the [Position] I saw on [Source]. Here's why I'd be a good fit..."
              rows={5}
            />
          </section>

          {/* Paragraph 2 */}
          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold text-neutral-800">Body Paragraph</h2>
            <p className="mb-3 text-sm text-neutral-500">
              Explain how your experience is relevant to the position. Mention unique skills or qualifications.
            </p>
            <Textarea
              value={letter.content.body}
              onChange={(e) => updateContent("body", e.target.value)}
              placeholder="As a [your role/background], I gained valuable experience in..."
              rows={6}
            />
          </section>

          {/* Paragraph 3 */}
          <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold text-neutral-800">Closing Paragraph</h2>
            <p className="mb-3 text-sm text-neutral-500">
              Reiterate interest, mention follow-up timeline, and thank them.
            </p>
            <Textarea
              value={letter.content.closing}
              onChange={(e) => updateContent("closing", e.target.value)}
              placeholder="I'd welcome the chance to talk more about how my background fits this role. I'm available anytime next week..."
              rows={4}
            />
          </section>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="lg" onClick={() => exportCoverLetter(letter)} disabled={exporting}>
              <Download className="mr-1.5 h-4 w-4" />
              {exporting ? "Exporting..." : "Export PDF"}
            </Button>
            <Button onClick={save} size="lg">Save Cover Letter</Button>
          </div>
        </div>

        {/* Preview */}
        <div className={`w-full md:w-[400px] shrink-0 ${showPreview ? "" : "hidden md:block"}`}>
          <div className="sticky top-20 rounded-xl border border-neutral-150 bg-white p-6 shadow-sm text-xs leading-relaxed space-y-3">
            <h3 className="text-sm font-medium text-neutral-500 mb-3">Preview</h3>
            <p className="text-neutral-500">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            {letter.content.recipientName && (
              <div className="text-neutral-700">
                <div>{letter.content.recipientName}</div>
                {letter.content.recipientTitle && <div>{letter.content.recipientTitle}</div>}
                {letter.content.company && <div>{letter.content.company}</div>}
                {letter.content.address && <div>{letter.content.address}</div>}
              </div>
            )}
            <p className="text-neutral-700">Dear {letter.content.recipientName || "Hiring Manager"},</p>
            {letter.content.opening && <p className="text-neutral-600">{letter.content.opening}</p>}
            {letter.content.body && <p className="text-neutral-600">{letter.content.body}</p>}
            {letter.content.closing && <p className="text-neutral-600">{letter.content.closing}</p>}
            <div className="text-neutral-700">
              <p>Sincerely,</p>
              <p className="mt-2 font-medium">[Your Name]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
