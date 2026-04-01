import { Home } from "lucide-react";
import { toolsConfig } from "@/lib/config/tools";

export const navItems = [
  { name: "Home" as const, nameKey: "nav.home" as const, href: "/" as const, icon: Home },
  ...toolsConfig.map((t) => ({ name: t.name, nameKey: t.nameKey, href: t.href, icon: t.icon })),
] as const;
