import Link from "next/link";
import {
  User,
  ScrollText,
  MessageSquare,
  Search,
  Trophy,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { toolsConfig } from "@/lib/config/tools";

const tools = toolsConfig.map((t) => ({
  name: t.name,
  desc: t.shortDesc,
  icon: t.icon,
  href: t.href,
}));

const benefits = [
  "No account required \u2014 start right away",
  "Your data stays in your browser",
  "Skills flow into your resume automatically",
  "Export resumes and cover letters as PDF",
  "100% free, forever",
];

const phases = [
  { label: "Know Yourself", tools: ["Know Yourself"], color: "bg-primary-50 text-primary-700" },
  { label: "Market Your Brand", tools: ["Applications", "Resumes", "Interviews", "Job Search", "Social Media"], color: "bg-blue-50 text-blue-700" },
  { label: "Prove Yourself", tools: ["Landing the Job", "Contact Log"], color: "bg-purple-50 text-purple-700" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-neutral-150 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900">
                <span className="text-sm font-bold text-white">CR</span>
              </div>
              <span className="text-base font-semibold text-neutral-900">CareerReady</span>
            </Link>
            <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
              <Link href="/know-yourself" className="rounded px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
                Tools
              </Link>
              <Link href="/resumes" className="rounded px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
                Resumes
              </Link>
              <Link href="/interviews" className="rounded px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
                Interviews
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary-400 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-500 min-h-[44px] inline-flex items-center"
            >
              Open Toolkit
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1080px] px-6 pb-6 pt-16 md:pt-24">
        <div className="grid items-center gap-10 md:grid-cols-[1fr,auto]">
          <div>
            <h1 className="max-w-2xl text-3xl font-bold leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl md:text-[64px] md:leading-[1.0]">
              Your first job starts here.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-neutral-500">
              8 free tools that walk you from figuring out your strengths to acing
              the interview. Work at your own pace, on your own schedule.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-400 px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
          >
            Start Your Job Search <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#tools"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
          >
            Explore the 8 tools <ArrowRight className="h-4 w-4" />
          </Link>
            </div>
          </div>
          {/* Visual anchor — asymmetric element */}
          <div className="hidden md:flex flex-col gap-3 items-end">
            <div className="flex gap-3">
              <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center"><ScrollText className="h-7 w-7 text-blue-500" /></div>
              <div className="h-16 w-16 rounded-2xl bg-primary-50 flex items-center justify-center"><User className="h-7 w-7 text-primary-400" /></div>
            </div>
            <div className="flex gap-3 -mr-4">
              <div className="h-16 w-16 rounded-2xl bg-purple-50 flex items-center justify-center"><MessageSquare className="h-7 w-7 text-purple-500" /></div>
              <div className="h-16 w-16 rounded-2xl bg-neutral-100 flex items-center justify-center"><Trophy className="h-7 w-7 text-neutral-500" /></div>
              <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center"><Search className="h-7 w-7 text-blue-400" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-[1080px] px-6 pb-16 pt-8">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2">
          {benefits.map((b) => (
            <span key={b} className="flex items-center gap-1.5 text-sm text-neutral-500">
              <CheckCircle className="h-3.5 w-3.5 shrink-0 text-primary-400" aria-hidden="true" />
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-neutral-150" />

      {/* Social proof */}
      <section className="mx-auto max-w-[1080px] px-6 py-6 text-center">
        <p className="text-sm text-neutral-400">
          Based on a proven career readiness curriculum used by workforce development programs.
        </p>
      </section>

      {/* Tools Section */}
      <section id="tools" className="bg-neutral-50 py-20">
        <div className="mx-auto max-w-[1080px] px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              Everything you need, in the right order
            </h2>
            <p className="mt-3 text-base text-neutral-500">
              Three phases, eight tools. Work through them in order or jump to what you need.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              {phases.map((phase, i) => (
                <span key={phase.label} className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 font-medium ${phase.color}`}>
                    {phase.label}
                  </span>
                  {i < phases.length - 1 && (
                    <ArrowRight className="h-3.5 w-3.5 text-neutral-300" />
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((t) => (
              <Link
                key={t.name}
                href={t.href}
                className="group rounded-xl border border-neutral-200 bg-white p-5 transition-[shadow,border-color] hover:border-neutral-300 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 transition-colors group-hover:bg-blue-50">
                  <t.icon className="h-5 w-5 text-neutral-600 transition-colors group-hover:text-blue-500" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-neutral-900">{t.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-neutral-150" />

      {/* Bottom CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1080px] px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            Ready to land your first job?
          </h2>
          <p className="mt-3 text-base text-neutral-500">
            No signup, no credit card. You could have your resume done in 20 minutes.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary-400 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
          >
            Open the Toolkit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-150 bg-neutral-50">
        <div className="mx-auto max-w-[1080px] px-6 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900">
                  <span className="text-xs font-bold text-white">CR</span>
                </div>
                <span className="text-sm font-semibold text-neutral-900">CareerReady</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-neutral-400">
                8 free job prep tools for college graduates. No account needed, your data stays in your browser.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Core Tools</h4>
              <nav aria-label="Core Tools links" className="mt-3 flex flex-col gap-2">
                <Link href="/dashboard" className="text-sm text-neutral-600 hover:text-neutral-900">Dashboard</Link>
                <Link href="/know-yourself" className="text-sm text-neutral-600 hover:text-neutral-900">Know Yourself</Link>
                <Link href="/resumes" className="text-sm text-neutral-600 hover:text-neutral-900">Resume Builder</Link>
                <Link href="/interviews" className="text-sm text-neutral-600 hover:text-neutral-900">Interview Prep</Link>
              </nav>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">More Tools</h4>
              <nav aria-label="More Tools links" className="mt-3 flex flex-col gap-2">
                <Link href="/applications" className="text-sm text-neutral-600 hover:text-neutral-900">Applications</Link>
                <Link href="/job-search" className="text-sm text-neutral-600 hover:text-neutral-900">Job Search</Link>
                <Link href="/social-media" className="text-sm text-neutral-600 hover:text-neutral-900">Social Media</Link>
                <Link href="/contact-log" className="text-sm text-neutral-600 hover:text-neutral-900">Contact Log</Link>
              </nav>
            </div>
          </div>
          <div className="mt-10 border-t border-neutral-200 pt-6">
            <p className="text-xs text-neutral-400">
              100% free. No account required. Start your job search today.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
