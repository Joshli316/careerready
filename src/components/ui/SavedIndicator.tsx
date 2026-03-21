import { CheckCircle } from "lucide-react";

interface SavedIndicatorProps {
  visible: boolean;
}

export function SavedIndicator({ visible }: SavedIndicatorProps) {
  if (!visible) return null;
  return (
    <div className="flex items-center gap-1.5 text-sm text-success">
      <CheckCircle className="h-4 w-4" />
      Saved
    </div>
  );
}
