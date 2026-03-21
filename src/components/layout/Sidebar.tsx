"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { navItems } from "./navItems";

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
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((tool) => {
            const isActive = pathname === tool.href || pathname.startsWith(tool.href + "/");
            return (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "border-l-2 border-l-primary-400 bg-primary-50 text-primary-700"
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
