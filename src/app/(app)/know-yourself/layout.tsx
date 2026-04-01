import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Know Yourself",
  description: "Figure out your skills, values, and brand. What you write here auto-fills your resume and interview prep.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
