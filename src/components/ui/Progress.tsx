import { cn } from "@/lib/utils/cn";

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  label?: string;
}

export function Progress({ value, className, label }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">{label}</span>
          <span className="font-medium text-neutral-700">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="h-1.5 w-full rounded-full bg-neutral-150">
        <div
          className="h-full rounded-full bg-primary-400 transition-all duration-300"
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
