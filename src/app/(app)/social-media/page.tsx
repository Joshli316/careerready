import Link from "next/link";
import { ShieldCheck, Linkedin } from "lucide-react";

const sections = [
  { title: "Online Presence Audit", description: "Review your social media profiles through an employer's eyes.", href: "/social-media/audit", icon: ShieldCheck },
];

export default function SocialMediaPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Social Media</h1>
        <p className="mt-2 text-neutral-500">Optimize your online presence to make a professional impression.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="group flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-primary-300">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-400 group-hover:bg-primary-100"><s.icon className="h-5 w-5" /></div>
            <div><h2 className="font-semibold text-neutral-800">{s.title}</h2><p className="mt-1 text-sm text-neutral-500">{s.description}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
