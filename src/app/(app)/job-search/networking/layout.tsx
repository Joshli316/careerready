import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Network",
  description:
    "List professional and personal contacts for your job search network.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
