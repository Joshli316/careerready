"use client";

import Link from "next/link";

export default function InterviewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <span className="text-2xl text-error">!</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-800">
          Interview prep error
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Something went wrong loading interview prep. Your saved data is safe.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-500"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
