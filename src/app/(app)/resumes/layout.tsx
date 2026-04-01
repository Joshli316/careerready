import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resumes",
  description: "Create your resume, cover letter, and reference page. Export to PDF.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
