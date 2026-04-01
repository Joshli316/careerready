import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Tips",
  description: "10 tips for completing job applications that get you noticed.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
