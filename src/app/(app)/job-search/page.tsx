import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Job Search",
  description: "Networking scripts, job board strategy, and a checklist to keep your search on track.",
};
import { Users, Monitor, CheckSquare } from "lucide-react";

const sections = [
  { title: "Networking", description: "List people who can help and plan how to reach out.", href: "/job-search/networking", icon: Users },
  { title: "Job Boards & Websites", description: "Where to search online and how to get results from each site.", href: "/job-search/job-boards", icon: Monitor },
  { title: "Job Search Checklist", description: "Track your progress across all search methods.", href: "/job-search/checklist", icon: CheckSquare },
];

export default function JobSearchPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Job Search</h1>
        <p className="mt-2 text-neutral-500">Find openings through networking, job boards, and direct outreach.</p>
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
