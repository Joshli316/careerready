import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Common Interview Questions",
  description:
    "Prepare answers to the 8 most common interview questions with guided frameworks.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
