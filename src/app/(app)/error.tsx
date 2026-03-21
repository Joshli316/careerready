"use client";

export default function Error({
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
        <h1 className="text-2xl font-bold text-neutral-800">Something went wrong</h1>
        <p className="mt-2 text-sm text-neutral-500">
          An unexpected error occurred. Your saved data is safe.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
