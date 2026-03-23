import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goal Setting with FOCUS",
  description:
    "Set structured employment goals using the FOCUS framework: Find, Outline, Create, Understand, Set.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
