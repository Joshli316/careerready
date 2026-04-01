import { cn } from "@/lib/utils/cn";
import { Lightbulb, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";

type CalloutType = "tip" | "warning" | "success" | "ai";

interface CalloutProps {
  type?: CalloutType;
  children: React.ReactNode;
  className?: string;
}

const config: Record<CalloutType, { borderColor: string; bgColor: string; iconColor: string; icon: React.ElementType }> = {
  tip: { borderColor: "border-l-info", bgColor: "bg-blue-50", iconColor: "text-info", icon: Lightbulb },
  warning: { borderColor: "border-l-warning", bgColor: "bg-orange-50", iconColor: "text-warning", icon: AlertTriangle },
  success: { borderColor: "border-l-success", bgColor: "bg-green-50", iconColor: "text-success", icon: CheckCircle },
  ai: { borderColor: "border-l-ai-accent", bgColor: "bg-purple-50", iconColor: "text-ai-accent", icon: Sparkles },
};

export function Callout({ type = "tip", children, className }: CalloutProps) {
  const { borderColor, bgColor, iconColor, icon: Icon } = config[type];
  return (
    <div className={cn("flex gap-3 rounded-lg border-l-4 p-4", borderColor, bgColor, className)}>
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconColor)} aria-hidden="true" />
      <div className="text-sm">{children}</div>
    </div>
  );
}
