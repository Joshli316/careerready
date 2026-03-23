import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Research",
  description:
    "Research companies before your interview: mission, products, culture, recent news.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
