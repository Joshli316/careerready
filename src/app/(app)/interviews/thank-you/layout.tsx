import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You Notes",
  description:
    "Generate a professional thank you note after your interview. Copy or export as PDF.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
