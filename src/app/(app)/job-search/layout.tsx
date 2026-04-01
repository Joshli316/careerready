import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Search",
  description: "Find openings through networking, job boards, and a daily action checklist.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
