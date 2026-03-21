import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Power Statement",
  description:
    "Write a 30-second elevator pitch for networking events and interviews.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
