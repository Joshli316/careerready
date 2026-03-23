"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import type { Resume, CoverLetter } from "@/types/resume";

export function usePdfExport() {
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const exportDocument = useCallback(
    async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      importTemplate: () => Promise<React.ComponentType<any>>,
      props: Record<string, unknown>,
      filename: string
    ) => {
      setExporting(true);
      try {
        const { pdf } = await import("@react-pdf/renderer");
        const { createElement } = await import("react");
        const Template = await importTemplate();
        const doc = createElement(Template, props);
        const blob = await pdf(doc as Parameters<typeof pdf>[0]).toBlob();
        downloadBlob(blob, filename);
      } catch (err) {
        console.error("PDF export failed:", err);
        toast("PDF export failed. Please try again.", "error");
      } finally {
        setExporting(false);
      }
    },
    [toast]
  );

  const exportResume = useCallback(
    async (resume: Resume) => {
      await exportDocument(
        async () => {
          const { ResumeDocument } = await import(
            "@/lib/pdf/templates/ResumeDocument"
          );
          return ResumeDocument;
        },
        { resume } as Record<string, unknown>,
        `${resume.title || "Resume"}.pdf`
      );
    },
    [exportDocument]
  );

  const exportCoverLetter = useCallback(
    async (
      letter: CoverLetter,
      sender?: { name?: string; phone?: string; email?: string }
    ) => {
      await exportDocument(
        async () => {
          const { CoverLetterDocument } = await import(
            "@/lib/pdf/templates/CoverLetterDocument"
          );
          return CoverLetterDocument;
        },
        {
          letter,
          senderName: sender?.name,
          senderPhone: sender?.phone,
          senderEmail: sender?.email,
        } as Record<string, unknown>,
        `Cover Letter - ${letter.title || "Untitled"}.pdf`
      );
    },
    [exportDocument]
  );

  const exportThankYou = useCallback(
    async (data: {
      interviewer: string;
      company: string;
      position: string;
      body: string;
      senderName?: string;
      senderPhone?: string;
      senderEmail?: string;
    }) => {
      await exportDocument(
        async () => {
          const { ThankYouDocument } = await import(
            "@/lib/pdf/templates/ThankYouDocument"
          );
          return ThankYouDocument;
        },
        data as Record<string, unknown>,
        `Thank You - ${data.company || "Note"}.pdf`
      );
    },
    [exportDocument]
  );

  return { exportResume, exportCoverLetter, exportThankYou, exporting };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  try {
    a.click();
  } catch {
    // Fallback for browsers that block programmatic clicks (e.g., iOS Safari)
    window.open(url, "_blank");
  } finally {
    document.body.removeChild(a);
    // Delay revocation to give the browser time to start the download
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}
