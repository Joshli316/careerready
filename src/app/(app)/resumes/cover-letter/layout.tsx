import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cover Letter Builder",
  description:
    "Write a three-paragraph cover letter with live preview and PDF export.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
