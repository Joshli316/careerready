import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Mock Interview — CareerReady",
  description: "Practice interview questions with real-time AI coaching.",
};

export default function MockInterviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
