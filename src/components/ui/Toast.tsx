"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { CheckCircle, AlertTriangle, XCircle, X, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles: Record<ToastType, string> = {
  success: "border-l-success bg-green-50 text-green-800",
  error: "border-l-error bg-red-50 text-red-800",
  warning: "border-l-warning bg-orange-50 text-orange-800",
  info: "border-l-info bg-blue-50 text-blue-800",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = `toast-${++counterRef.current}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border-l-4 px-4 py-3 shadow-lg",
                "animate-in slide-in-from-right duration-300",
                "min-w-[280px] max-w-[400px]",
                styles[t.type]
              )}
              role="alert"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-sm">{t.message}</span>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 rounded p-1 hover:bg-black/5"
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
