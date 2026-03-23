import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Landing the Job",
  description: "Tips for your first 90 days at work and a monthly self-evaluation tracker.",
};
import { Briefcase, BarChart3 } from "lucide-react";

const sections = [
  { title: "Workplace Success", description: "Tips for doing well in your first job.", href: "/landing-the-job/workplace-success", icon: Briefcase },
  { title: "Self-Evaluation", description: "Track your performance during your first months on the job.", href: "/landing-the-job/self-evaluation", icon: BarChart3 },
];

export default function LandingTheJobPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Landing the Job</h1>
        <p className="mt-2 text-neutral-500">Do well at your new job with workplace tips and a monthly self-check.</p>
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
