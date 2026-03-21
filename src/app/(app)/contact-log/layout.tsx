import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Log",
  description:
    "Track every job application, follow-up, and employer interaction in one place.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
