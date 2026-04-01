"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Building2 } from "lucide-react";
import { useStorage } from "@/hooks/useStorage";
import { useToast } from "@/components/ui/Toast";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { nanoid } from "nanoid";
import type { EmployerContact, ContactStatus } from "@/types/contact";
import { ContactStats } from "./components/ContactStats";
import { ContactForm } from "./components/ContactForm";
import { ContactCard } from "./components/ContactCard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const statusKeys: Record<string, string> = {
  saved: "contactLog.statuses.saved",
  applied: "contactLog.statuses.applied",
  phone_screen: "contactLog.statuses.phoneScreen",
  interview: "contactLog.statuses.interview",
  follow_up: "contactLog.statuses.followUp",
  offer: "contactLog.statuses.offer",
  rejected: "contactLog.statuses.rejected",
  accepted: "contactLog.statuses.accepted",
};

export default function ContactLogPage() {
  const { t } = useLanguage();
  const storage = useStorage();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<EmployerContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formCompany, setFormCompany] = useState("");
  const [formPosition, setFormPosition] = useState("");
  const [formStatus, setFormStatus] = useState<ContactStatus>("applied");
  const [formNotes, setFormNotes] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCompany, setEditCompany] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editStatus, setEditStatus] = useState<ContactStatus>("applied");
  const [editNotes, setEditNotes] = useState("");
  const [editDateApplied, setEditDateApplied] = useState("");

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<EmployerContact | null>(null);

  useEffect(() => {
    storage.getContacts()
      .then((data) => setContacts(data))
      .catch(() => toast(t("contactLog.loadError"), "error"))
      .finally(() => setLoading(false));
  }, [storage, toast, t]);

  const addContact = useCallback(async () => {
    if (!formCompany.trim() || !formPosition.trim()) return;
    const now = new Date().toISOString();
    const contact: EmployerContact = {
      id: nanoid(),
      companyName: formCompany.trim(),
      position: formPosition.trim(),
      status: formStatus,
      notes: formNotes.trim() || undefined,
      dateApplied: now,
      createdAt: now,
      updatedAt: now,
    };
    await storage.saveContact(contact);
    setContacts(await storage.getContacts());
    setFormCompany("");
    setFormPosition("");
    setFormStatus("applied");
    setFormNotes("");
    setShowForm(false);
    toast(t("contactLog.contactAdded"));
  }, [storage, formCompany, formPosition, formStatus, formNotes, toast, t]);

  const startEditing = useCallback((contact: EmployerContact) => {
    setEditingId(contact.id);
    setEditCompany(contact.companyName);
    setEditPosition(contact.position);
    setEditStatus(contact.status);
    setEditNotes(contact.notes ?? "");
    setEditDateApplied(
      contact.dateApplied
        ? new Date(contact.dateApplied).toISOString().split("T")[0]
        : ""
    );
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingId) return;
    if (!editCompany.trim() || !editPosition.trim()) {
      toast(t("contactLog.validationError"), "error");
      return;
    }
    const existing = contacts.find((c) => c.id === editingId);
    if (!existing) return;

    const updated: EmployerContact = {
      ...existing,
      companyName: editCompany.trim(),
      position: editPosition.trim(),
      status: editStatus,
      notes: editNotes.trim() || undefined,
      dateApplied: editDateApplied
        ? new Date(editDateApplied).toISOString()
        : existing.dateApplied,
      updatedAt: new Date().toISOString(),
    };

    await storage.saveContact(updated);
    setContacts(await storage.getContacts());
    setEditingId(null);
    toast(t("contactLog.contactUpdated"));
  }, [
    editingId,
    editCompany,
    editPosition,
    editStatus,
    editNotes,
    editDateApplied,
    contacts,
    storage,
    toast,
    t,
  ]);

  const handleStatusChange = useCallback(
    async (contact: EmployerContact, newStatus: ContactStatus) => {
      const updated: EmployerContact = {
        ...contact,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      await storage.saveContact(updated);
      setContacts(await storage.getContacts());
      const translatedStatus = t(statusKeys[newStatus] ?? `contactLog.statuses.${newStatus}`);
      toast(t("contactLog.statusChanged").replace("{status}", translatedStatus));
    },
    [storage, toast, t]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await storage.deleteContact(deleteTarget.id);
    setContacts(await storage.getContacts());
    setDeleteTarget(null);
    toast(t("contactLog.contactDeleted"));
  }, [deleteTarget, storage, toast, t]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">{t("contactLog.title")}</h1>
          <p className="mt-2 text-neutral-500">
            {t("contactLog.description")}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="md" className="self-start sm:self-auto">
          <Plus className="mr-1.5 h-4 w-4" />
          {t("contactLog.addContact")}
        </Button>
      </div>

      {showForm && (
        <ContactForm
          formCompany={formCompany}
          formPosition={formPosition}
          formStatus={formStatus}
          formNotes={formNotes}
          onCompanyChange={setFormCompany}
          onPositionChange={setFormPosition}
          onStatusChange={setFormStatus}
          onNotesChange={setFormNotes}
          onSave={addContact}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="space-y-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
      <>
      <ContactStats contacts={contacts} />

      {contacts.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-neutral-200 p-12 text-center">
          <Building2 className="mx-auto h-10 w-10 text-neutral-300" />
          <h3 className="mt-4 font-semibold text-neutral-700">{t("contactLog.emptyTitle")}</h3>
          <p className="mt-1 text-sm text-neutral-500">
            {t("contactLog.emptyDesc")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...contacts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isEditing={editingId === contact.id}
              editCompany={editCompany}
              editPosition={editPosition}
              editStatus={editStatus}
              editNotes={editNotes}
              editDateApplied={editDateApplied}
              onEditCompanyChange={setEditCompany}
              onEditPositionChange={setEditPosition}
              onEditStatusChange={setEditStatus}
              onEditNotesChange={setEditNotes}
              onEditDateChange={setEditDateApplied}
              onStartEditing={startEditing}
              onCancelEditing={cancelEditing}
              onSaveEdit={saveEdit}
              onStatusChange={handleStatusChange}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}
      </>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title={t("contactLog.deleteTitle")}
        message={
          deleteTarget
            ? t("contactLog.deleteConfirm").replace("{name}", deleteTarget.companyName)
            : ""
        }
        confirmLabel={t("common.delete")}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
