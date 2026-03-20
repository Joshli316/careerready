import { cn } from "@/lib/utils/cn";
import { Lightbulb, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";

type CalloutType = "tip" | "warning" | "success" | "ai";

interface CalloutProps {
  type?: CalloutType;
  children: React.ReactNode;
  className?: string;
}

const config: Record<CalloutType, { borderColor: string; bgColor: string; icon: React.ElementType }> = {
  tip: { borderColor: "border-l-info", bgColor: "bg-blue-50", icon: Lightbulb },
  warning: { borderColor: "border-l-warning", bgColor: "bg-orange-50", icon: AlertTriangle },
  success: { borderColor: "border-l-success", bgColor: "bg-green-50", icon: CheckCircle },
  ai: { borderColor: "border-l-ai-accent", bgColor: "bg-purple-50", icon: Sparkles },
};

export function Callout({ type = "tip", children, className }: CalloutProps) {
  const { borderColor, bgColor, icon: Icon } = config[type];
  return (
    <div className={cn("flex gap-3 rounded-lg border-l-4 p-4", borderColor, bgColor, className)}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="text-sm">{children}</div>
    </div>
  );
}
