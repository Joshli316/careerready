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

export type Phase = "Know Yourself" | "Market Your Brand" | "Prove Yourself";

export interface ToolConfig {
  name: string;
  shortDesc: string;
  longDesc: string;
  icon: typeof User;
  href: string;
  phase: Phase;
}

export const toolsConfig: ToolConfig[] = [
  {
    name: "Know Yourself",
    shortDesc: "Identify your skills, values, and personal brand before applying anywhere.",
    longDesc: "Figure out your strengths, goals, and elevator pitch before applying anywhere.",
    icon: User,
    href: "/know-yourself",
    phase: "Know Yourself",
  },
  {
    name: "Applications",
    shortDesc: "Tips, templates, and assessment prep to stand out in every application.",
    longDesc: "Fill out any application faster with a master form and keyword tips.",
    icon: FileText,
    href: "/applications",
    phase: "Market Your Brand",
  },
  {
    name: "Resumes",
    shortDesc: "Build your resume, cover letter, and reference page. Export as PDF.",
    longDesc: "Create your resume, cover letter, and reference page. Export as PDF.",
    icon: ScrollText,
    href: "/resumes",
    phase: "Market Your Brand",
  },
  {
    name: "Interviews",
    shortDesc: "Practice the STAR method, prep answers, and research companies.",
    longDesc: "Practice the 8 most common questions and build STAR stories you can reuse.",
    icon: MessageSquare,
    href: "/interviews",
    phase: "Market Your Brand",
  },
  {
    name: "Job Search",
    shortDesc: "Networking strategies, job boards, and outreach templates.",
    longDesc: "Networking scripts, job board strategy, and a checklist to stay on track.",
    icon: Search,
    href: "/job-search",
    phase: "Market Your Brand",
  },
  {
    name: "Social Media",
    shortDesc: "Audit and clean up your profiles before employers look.",
    longDesc: "Audit your profiles before employers Google you.",
    icon: Globe,
    href: "/social-media",
    phase: "Market Your Brand",
  },
  {
    name: "Landing the Job",
    shortDesc: "Workplace success tips and self-evaluation tracker.",
    longDesc: "Tips for your first 90 days and a monthly self-evaluation tracker.",
    icon: Trophy,
    href: "/landing-the-job",
    phase: "Prove Yourself",
  },
  {
    name: "Contact Log",
    shortDesc: "Track every application, employer interaction, and follow-up in one place.",
    longDesc: "Log every application so nothing falls through the cracks.",
    icon: BookOpen,
    href: "/contact-log",
    phase: "Prove Yourself",
  },
];
