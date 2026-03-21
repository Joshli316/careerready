import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Social Media",
  description: "Audit your social media profiles before employers Google you. Platform-specific tips included.",
};
import { ShieldCheck } from "lucide-react";

const sections = [
  { title: "Online Presence Audit", description: "Review your social media profiles through an employer's eyes.", href: "/social-media/audit", icon: ShieldCheck },
];

const platformTips = [
  { name: "LinkedIn", tip: "Build a complete profile, add a professional photo, and request recommendations from professors or supervisors." },
  { name: "X (Twitter)", tip: "Follow companies you want to work for. Share industry articles. Keep your handle professional." },
  { name: "Instagram", tip: "Set personal accounts to private. If public, make sure posts match your professional brand." },
  { name: "Facebook", tip: "Review tagged photos and old posts. Adjust privacy settings so only friends see personal content." },
];

export default function SocialMediaPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Social Media</h1>
        <p className="mt-2 text-neutral-500">Clean up your profiles before employers Google you.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="group flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-400 group-hover:bg-primary-100"><s.icon className="h-5 w-5" /></div>
            <div><h2 className="font-semibold text-neutral-800">{s.title}</h2><p className="mt-1 text-sm text-neutral-500">{s.description}</p></div>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-xl font-bold text-neutral-800">Platform Quick Tips</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {platformTips.map((p) => (
          <div key={p.name} className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-neutral-800">{p.name}</h3>
            <p className="mt-1 text-sm text-neutral-500">{p.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
