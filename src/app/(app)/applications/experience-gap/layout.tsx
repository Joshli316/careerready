import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience Gap Solver",
  description:
    "Identify non-traditional experience you can put on applications — volunteer work, campus roles, freelance.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
