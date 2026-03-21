import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Presence Audit",
  description:
    "Review your social media through an employer's eyes. 1 in 3 candidates are rejected for what's online.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
