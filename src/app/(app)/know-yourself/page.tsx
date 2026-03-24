import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Know Yourself",
  description: "Figure out your skills, values, and brand. What you write here auto-fills your resume and interview prep.",
};
import { Brain, Target, Wrench, Heart, Sparkles, Mic } from "lucide-react";

const sections: { title: string; description: string; href: string; icon: typeof Brain; recommended?: boolean }[] = [
  {
    title: "Challenge Your Beliefs",
    description: "Replace negative thoughts with positive ones that help your job search.",
    href: "/know-yourself/beliefs",
    icon: Brain,
  },
  {
    title: "Goal Setting with FOCUS",
    description: "Set clear job search goals with the FOCUS method.",
    href: "/know-yourself/focus-goals",
    icon: Target,
  },
  {
    title: "Transferable Skills",
    description: "Pick your top skills. They auto-fill your resume.",
    href: "/know-yourself/skills",
    icon: Wrench,
    recommended: true,
  },
  {
    title: "Work Values",
    description: "Rank what matters most to you in a workplace.",
    href: "/know-yourself/work-values",
    icon: Heart,
  },
  {
    title: "Personal Branding",
    description: "Write your brand statement. It becomes your resume summary.",
    href: "/know-yourself/branding",
    icon: Sparkles,
  },
  {
    title: "Power Statement",
    description: "Write your 30-second pitch for networking events and interviews.",
    href: "/know-yourself/power-statement",
    icon: Mic,
  },
];

export default function KnowYourselfPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Know Yourself</h1>
        <p className="mt-2 text-neutral-500">
          This is the foundation of your entire job search. What you write here auto-fills
          your resume, cover letter, and interview prep. You only write it once.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-400 group-hover:bg-primary-100">
              <section.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-neutral-800">{section.title}</h2>
                {section.recommended && (
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-semibold text-primary-700">Start here</span>
                )}
              </div>
              <p className="mt-1 text-sm text-neutral-500">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Next step:</span> Once you&apos;ve identified your skills and brand statement, head to{" "}
          <Link href="/resumes/builder" className="font-medium underline hover:text-blue-900">Resume Builder</Link>{" "}
          where your data auto-fills.
        </p>
      </div>
    </div>
  );
}
