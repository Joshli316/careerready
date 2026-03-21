import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Challenge Your Beliefs",
  description:
    "Identify positive beliefs and turn challenges into affirmations for your job search.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
