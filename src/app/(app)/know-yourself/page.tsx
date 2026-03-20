import Link from "next/link";
import { Brain, Target, Wrench, Heart, Sparkles, Mic, Shirt, Mail } from "lucide-react";

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
    description: "Identify your soft and hard skills from all experiences.",
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
    description: "Create your personal brand statement.",
    href: "/know-yourself/branding",
    icon: Sparkles,
  },
  {
    title: "Power Statement",
    description: "Build your elevator pitch for networking and interviews.",
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
          Build self-awareness about your professional identity. The skills, values, and brand you
          define here will flow into your resume, cover letters, and interview preparation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-primary-300"
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
