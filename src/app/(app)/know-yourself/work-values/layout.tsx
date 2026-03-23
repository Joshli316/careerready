import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work Values",
  description:
    "Rank what matters most in a workplace: achievement, relationships, independence, and recognition.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
