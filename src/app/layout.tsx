import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0B1120",
};

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
    "Build your resume, practice interviews, and track applications with 8 free, connected tools. Bilingual (English/Chinese). No sign-up needed.",
  keywords: [
    "resume builder", "interview prep", "job search", "college graduates",
    "cover letter", "STAR method", "career tools", "free resume maker",
    "entry level jobs", "job application tracker", "first job", "new grad jobs",
    "mock interview", "job prep", "career readiness",
    "bilingual career tools", "Chinese English resume", "behavioral interview practice",
    "skills inventory", "personal brand statement", "job search checklist",
  ],
  openGraph: {
    title: "CareerReady — Free Job Prep Tools for College Graduates",
    description:
      "Build your resume, practice interviews, and track applications with 8 free, connected tools. Bilingual (English/Chinese). No sign-up needed.",
    type: "website",
    siteName: "CareerReady",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerReady — Free Job Prep Tools for College Graduates",
    description:
      "Build your resume, practice interviews, and track applications with 8 free, connected tools. Bilingual (English/Chinese). No sign-up needed.",
  },
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "zh": "/",
    },
  },
  authors: [{ name: "CareerReady" }],
  creator: "CareerReady",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CareerReady",
  "url": "https://careerready.pages.dev",
  "description": "8 connected job prep tools for college graduates: skills inventory, resume builder, interview prep, and application tracker.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
  },
  "featureList": "Resume Builder, Cover Letter Builder, STAR Interview Prep, Skills Inventory, Application Tracker, AI Mock Interview, Job Search Checklist, Social Media Audit",
  "inLanguage": ["en", "zh"],
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
