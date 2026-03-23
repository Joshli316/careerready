import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JD Decoder",
  description: "Paste a job posting to extract requirements, match your stories, and build a prep checklist.",
};

export default function JDDecoderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
