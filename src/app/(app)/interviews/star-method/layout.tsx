import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "STAR Method Practice",
  description:
    "Build STAR stories for behavioral interviews — Situation, Task, Action, Result.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
