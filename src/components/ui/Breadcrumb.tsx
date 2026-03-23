import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BreadcrumbProps {
  href: string;
  label: string;
}

export function Breadcrumb({ href, label }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:rounded"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>Back to {label}</span>
      </Link>
    </nav>
  );
}
