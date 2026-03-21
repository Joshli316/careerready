import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Self-Evaluation",
  description:
    "Rate yourself monthly during your first 90 days. Identify areas to improve before your formal review.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
