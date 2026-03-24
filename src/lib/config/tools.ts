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
    shortDesc: "Figure out your skills, values, and brand before you start applying.",
    longDesc: "Walk into every application knowing exactly what you bring to the table.",
    icon: User,
    href: "/know-yourself",
    phase: "Know Yourself",
  },
  {
    name: "Applications",
    shortDesc: "Tips and a master form that saves you from re-typing your info.",
    longDesc: "Stop re-typing the same info. One master form fills every application.",
    icon: FileText,
    href: "/applications",
    phase: "Market Your Brand",
  },
  {
    name: "Resumes",
    shortDesc: "Build your resume, cover letter, and reference page. Export as PDF.",
    longDesc: "Build a resume that pulls from your skills inventory. Export as PDF in one click.",
    icon: ScrollText,
    href: "/resumes",
    phase: "Market Your Brand",
  },
  {
    name: "Interviews",
    shortDesc: "Practice the STAR method, prep answers, and research companies.",
    longDesc: "Answer confidently with practiced STAR stories and AI-powered mock interviews.",
    icon: MessageSquare,
    href: "/interviews",
    phase: "Market Your Brand",
  },
  {
    name: "Job Search",
    shortDesc: "Networking contacts, job boards, and a checklist to stay on track.",
    longDesc: "Find openings through networking, job boards, and a daily action checklist.",
    icon: Search,
    href: "/job-search",
    phase: "Market Your Brand",
  },
  {
    name: "Social Media",
    shortDesc: "Audit and clean up your profiles before employers look.",
    longDesc: "Clean up your profiles before employers Google you. Takes 10 minutes.",
    icon: Globe,
    href: "/social-media",
    phase: "Market Your Brand",
  },
  {
    name: "Landing the Job",
    shortDesc: "Workplace success tips and self-evaluation tracker.",
    longDesc: "Crush your first 90 days with workplace tips and a self-evaluation tracker.",
    icon: Trophy,
    href: "/landing-the-job",
    phase: "Prove Yourself",
  },
  {
    name: "Contact Log",
    shortDesc: "Log every company, follow-up, and status change in one place.",
    longDesc: "Track every application, follow-up, and interview in one place.",
    icon: BookOpen,
    href: "/contact-log",
    phase: "Prove Yourself",
  },
];
