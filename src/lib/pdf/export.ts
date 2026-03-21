"use client";

import { pdf } from "@react-pdf/renderer";

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

export async function exportPdf(
  component: Parameters<typeof pdf>[0],
  filename: string
) {
  const blob = await pdf(component).toBlob();
  downloadBlob(blob, filename);
}
