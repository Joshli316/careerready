import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JD Decoder — CareerReady",
  description: "Decode job descriptions and build a targeted interview prep plan.",
};

export default function JDDecoderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
