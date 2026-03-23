import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Search Checklist",
  description:
    "Track your job search progress across all channels: boards, networking, cold calls, fairs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
