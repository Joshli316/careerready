import { Home } from "lucide-react";
import { toolsConfig } from "@/lib/config/tools";

export const navItems = [
  { name: "Home" as const, href: "/" as const, icon: Home },
  ...toolsConfig.map((t) => ({ name: t.name, href: t.href, icon: t.icon })),
] as const;
