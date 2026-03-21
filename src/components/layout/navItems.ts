import {
  User,
  FileText,
  ScrollText,
  MessageSquare,
  Search,
  Globe,
  Trophy,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";

export const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Know Yourself", href: "/know-yourself", icon: User },
  { name: "Applications", href: "/applications", icon: FileText },
  { name: "Resumes", href: "/resumes", icon: ScrollText },
  { name: "Interviews", href: "/interviews", icon: MessageSquare },
  { name: "Job Search", href: "/job-search", icon: Search },
  { name: "Social Media", href: "/social-media", icon: Globe },
  { name: "Landing the Job", href: "/landing-the-job", icon: Trophy },
  { name: "Contact Log", href: "/contact-log", icon: BookOpen },
] as const;
