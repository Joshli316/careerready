"use client";

import Link from "next/link";
import { BookOpen, MessageCircle, Building2, ThumbsUp } from "lucide-react";
import { ReadinessDashboard } from "./components/ReadinessDashboard";

const sections = [
  { title: "Storybank", description: "Build and manage your behavioral interview story collection.", href: "/interviews/star-method", icon: BookOpen },
  { title: "Common Questions", description: "Prepare answers to the 8 most common interview questions.", href: "/interviews/common-questions", icon: MessageCircle },
  { title: "Company Research", description: "Research framework to prepare for specific employers.", href: "/interviews/company-research", icon: Building2 },
  { title: "Thank You Notes", description: "Generate professional thank you notes after interviews.", href: "/interviews/thank-you", icon: ThumbsUp },
];

export default function InterviewsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Interviews</h1>
        <p className="mt-2 text-neutral-500">Prepare for interviews with structured frameworks and practice tools.</p>
      </div>
      <ReadinessDashboard />
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
