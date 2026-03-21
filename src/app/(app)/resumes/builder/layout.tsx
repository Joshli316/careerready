import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Builder",
  description:
    "Build a professional resume step by step with live preview and PDF export.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
