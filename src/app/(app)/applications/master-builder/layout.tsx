import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Application",
  description:
    "Keep all your application info in one place — personal details, work history, references.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
