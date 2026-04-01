import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media",
  description: "Audit and clean up your social media profiles before employers look you up.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
