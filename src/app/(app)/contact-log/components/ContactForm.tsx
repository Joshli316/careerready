import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import type { ContactStatus } from "@/types/contact";

const statusLabels: Record<string, { label: string }> = {
  saved: { label: "Saved" },
  applied: { label: "Applied" },
  phone_screen: { label: "Phone Screen" },
  interview: { label: "Interview" },
  follow_up: { label: "Follow Up" },
  offer: { label: "Offer" },
  rejected: { label: "Rejected" },
  accepted: { label: "Accepted" },
};

interface ContactFormProps {
  formCompany: string;
  formPosition: string;
  formStatus: ContactStatus;
  formNotes: string;
  onCompanyChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onStatusChange: (value: ContactStatus) => void;
  onNotesChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ContactForm({
  formCompany,
  formPosition,
  formStatus,
  formNotes,
  onCompanyChange,
  onPositionChange,
  onStatusChange,
  onNotesChange,
  onSave,
  onCancel,
}: ContactFormProps) {
  return (
    <div className="mb-6 rounded-xl border border-primary-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-semibold text-neutral-800">New Contact</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Company" placeholder="Company name" value={formCompany} onChange={(e) => onCompanyChange(e.target.value)} />
        <Input label="Position" placeholder="Job title you applied for" value={formPosition} onChange={(e) => onPositionChange(e.target.value)} />
        <Select label="Status" value={formStatus} onChange={(e) => onStatusChange(e.target.value as ContactStatus)}>
          {Object.entries(statusLabels).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </Select>
      </div>
      <div className="mt-4">
        <Textarea label="Notes (optional)" placeholder="How you found this job, contact person, etc." value={formNotes} onChange={(e) => onNotesChange(e.target.value)} rows={2} />
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <Button variant="ghost" size="md" onClick={onCancel}>Cancel</Button>
        <Button size="md" onClick={onSave}>Save Contact</Button>
      </div>
    </div>
  );
}
