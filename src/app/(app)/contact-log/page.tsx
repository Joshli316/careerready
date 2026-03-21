"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Building2 } from "lucide-react";
import { useStorage } from "@/hooks/useStorage";
import { useToast } from "@/components/ui/Toast";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { nanoid } from "nanoid";
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

export default function ContactLogPage() {
  const storage = useStorage();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<EmployerContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formCompany, setFormCompany] = useState("");
  const [formPosition, setFormPosition] = useState("");
  const [formStatus, setFormStatus] = useState<ContactStatus>("applied");
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    storage.getContacts().then((data) => {
      setContacts(data);
      setLoading(false);
    });
  }, [storage]);

  const addContact = useCallback(async () => {
    if (!formCompany.trim()) return;
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
    toast("Contact added");
  }, [storage, formCompany, formPosition, formStatus, formNotes, toast]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Contact Log</h1>
          <p className="mt-2 text-neutral-500">
            Track every application, follow-up, and employer interaction.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="md">
          <Plus className="mr-1.5 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-primary-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-neutral-800">New Contact</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Company" placeholder="Company name" value={formCompany} onChange={(e) => setFormCompany(e.target.value)} />
            <Input label="Position" placeholder="Job title you applied for" value={formPosition} onChange={(e) => setFormPosition(e.target.value)} />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Status</label>
              <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as ContactStatus)} className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm">
                {Object.entries(statusLabels).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <Textarea label="Notes (optional)" placeholder="How you found this job, contact person, etc." value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={2} />
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button size="sm" onClick={addContact}>Save Contact</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
      <>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", count: contacts.length },
          { label: "Applied", count: contacts.filter((c) => c.status === "applied").length },
          { label: "Interviews", count: contacts.filter((c) => c.status === "interview").length },
          { label: "Offers", count: contacts.filter((c) => c.status === "offer" || c.status === "accepted").length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-neutral-150 bg-white p-4 text-center">
            <div className="text-2xl font-bold text-neutral-800">{stat.count}</div>
            <div className="text-xs text-neutral-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-neutral-200 p-12 text-center">
          <Building2 className="mx-auto h-10 w-10 text-neutral-300" />
          <h3 className="mt-4 font-semibold text-neutral-700">No contacts yet</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Click "Add Contact" above to start tracking your applications.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="rounded-xl border border-neutral-150 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-800">{contact.companyName}</h3>
                  <p className="text-sm text-neutral-500">{contact.position}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusLabels[contact.status]?.color}`}>
                  {statusLabels[contact.status]?.label}
                </span>
              </div>
              {contact.notes && <p className="mt-2 text-sm text-neutral-500">{contact.notes}</p>}
              {contact.dateApplied && (
                <p className="mt-1 text-xs text-neutral-400">
                  Added {new Date(contact.dateApplied).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      </>
      )}
    </div>
  );
}
