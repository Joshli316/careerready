import { Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import type { EmployerContact, ContactStatus } from "@/types/contact";

const statusLabels: Record<string, { label: string; color: string }> = {
  saved: { label: "Saved", color: "bg-neutral-100 text-neutral-600" },
  applied: { label: "Applied", color: "bg-blue-50 text-blue-700" },
  phone_screen: { label: "Phone Screen", color: "bg-cyan-50 text-cyan-700" },
  interview: { label: "Interview", color: "bg-purple-50 text-purple-700" },
  follow_up: { label: "Follow Up", color: "bg-orange-50 text-orange-700" },
  offer: { label: "Offer", color: "bg-green-50 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-700" },
  accepted: { label: "Accepted", color: "bg-primary-50 text-primary-700" },
};

interface ContactCardProps {
  contact: EmployerContact;
  isEditing: boolean;
  editCompany: string;
  editPosition: string;
  editStatus: ContactStatus;
  editNotes: string;
  editDateApplied: string;
  onEditCompanyChange: (value: string) => void;
  onEditPositionChange: (value: string) => void;
  onEditStatusChange: (value: ContactStatus) => void;
  onEditNotesChange: (value: string) => void;
  onEditDateChange: (value: string) => void;
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
  onEditCompanyChange,
  onEditPositionChange,
  onEditStatusChange,
  onEditNotesChange,
  onEditDateChange,
  onStartEditing,
  onCancelEditing,
  onSaveEdit,
  onStatusChange,
  onDelete,
}: ContactCardProps) {
  if (isEditing) {
    return (
      <div className="rounded-xl border-2 border-primary-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Company"
            value={editCompany}
            onChange={(e) => onEditCompanyChange(e.target.value)}
          />
          <Input
            label="Position"
            value={editPosition}
            onChange={(e) => onEditPositionChange(e.target.value)}
          />
          <Select
            label="Status"
            value={editStatus}
            onChange={(e) => onEditStatusChange(e.target.value as ContactStatus)}
          >
            {Object.entries(statusLabels).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
          <div className="space-y-1.5">
            <label
              htmlFor={`edit-date-${contact.id}`}
              className="block text-sm font-medium text-neutral-700"
            >
              Date Applied
            </label>
            <input
              id={`edit-date-${contact.id}`}
              type="date"
              value={editDateApplied}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => onEditDateChange(e.target.value)}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
            />
          </div>
        </div>
        <div className="mt-4">
          <Textarea
            label="Notes (optional)"
            value={editNotes}
            onChange={(e) => onEditNotesChange(e.target.value)}
            rows={2}
          />
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onCancelEditing}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
          <Button size="md" onClick={onSaveEdit}>
            <Check className="mr-1 h-4 w-4" />
            Save Changes
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
          {/* Inline status dropdown */}
          <select
            value={contact.status}
            onChange={(e) =>
              onStatusChange(
                contact,
                e.target.value as ContactStatus
              )
            }
            className={`cursor-pointer rounded-full border-0 py-0.5 pl-2.5 pr-7 text-xs font-medium ${statusLabels[contact.status]?.color}`}
            aria-label={`Change status for ${contact.companyName}`}
          >
            {Object.entries(statusLabels).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Edit button */}
          <button
            onClick={() => onStartEditing(contact)}
            className="rounded-lg p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 sm:opacity-0 transition-opacity hover:bg-neutral-100 hover:text-neutral-600 group-hover:opacity-100 focus-visible:opacity-100"
            aria-label={`Edit ${contact.companyName}`}
          >
            <Pencil className="h-4 w-4" />
          </button>

          {/* Delete button */}
          <button
            onClick={() => onDelete(contact)}
            className="rounded-lg p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 sm:opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 focus-visible:opacity-100"
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
      {contact.dateApplied && (
        <p className="mt-1 text-xs text-neutral-400">
          Added{" "}
          {new Date(contact.dateApplied).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
