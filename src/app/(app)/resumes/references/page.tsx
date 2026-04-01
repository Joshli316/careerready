"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Plus, Trash2 } from "lucide-react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import type { ReferencesEntry } from "@/types/profile";

const emptyRef = (): ReferencesEntry => ({
  name: "",
  title: "",
  company: "",
  phone: "",
  email: "",
  relationship: "professional",
});

export default function ReferencesPage() {
  const { t } = useLanguage();
  const { saved, save, storage } = useProfileSave();
  const [references, setReferences] = useState<ReferencesEntry[]>([emptyRef(), emptyRef(), emptyRef()]);

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.references) {
        setReferences(profile.references);
      }
    });
  }, [storage]);

  function update(index: number, field: keyof ReferencesEntry, value: string) {
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

  const handleSave = useCallback(() => save({ references }), [save, references]);

  return (
    <div>
      <Breadcrumb href="/resumes" label={t("resumes.title")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("resumes.references.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("resumes.references.description")}
          </p>
        </div>
        <SavedIndicator visible={saved} />
      </div>

      <Callout type="tip" className="mb-6">
        {t("resumes.references.callout")}
      </Callout>

      <div className="space-y-4">
        {references.map((ref, i) => (
          <div key={i} className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-600">{t("resumes.references.referenceN").replace("{n}", String(i + 1))}</span>
                <Select
                  aria-label={`${t("resumes.references.referenceN").replace("{n}", String(i + 1))}`}
                  value={ref.relationship}
                  onChange={(e) => update(i, "relationship", e.target.value)}
                  className="h-auto rounded border px-2 py-0.5 text-xs"
                >
                  <option value="professional">{t("common.professional")}</option>
                  <option value="personal">{t("common.personal")}</option>
                </Select>
              </div>
              {references.length > 1 && (
                <button onClick={() => remove(i)} className="text-neutral-400 hover:text-error">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input placeholder={t("resumes.references.fullName")} value={ref.name} onChange={(e) => update(i, "name", e.target.value)} />
              <Input placeholder={t("resumes.references.jobTitle")} value={ref.title} onChange={(e) => update(i, "title", e.target.value)} />
              <Input placeholder={t("resumes.references.companyOrg")} value={ref.company} onChange={(e) => update(i, "company", e.target.value)} />
              <Input placeholder={t("resumes.references.phone")} value={ref.phone} onChange={(e) => update(i, "phone", e.target.value)} />
              <Input placeholder={t("resumes.references.email")} value={ref.email} onChange={(e) => update(i, "email", e.target.value)} className="sm:col-span-2" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button onClick={add} className="flex items-center gap-1.5 text-sm font-medium text-primary-400 hover:text-primary-500">
          <Plus className="h-4 w-4" />
          {t("resumes.references.addReference")}
        </button>
        <Button onClick={handleSave} size="lg">{t("resumes.references.saveReferences")}</Button>
      </div>
    </div>
  );
}
