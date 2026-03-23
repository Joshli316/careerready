import type { Metadata } from "next";
import Link from "next/link";
import { toolsConfig } from "@/lib/config/tools";

export const metadata: Metadata = {
  title: "Your Toolkit",
  description: "Your job search toolkit: 8 free tools from knowing your strengths to landing the job.",
};

const tools = toolsConfig.map((t) => ({
  name: t.name,
  description: t.longDesc,
  href: t.href,
  icon: t.icon,
  phase: t.phase,
}));

const phases = ["Know Yourself", "Market Your Brand", "Prove Yourself"] as const;

const phaseColors: Record<string, string> = {
  "Know Yourself": "bg-primary-50 text-primary-700",
  "Market Your Brand": "bg-blue-50 text-blue-700",
  "Prove Yourself": "bg-purple-50 text-purple-700",
};

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-800 sm:text-3xl">Your Job Search Toolkit</h1>
        <p className="mt-2 text-neutral-500">
          Everything you need to go from "where do I start?" to "I got the job."
        </p>
      </div>

      {/* Phase indicators */}
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm">
        {phases.map((phase, i) => (
          <div key={phase} className="flex items-center gap-2">
            {i > 0 && <span className="text-neutral-300">&rarr;</span>}
            <span className={`rounded-full px-3 py-1 font-medium ${phaseColors[phase]}`}>
              {phase}
            </span>
          </div>
        ))}
      </div>

      {/* Tool grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, i) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`group rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300 ${i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2 flex flex-col justify-between" : ""}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-400 transition-colors group-hover:bg-primary-100">
                <tool.icon className="h-5 w-5" />
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${phaseColors[tool.phase]}`}>
                {tool.phase}
              </span>
            </div>
            <h2 className="mb-1 font-semibold text-neutral-800">{tool.name}</h2>
            <p className="text-xs leading-relaxed text-neutral-500">{tool.description}</p>
          </Link>
        ))}
      </div>

      {/* Bottom callout */}
      <div className="mt-8 rounded-xl border border-primary-200 bg-primary-50 p-6">
        <h3 className="font-semibold text-primary-800">Start here</h3>
        <p className="mt-1 text-sm text-primary-700">
          Open <strong>Know Yourself</strong> first. The skills and brand statement you write there
          will auto-fill your resume, cover letter, and interview prep, so you only write them once.
        </p>
        <Link
          href="/know-yourself"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-800"
        >
          Open Know Yourself &rarr;
        </Link>
      </div>
    </div>
  );
}
