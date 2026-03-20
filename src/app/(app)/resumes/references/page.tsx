"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Callout } from "@/components/ui/Callout";
import { Plus, Trash2, CheckCircle } from "lucide-react";

interface Reference {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  relationship: "professional" | "personal";
}

const emptyRef = (): Reference => ({
  name: "",
  title: "",
  company: "",
  phone: "",
  email: "",
  relationship: "professional",
});

export default function ReferencesPage() {
  const [references, setReferences] = useState<Reference[]>([emptyRef(), emptyRef(), emptyRef()]);
  const [saved, setSaved] = useState(false);

  function update(index: number, field: keyof Reference, value: string) {
    const updated = [...references];
    updated[index] = { ...updated[index], [field]: value };
    setReferences(updated);
  }

  function add() {
    setReferences([...references, emptyRef()]);
  }

  function remove(index: number) {
    if (references.length <= 1) return;
    setReferences(references.filter((_, i) => i !== index));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Reference Page</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Build a formatted reference page that matches your resume layout.
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-success">
            <CheckCircle className="h-4 w-4" />
            Saved
          </div>
        )}
      </div>

      <Callout type="tip" className="mb-6">
        Select at least 5 people with accurate contact information. Always ask permission before listing someone as a reference.
        Professional references (co-workers, supervisors, instructors) are preferred.
      </Callout>

      <div className="space-y-4">
        {references.map((ref, i) => (
          <div key={i} className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-600">Reference {i + 1}</span>
                <select
                  value={ref.relationship}
                  onChange={(e) => update(i, "relationship", e.target.value)}
                  className="rounded border border-neutral-200 px-2 py-0.5 text-xs"
                >
                  <option value="professional">Professional</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              {references.length > 1 && (
                <button onClick={() => remove(i)} className="text-neutral-400 hover:text-error">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input placeholder="Full Name" value={ref.name} onChange={(e) => update(i, "name", e.target.value)} />
              <Input placeholder="Job Title" value={ref.title} onChange={(e) => update(i, "title", e.target.value)} />
              <Input placeholder="Company / Organization" value={ref.company} onChange={(e) => update(i, "company", e.target.value)} />
              <Input placeholder="Phone" value={ref.phone} onChange={(e) => update(i, "phone", e.target.value)} />
              <Input placeholder="Email" value={ref.email} onChange={(e) => update(i, "email", e.target.value)} className="sm:col-span-2" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button onClick={add} className="flex items-center gap-1.5 text-sm font-medium text-primary-400 hover:text-primary-500">
          <Plus className="h-4 w-4" />
          Add Reference
        </button>
        <Button onClick={save} size="lg">Save References</Button>
      </div>
    </div>
  );
}
