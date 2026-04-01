import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landing the Job",
  description: "Workplace success tips and self-evaluation tracker for your first 90 days.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
