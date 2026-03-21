export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-1/3 animate-pulse rounded-lg bg-neutral-200" />
        <div className="h-4 w-2/3 animate-pulse rounded-lg bg-neutral-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm space-y-3">
            <div className="h-5 w-1/3 animate-pulse rounded-lg bg-neutral-200" />
            <div className="h-4 w-2/3 animate-pulse rounded-lg bg-neutral-200" />
            <div className="h-4 w-1/2 animate-pulse rounded-lg bg-neutral-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
