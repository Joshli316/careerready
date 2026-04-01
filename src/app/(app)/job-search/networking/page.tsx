"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Plus } from "lucide-react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function NetworkingPage() {
  const { t } = useLanguage();
  const { saved, save, storage } = useProfileSave();
  const [professional, setProfessional] = useState(Array(5).fill(""));
  const [personal, setPersonal] = useState(Array(5).fill(""));

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.networkContacts) {
        const nc = profile.networkContacts;
        if (nc.professional?.length) setProfessional(nc.professional);
        if (nc.personal?.length) setPersonal(nc.personal);
      }
    });
  }, [storage]);

  const handleSave = useCallback(
    () => save({ networkContacts: { professional, personal } }),
    [save, professional, personal]
  );

  return (
    <div>
      <Breadcrumb href="/job-search" label={t("jobSearch.title")} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{t("jobSearch.networking.title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">{t("jobSearch.networking.description")}</p>
      </div>

      <Callout type="tip" className="mb-6">
        {t("jobSearch.networking.callout")}
      </Callout>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-1 font-semibold text-neutral-800">{t("jobSearch.networking.professionalTitle")}</h2>
          <p className="mb-4 text-xs text-neutral-500">{t("jobSearch.networking.professionalDesc")}</p>
          <div className="space-y-2">
            {professional.map((v, i) => (
              <Input key={i} placeholder={t("jobSearch.networking.contactN").replace("{n}", String(i + 1))} value={v} onChange={(e) => { const u = [...professional]; u[i] = e.target.value; setProfessional(u); }} />
            ))}
            <button onClick={() => setProfessional([...professional, ""])} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-primary-400 hover:text-primary-500 hover:bg-primary-50 min-h-[44px]"><Plus className="h-4 w-4" /> {t("common.addMore")}</button>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-1 font-semibold text-neutral-800">{t("jobSearch.networking.personalTitle")}</h2>
          <p className="mb-4 text-xs text-neutral-500">{t("jobSearch.networking.personalDesc")}</p>
          <div className="space-y-2">
            {personal.map((v, i) => (
              <Input key={i} placeholder={t("jobSearch.networking.contactN").replace("{n}", String(i + 1))} value={v} onChange={(e) => { const u = [...personal]; u[i] = e.target.value; setPersonal(u); }} />
            ))}
            <button onClick={() => setPersonal([...personal, ""])} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-primary-400 hover:text-primary-500 hover:bg-primary-50 min-h-[44px]"><Plus className="h-4 w-4" /> {t("common.addMore")}</button>
          </div>
        </section>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <SavedIndicator visible={saved} />
        <Button onClick={handleSave} size="lg">{t("jobSearch.networking.saveContacts")}</Button>
      </div>
    </div>
  );
}
