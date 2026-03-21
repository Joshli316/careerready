import Link from "next/link";
import {
  User,
  FileText,
  ScrollText,
  MessageSquare,
  Search,
  Globe,
  Trophy,
  BookOpen,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const tools = [
  { name: "Know Yourself", desc: "Identify skills, values, and personal brand", icon: User, href: "/know-yourself" },
  { name: "Applications", desc: "Tips, templates, and assessment prep", icon: FileText, href: "/applications" },
  { name: "Resumes", desc: "Build resumes, cover letters, references", icon: ScrollText, href: "/resumes" },
  { name: "Interviews", desc: "STAR method, question practice, research", icon: MessageSquare, href: "/interviews" },
  { name: "Job Search", desc: "Networking, job boards, outreach", icon: Search, href: "/job-search" },
  { name: "Social Media", desc: "Clean up your profiles before employers look", icon: Globe, href: "/social-media" },
  { name: "Landing the Job", desc: "Workplace tips and self-evaluation", icon: Trophy, href: "/landing-the-job" },
  { name: "Contact Log", desc: "Track applications and follow-ups", icon: BookOpen, href: "/contact-log" },
];

const benefits = [
  "No account required — start immediately",
  "Your data stays in your browser",
  "Skills flow into your resume automatically",
  "Export resumes and cover letters as PDF",
  "Completely free, no upsells",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Nav */}
      <header className="border-b border-neutral-150 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-400">
              <span className="text-sm font-bold text-white">CR</span>
            </div>
            <span className="text-lg font-bold text-neutral-800">CareerReady</span>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg bg-primary-400 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">
            Your first job starts here.
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            8 free tools that walk you from figuring out your strengths to acing the interview.
            Built for recent graduates with no career coaching budget.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-400 px-6 py-3 text-base font-medium text-white hover:bg-primary-500"
            >
              Start for Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-8 space-y-2">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-neutral-600">
                <CheckCircle className="h-4 w-4 shrink-0 text-primary-400" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-neutral-150 bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold text-neutral-800">Three phases, eight tools</h2>
          <p className="mt-2 text-neutral-500">
            Follow a proven path from self-discovery to your first day on the job.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm">
            <span className="rounded-full bg-primary-50 px-3 py-1 font-medium text-primary-700">
              Know Yourself
            </span>
            <span className="text-neutral-300">&rarr;</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
              Market Your Brand
            </span>
            <span className="text-neutral-300">&rarr;</span>
            <span className="rounded-full bg-purple-50 px-3 py-1 font-medium text-purple-700">
              Prove Yourself
            </span>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((t) => (
              <Link
                key={t.name}
                href={t.href}
                className="group rounded-xl border border-neutral-150 p-4 transition-[shadow,border-color] hover:shadow-md hover:border-primary-300"
              >
                <t.icon className="h-5 w-5 text-primary-400 transition-colors group-hover:text-primary-500" />
                <h3 className="mt-2 font-semibold text-neutral-800">{t.name}</h3>
                <p className="mt-1 text-xs text-neutral-500">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-150 py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-2xl font-bold text-neutral-800">
            Ready to land your first job?
          </h2>
          <p className="mt-2 text-neutral-500">
            No signup, no credit card. Pick a tool and go.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-400 px-6 py-3 font-medium text-white hover:bg-primary-500"
          >
            Open the Toolkit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-150 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
          <span className="text-xs text-neutral-400">
            CareerReady is free and open to all college graduates.
          </span>
          <nav className="flex gap-4 text-xs text-neutral-400">
            <Link href="/dashboard" className="hover:text-neutral-600">Dashboard</Link>
            <Link href="/know-yourself" className="hover:text-neutral-600">Know Yourself</Link>
            <Link href="/resumes" className="hover:text-neutral-600">Resumes</Link>
            <Link href="/interviews" className="hover:text-neutral-600">Interviews</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
