import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Know Yourself",
  description: "Identify your skills, values, and personal brand. What you write here auto-fills your resume and interview prep.",
};
import { Brain, Target, Wrench, Heart, Sparkles, Mic } from "lucide-react";

const sections = [
  {
    title: "Challenge Your Beliefs",
    description: "Identify positive beliefs and convert challenges into affirmations.",
    href: "/know-yourself/beliefs",
    icon: Brain,
  },
  {
    title: "Goal Setting with FOCUS",
    description: "Create structured employment goals using the FOCUS framework.",
    href: "/know-yourself/focus-goals",
    icon: Target,
  },
  {
    title: "Transferable Skills",
    description: "Identify your soft and hard skills. These auto-fill your resume.",
    href: "/know-yourself/skills",
    icon: Wrench,
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
    description: "Build your elevator pitch. Use it at networking events and in interviews.",
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
          your resume, cover letter, and interview prep — so you only write it once.
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
              <h2 className="font-semibold text-neutral-800">{section.title}</h2>
              <p className="mt-1 text-sm text-neutral-500">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
