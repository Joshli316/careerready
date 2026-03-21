import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Prep",
  description: "Practice the 8 most common interview questions and build STAR stories you can reuse.",
};

export default function InterviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
