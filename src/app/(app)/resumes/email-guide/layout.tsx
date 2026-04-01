import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Guide",
  description: "How to email your resume and cover letter to employers with professional formatting.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
