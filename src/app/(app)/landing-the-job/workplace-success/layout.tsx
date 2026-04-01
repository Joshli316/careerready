import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workplace Success",
  description: "Good habits that keep you employed and get you promoted. What managers look for.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
