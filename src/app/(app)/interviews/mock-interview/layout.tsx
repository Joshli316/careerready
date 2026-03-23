import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Mock Interview",
  description: "Practice mock interviews with AI feedback on every answer.",
};

export default function MockInterviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
