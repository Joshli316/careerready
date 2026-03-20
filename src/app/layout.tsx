import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerReady — Job Preparation Toolkit",
  description:
    "Interactive tools to help college graduates prepare for their first job search.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
