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
    "Your first job starts here. 8 free tools that walk you from figuring out your strengths to acing the interview. No account needed.",
  keywords: [
    "resume builder", "interview prep", "job search", "college graduates",
    "cover letter", "STAR method", "career tools", "free resume maker",
    "entry level jobs", "job application tracker",
  ],
  openGraph: {
    title: "CareerReady — Free Job Prep Tools for College Graduates",
    description:
      "8 free tools that help recent graduates build resumes, practice interviews, and land their first job.",
    type: "website",
    siteName: "CareerReady",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerReady — Free Job Prep Tools for College Graduates",
    description:
      "8 free tools that help recent graduates build resumes, practice interviews, and land their first job.",
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "theme-color": "#4D8B31",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CareerReady",
  "url": "https://careerready.pages.dev",
  "description": "8 free job preparation tools for college graduates — resumes, interviews, applications, and more.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
