import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BreadcrumbProps {
  href: string;
  label: string;
}

export function Breadcrumb({ href, label }: BreadcrumbProps) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
