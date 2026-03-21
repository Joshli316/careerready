import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reference Page",
  description:
    "Build a formatted reference page that matches your resume.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
