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
  nameKey: string;
  shortDesc: string;
  shortDescKey: string;
  longDesc: string;
  longDescKey: string;
  icon: typeof User;
  href: string;
  phase: Phase;
  phaseKey: string;
}

export const toolsConfig: ToolConfig[] = [
  { name: "Know Yourself", nameKey: "tools.knowYourself.name", shortDesc: "Figure out your skills, values, and brand before you start applying.", shortDescKey: "tools.knowYourself.shortDesc", longDesc: "Walk into every application knowing exactly what you bring to the table.", longDescKey: "tools.knowYourself.longDesc", icon: User, href: "/know-yourself", phase: "Know Yourself", phaseKey: "tools.phases.knowYourself" },
  { name: "Applications", nameKey: "tools.applications.name", shortDesc: "Tips and a master form that saves you from re-typing your info.", shortDescKey: "tools.applications.shortDesc", longDesc: "Stop re-typing the same info. One master form fills every application.", longDescKey: "tools.applications.longDesc", icon: FileText, href: "/applications", phase: "Market Your Brand", phaseKey: "tools.phases.marketYourBrand" },
  { name: "Resumes", nameKey: "tools.resumes.name", shortDesc: "Build your resume, cover letter, and reference page. Export as PDF.", shortDescKey: "tools.resumes.shortDesc", longDesc: "Build a resume that pulls from your skills inventory. Export as PDF in one click.", longDescKey: "tools.resumes.longDesc", icon: ScrollText, href: "/resumes", phase: "Market Your Brand", phaseKey: "tools.phases.marketYourBrand" },
  { name: "Interviews", nameKey: "tools.interviews.name", shortDesc: "Practice the STAR method, prep answers, and research companies.", shortDescKey: "tools.interviews.shortDesc", longDesc: "Answer confidently with practiced STAR stories and AI-powered mock interviews.", longDescKey: "tools.interviews.longDesc", icon: MessageSquare, href: "/interviews", phase: "Market Your Brand", phaseKey: "tools.phases.marketYourBrand" },
  { name: "Job Search", nameKey: "tools.jobSearch.name", shortDesc: "Networking contacts, job boards, and a checklist to stay on track.", shortDescKey: "tools.jobSearch.shortDesc", longDesc: "Find openings through networking, job boards, and a daily action checklist.", longDescKey: "tools.jobSearch.longDesc", icon: Search, href: "/job-search", phase: "Market Your Brand", phaseKey: "tools.phases.marketYourBrand" },
  { name: "Social Media", nameKey: "tools.socialMedia.name", shortDesc: "Audit and clean up your profiles before employers look.", shortDescKey: "tools.socialMedia.shortDesc", longDesc: "Clean up your profiles before employers Google you. Takes 10 minutes.", longDescKey: "tools.socialMedia.longDesc", icon: Globe, href: "/social-media", phase: "Market Your Brand", phaseKey: "tools.phases.marketYourBrand" },
  { name: "Landing the Job", nameKey: "tools.landingTheJob.name", shortDesc: "Workplace success tips and self-evaluation tracker.", shortDescKey: "tools.landingTheJob.shortDesc", longDesc: "Crush your first 90 days with workplace tips and a self-evaluation tracker.", longDescKey: "tools.landingTheJob.longDesc", icon: Trophy, href: "/landing-the-job", phase: "Prove Yourself", phaseKey: "tools.phases.proveYourself" },
  { name: "Contact Log", nameKey: "tools.contactLog.name", shortDesc: "Log every company, follow-up, and status change in one place.", shortDescKey: "tools.contactLog.shortDesc", longDesc: "Track every application, follow-up, and interview in one place.", longDescKey: "tools.contactLog.longDesc", icon: BookOpen, href: "/contact-log", phase: "Prove Yourself", phaseKey: "tools.phases.proveYourself" },
];
