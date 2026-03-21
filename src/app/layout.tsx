import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://careerready.pages.dev"),
  title: {
    default: "CareerReady — Free Job Prep Tools for College Graduates",
    template: "%s — CareerReady",
  },
  description:
    "8 free tools that help recent graduates build resumes, practice interviews, and land their first job. No account needed — start in 30 seconds.",
  openGraph: {
    title: "CareerReady — Free Job Prep Tools for College Graduates",
    description:
      "8 free tools that help recent graduates build resumes, practice interviews, and land their first job.",
    type: "website",
    siteName: "CareerReady",
  },
  twitter: {
    card: "summary",
    title: "CareerReady — Free Job Prep Tools for College Graduates",
    description:
      "8 free tools that help recent graduates build resumes, practice interviews, and land their first job.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
