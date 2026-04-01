"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import type { ContactStatus } from "@/types/contact";
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
  const { t } = useLanguage();

  return (
    <div className="mb-6 rounded-xl border border-primary-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-semibold text-neutral-800">{t("contactLog.form.newContact")}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={t("contactLog.form.companyLabel")} placeholder={t("contactLog.form.companyPlaceholder")} value={formCompany} onChange={(e) => onCompanyChange(e.target.value)} />
        <Input label={t("contactLog.form.positionLabel")} placeholder={t("contactLog.form.positionPlaceholder")} value={formPosition} onChange={(e) => onPositionChange(e.target.value)} />
        <Select label={t("contactLog.form.statusLabel")} value={formStatus} onChange={(e) => onStatusChange(e.target.value as ContactStatus)}>
          {Object.entries(STATUS_KEYS).map(([key, tKey]) => (
            <option key={key} value={key}>{t(tKey)}</option>
          ))}
        </Select>
      </div>
      <div className="mt-4">
        <Textarea label={t("contactLog.form.notesLabel")} placeholder={t("contactLog.form.notesPlaceholder")} value={formNotes} onChange={(e) => onNotesChange(e.target.value)} rows={2} />
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <Button variant="ghost" size="md" onClick={onCancel}>{t("common.cancel")}</Button>
        <Button size="md" onClick={onSave}>{t("contactLog.form.saveContact")}</Button>
      </div>
    </div>
  );
}
