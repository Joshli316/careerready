import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applications",
  description: "Fill out job applications faster with tips, templates, and a master form that saves your info.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
