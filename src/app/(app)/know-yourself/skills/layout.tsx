import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transferable Skills",
  description:
    "Identify soft and hard skills from jobs, internships, and campus activities. Skills auto-fill your resume.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
