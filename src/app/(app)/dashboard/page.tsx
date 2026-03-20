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
} from "lucide-react";

const tools = [
  {
    name: "Know Yourself",
    description: "Discover your skills, values, and personal brand to build a strong foundation.",
    href: "/know-yourself",
    icon: User,
    phase: "Know Yourself",
  },
  {
    name: "Applications",
    description: "Master the application process with tips, templates, and assessment prep.",
    href: "/applications",
    icon: FileText,
    phase: "Market Your Brand",
  },
  {
    name: "Resumes",
    description: "Build professional resumes, cover letters, and reference pages.",
    href: "/resumes",
    icon: ScrollText,
    phase: "Market Your Brand",
  },
  {
    name: "Interviews",
    description: "Prepare for interviews with STAR method, question practice, and research tools.",
    href: "/interviews",
    icon: MessageSquare,
    phase: "Market Your Brand",
  },
  {
    name: "Job Search",
    description: "Find opportunities through networking, job boards, and strategic outreach.",
    href: "/job-search",
    icon: Search,
    phase: "Market Your Brand",
  },
  {
    name: "Social Media",
    description: "Optimize your online presence and make a great digital first impression.",
    href: "/social-media",
    icon: Globe,
    phase: "Market Your Brand",
  },
  {
    name: "Landing the Job",
    description: "Succeed in your new role with workplace tips and self-evaluation tracking.",
    href: "/landing-the-job",
    icon: Trophy,
    phase: "Prove Yourself",
  },
  {
    name: "Contact Log",
    description: "Track every application, follow-up, and employer interaction in one place.",
    href: "/contact-log",
    icon: BookOpen,
    phase: "Prove Yourself",
  },
];

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
        <h1 className="text-3xl font-bold text-neutral-800">Your Career Toolkit</h1>
        <p className="mt-2 text-neutral-500">
          8 interactive tools to guide you from self-discovery to landing your first job.
        </p>
      </div>

      {/* Journey phases */}
      <div className="mb-8 flex items-center gap-2 text-sm">
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-primary-300"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-400 transition-colors group-hover:bg-primary-100">
                <tool.icon className="h-5 w-5" />
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${phaseColors[tool.phase]}`}>
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
        <h3 className="font-semibold text-primary-800">Getting Started</h3>
        <p className="mt-1 text-sm text-primary-700">
          We recommend starting with <strong>Know Yourself</strong> to identify your skills, values, and personal brand.
          This information flows into your resume, cover letters, and interview preparation automatically.
        </p>
      </div>
    </div>
  );
}
