"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
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

const tools = [
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-neutral-150 md:bg-white">
      <div className="flex h-16 items-center border-b border-neutral-150 px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-400">
            <span className="text-sm font-bold text-white">CR</span>
          </div>
          <span className="text-lg font-bold text-neutral-800">CareerReady</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {tools.map((tool) => {
            const isActive = pathname === tool.href || pathname.startsWith(tool.href + "/");
            return (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "border-l-3 border-l-primary-400 bg-primary-50 text-primary-700"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                  )}
                >
                  <tool.icon className="h-5 w-5 shrink-0" />
                  {tool.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
