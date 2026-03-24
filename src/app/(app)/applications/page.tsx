import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Applications",
  description: "Fill out job applications faster with tips, templates, and a master form that saves your info.",
};
import { ListChecks, Lightbulb, ClipboardList } from "lucide-react";

const sections = [
  {
    title: "10 Essential Application Tips",
    description: "10 tips to get your application past the first screening.",
    href: "/applications/tips",
    icon: ListChecks,
  },
  {
    title: "Experience Gap Solver",
    description: "Turn volunteer work, freelance gigs, and internships into application material.",
    href: "/applications/experience-gap",
    icon: Lightbulb,
  },
  {
    title: "Master Application Builder",
    description: "Keep all your info in one place so you can fill any application fast.",
    href: "/applications/master-builder",
    icon: ClipboardList,
  },
];

export default function ApplicationsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Applications</h1>
        <p className="mt-2 text-neutral-500">
          Fill out applications faster. Stop re-typing the same information.
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
