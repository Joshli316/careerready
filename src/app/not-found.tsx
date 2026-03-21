import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
          <span className="text-2xl font-bold text-primary-400">404</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-800">Page not found</h1>
        <p className="mt-2 text-neutral-500">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-500"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
