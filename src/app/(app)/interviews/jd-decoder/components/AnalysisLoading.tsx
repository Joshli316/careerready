"use client";

export function AnalysisLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-48 rounded bg-neutral-200" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-neutral-100" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-neutral-100" />
        ))}
      </div>
      <p className="text-center text-sm text-neutral-500">Analyzing job description...</p>
    </div>
  );
}
