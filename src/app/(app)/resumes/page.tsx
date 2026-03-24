import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "Create your resume, cover letter, and reference page. Export to PDF.",
};
import { PenTool, FileSignature, Users, Mail } from "lucide-react";

const sections = [
  { title: "Resume Builder", description: "Fill in each section and see a live preview as you type.", href: "/resumes/builder", icon: PenTool },
  { title: "Cover Letter Builder", description: "Write a cover letter that matches each job you apply for.", href: "/resumes/cover-letter", icon: FileSignature },
  { title: "Reference Page", description: "Build a formatted reference page matching your resume.", href: "/resumes/references", icon: Users },
  { title: "Email Guide", description: "Templates for emailing your resume to employers.", href: "/resumes/email-guide", icon: Mail },
];

export default function ResumesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Resumes</h1>
        <p className="mt-2 text-neutral-500">Build your resume, cover letter, and reference page, then export as PDF.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="group flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-400 group-hover:bg-primary-100"><s.icon className="h-5 w-5" /></div>
            <div><h2 className="font-semibold text-neutral-800">{s.title}</h2><p className="mt-1 text-sm text-neutral-500">{s.description}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
