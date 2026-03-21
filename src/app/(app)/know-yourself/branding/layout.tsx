import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Branding",
  description:
    "Write your personal brand statement. It becomes your resume summary and LinkedIn headline.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
