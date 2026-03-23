import { LayoutDashboard } from "lucide-react";
import { toolsConfig } from "@/lib/config/tools";

export const navItems = [
  { name: "Dashboard" as const, href: "/dashboard" as const, icon: LayoutDashboard },
  ...toolsConfig.map((t) => ({ name: t.name, href: t.href, icon: t.icon })),
] as const;
