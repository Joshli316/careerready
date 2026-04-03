"use client";

import { Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import type { EmployerContact, ContactStatus } from "@/types/contact";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const STATUS_KEYS: Record<string, string> = {
  saved: "contactLog.statuses.saved",
  applied: "contactLog.statuses.applied",
  phone_screen: "contactLog.statuses.phoneScreen",
  interview: "contactLog.statuses.interview",
  follow_up: "contactLog.statuses.followUp",
  offer: "contactLog.statuses.offer",
  rejected: "contactLog.statuses.rejected",
  accepted: "contactLog.statuses.accepted",
};

const STATUS_COLORS: Record<string, string> = {
  saved: "bg-neutral-100 text-neutral-600",
  applied: "bg-blue-50 text-blue-700",
  phone_screen: "bg-cyan-50 text-cyan-700",
  interview: "bg-purple-50 text-purple-700",
  follow_up: "bg-orange-50 text-orange-700",
  offer: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  accepted: "bg-primary-50 text-primary-700",
};

interface ContactCardProps {
  contact: EmployerContact;
  isEditing: boolean;
  editCompany: string;
  editPosition: string;
  editStatus: ContactStatus;
  editNotes: string;
  editDateApplied: string;
  editFollowUpDate: string;
  onEditCompanyChange: (value: string) => void;
  onEditPositionChange: (value: string) => void;
  onEditStatusChange: (value: ContactStatus) => void;
  onEditNotesChange: (value: string) => void;
  onEditDateChange: (value: string) => void;
  onEditFollowUpDateChange: (value: string) => void;
  onStartEditing: (contact: EmployerContact) => void;
  onCancelEditing: () => void;
  onSaveEdit: () => void;
  onStatusChange: (contact: EmployerContact, status: ContactStatus) => void;
  onDelete: (contact: EmployerContact) => void;
}

export function ContactCard({
  contact,
  isEditing,
  editCompany,
  editPosition,
  editStatus,
  editNotes,
  editDateApplied,
  editFollowUpDate,
  onEditCompanyChange,
  onEditPositionChange,
  onEditStatusChange,
  onEditNotesChange,
  onEditDateChange,
  onEditFollowUpDateChange,
  onStartEditing,
  onCancelEditing,
  onSaveEdit,
  onStatusChange,
  onDelete,
}: ContactCardProps) {
  const { t } = useLanguage();

  if (isEditing) {
    return (
      <div className="rounded-xl border-2 border-primary-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t("contactLog.form.companyLabel")}
            value={editCompany}
            onChange={(e) => onEditCompanyChange(e.target.value)}
          />
          <Input
            label={t("contactLog.form.positionLabel")}
            value={editPosition}
            onChange={(e) => onEditPositionChange(e.target.value)}
          />
          <Select
            label={t("contactLog.form.statusLabel")}
            value={editStatus}
            onChange={(e) => onEditStatusChange(e.target.value as ContactStatus)}
          >
            {Object.entries(STATUS_KEYS).map(([key, tKey]) => (
              <option key={key} value={key}>
                {t(tKey)}
              </option>
            ))}
          </Select>
          <div className="space-y-1.5">
            <label
              htmlFor={`edit-date-${contact.id}`}
              className="block text-sm font-medium text-neutral-700"
            >
              {t("contactLog.form.dateApplied")}
            </label>
            <input
              id={`edit-date-${contact.id}`}
              type="date"
              value={editDateApplied}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => onEditDateChange(e.target.value)}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:border-primary-400"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor={`edit-followup-${contact.id}`}
              className="block text-sm font-medium text-neutral-700"
            >
              {t("contactLog.form.followUpDate")}
            </label>
            <input
              id={`edit-followup-${contact.id}`}
              type="date"
              value={editFollowUpDate}
              onChange={(e) => onEditFollowUpDateChange(e.target.value)}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:border-primary-400"
            />
          </div>
        </div>
        <div className="mt-4">
          <Textarea
            label={t("contactLog.form.notesLabel")}
            value={editNotes}
            onChange={(e) => onEditNotesChange(e.target.value)}
            rows={2}
          />
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onCancelEditing}>
            <X className="mr-1 h-4 w-4" />
            {t("common.cancel")}
          </Button>
          <Button size="md" onClick={onSaveEdit}>
            <Check className="mr-1 h-4 w-4" />
            {t("contactLog.form.saveChanges")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-xl border border-neutral-150 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-neutral-800">
            {contact.companyName}
          </h3>
          <p className="text-sm text-neutral-500">
            {contact.position}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={contact.status}
            onChange={(e) =>
              onStatusChange(
                contact,
                e.target.value as ContactStatus
              )
            }
            className={`cursor-pointer rounded-full border-0 py-0.5 pl-2.5 pr-7 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${STATUS_COLORS[contact.status]}`}
            aria-label={`Change status for ${contact.companyName}`}
          >
            {Object.entries(STATUS_KEYS).map(([key, tKey]) => (
              <option key={key} value={key}>
                {t(tKey)}
              </option>
            ))}
          </select>

          <button
            onClick={() => onStartEditing(contact)}
            className="rounded-lg p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 sm:opacity-0 transition-opacity hover:bg-neutral-100 hover:text-neutral-600 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            aria-label={`Edit ${contact.companyName}`}
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            onClick={() => onDelete(contact)}
            className="rounded-lg p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 sm:opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
            aria-label={`Delete ${contact.companyName}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {contact.notes && (
        <p className="mt-2 text-sm text-neutral-500">
          {contact.notes}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {contact.dateApplied && (
          <p className="text-xs text-neutral-400">
            {t("contactLog.form.added")}{" "}
            {new Date(contact.dateApplied).toLocaleDateString()}
          </p>
        )}
        {contact.followUpDate && (
          <p className="text-xs text-orange-500 font-medium">
            {t("contactLog.form.followUpDate")}:{" "}
            {new Date(contact.followUpDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
