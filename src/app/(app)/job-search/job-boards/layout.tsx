import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Boards & Websites",
  description: "Where to search for jobs online. 8 recommended job boards with tips for each.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
