"use client";

import { useState, useEffect } from "react";
import { Plus, Building2 } from "lucide-react";
import { useStorage } from "@/hooks/useStorage";
import type { EmployerContact } from "@/types/contact";

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
  const [contacts, setContacts] = useState<EmployerContact[]>([]);

  useEffect(() => {
    storage.getContacts().then(setContacts);
  }, [storage]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Contact Log</h1>
          <p className="mt-2 text-neutral-500">
            Track every application, follow-up, and employer interaction.
          </p>
        </div>
      </div>

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
            Start tracking your job applications to stay organized and follow up on time.
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
