"use client";

import { useRef, useEffect, useId } from "react";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useLanguage();
  const uniqueId = useId();
  const titleId = `${uniqueId}-title`;
  const messageId = `${uniqueId}-message`;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      className="fixed inset-0 z-50 m-auto w-full max-w-sm rounded-xl border border-neutral-150 bg-white p-6 shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      onClose={onCancel}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-5 w-5 text-error" />
        </div>
        <div>
          <h3 id={titleId} className="font-semibold text-neutral-800">{title}</h3>
          <p id={messageId} className="mt-1 text-sm text-neutral-500">{message}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
