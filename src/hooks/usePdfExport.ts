"use client";

import { useCallback, useState } from "react";
import type { Resume, CoverLetter } from "@/types/resume";

export function usePdfExport() {
  const [exporting, setExporting] = useState(false);

  const exportResume = useCallback(async (resume: Resume) => {
    setExporting(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { ResumeDocument } = await import(
        "@/lib/pdf/templates/ResumeDocument"
      );
      const { createElement } = await import("react");
      const doc = createElement(ResumeDocument, { resume });
      const blob = await pdf(doc as Parameters<typeof pdf>[0]).toBlob();
      downloadBlob(blob, `${resume.title || "Resume"}.pdf`);
    } finally {
      setExporting(false);
    }
  }, []);

  const exportCoverLetter = useCallback(
    async (
      letter: CoverLetter,
      sender?: { name?: string; phone?: string; email?: string }
    ) => {
      setExporting(true);
      try {
        const { pdf } = await import("@react-pdf/renderer");
        const { CoverLetterDocument } = await import(
          "@/lib/pdf/templates/CoverLetterDocument"
        );
        const { createElement } = await import("react");
        const doc = createElement(CoverLetterDocument, {
          letter,
          senderName: sender?.name,
          senderPhone: sender?.phone,
          senderEmail: sender?.email,
        });
        const blob = await pdf(doc as Parameters<typeof pdf>[0]).toBlob();
        downloadBlob(blob, `Cover Letter - ${letter.title || "Untitled"}.pdf`);
      } finally {
        setExporting(false);
      }
    },
    []
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
      setExporting(true);
      try {
        const { pdf } = await import("@react-pdf/renderer");
        const { ThankYouDocument } = await import(
          "@/lib/pdf/templates/ThankYouDocument"
        );
        const { createElement } = await import("react");
        const doc = createElement(ThankYouDocument, data);
        const blob = await pdf(doc as Parameters<typeof pdf>[0]).toBlob();
        downloadBlob(blob, `Thank You - ${data.company || "Note"}.pdf`);
      } finally {
        setExporting(false);
      }
    },
    []
  );

  return { exportResume, exportCoverLetter, exportThankYou, exporting };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
