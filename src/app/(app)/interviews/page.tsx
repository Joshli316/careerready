"use client";

import Link from "next/link";
import { BookOpen, MessageCircle, Building2, ThumbsUp, FileSearch, Mic } from "lucide-react";
import { ReadinessDashboard } from "./components/ReadinessDashboard";

const sections = [
  { title: "Storybank", description: "Write STAR stories and tag them by skill so they're ready when you need them.", href: "/interviews/star-method", icon: BookOpen },
  { title: "JD Decoder", description: "Paste any job posting to see which stories you have ready and where you have gaps.", href: "/interviews/jd-decoder", icon: FileSearch },
  { title: "AI Mock Interview", description: "Answer questions one by one and get AI coaching after each.", href: "/interviews/mock-interview", icon: Mic },
  { title: "Common Questions", description: "Draft answers to the 8 questions interviewers ask most.", href: "/interviews/common-questions", icon: MessageCircle },
  { title: "Company Research", description: "Organize your research on each company before you walk in.", href: "/interviews/company-research", icon: Building2 },
  { title: "Thank You Notes", description: "Write and send thank you notes the same day.", href: "/interviews/thank-you", icon: ThumbsUp },
];

export default function InterviewsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Interviews</h1>
        <p className="mt-2 text-neutral-500">Everything you need to get interview-ready, from stories to thank you notes.</p>
      </div>
      <ReadinessDashboard />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
