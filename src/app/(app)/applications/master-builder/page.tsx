"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useProfileSave } from "@/hooks/useProfileSave";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Plus, Trash2 } from "lucide-react";
import type { MasterApp, MasterAppWorkEntry } from "@/types/profile";

const emptyWork = (): MasterAppWorkEntry => ({
  company: "", title: "", startDate: "", endDate: "", duties: "", reasonLeft: "", supervisorName: "", supervisorPhone: "",
});

const emptyApp: MasterApp = {
  name: "", address: "", phone: "", email: "",
  education: [{ school: "", degree: "", dates: "", location: "" }],
  workHistory: [emptyWork()],
  skills: "", languages: "", certifications: "",
  references: [{ name: "", phone: "", email: "", occupation: "", yearsKnown: "" }],
};

export default function MasterBuilderPage() {
  const { t } = useLanguage();
  const { saved, save, storage } = useProfileSave();
  const [masterApp, setMasterApp] = useState<MasterApp>(emptyApp);

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.masterApp) {
        setMasterApp(profile.masterApp);
      }
    });
  }, [storage]);

  const handleSave = useCallback(() => save({ masterApp }), [save, masterApp]);

  return (
    <div>
      <Breadcrumb href="/applications" label={t("applications.title")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("applications.masterBuilder.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("applications.masterBuilder.description")}
          </p>
        </div>
        <SavedIndicator visible={saved} />
      </div>

      <Callout type="tip" className="mb-6">
        {t("applications.masterBuilder.callout")}
      </Callout>

      <div className="space-y-6">
        {/* Personal Info */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800">{t("applications.masterBuilder.personalInfo")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t("applications.masterBuilder.fullName")} value={masterApp.name} onChange={(e) => setMasterApp({ ...masterApp, name: e.target.value })} placeholder={t("applications.masterBuilder.namePlaceholder")} />
            <Input label={t("applications.masterBuilder.phone")} value={masterApp.phone} onChange={(e) => setMasterApp({ ...masterApp, phone: e.target.value })} placeholder={t("applications.masterBuilder.phonePlaceholder")} />
            <Input label={t("applications.masterBuilder.email")} value={masterApp.email} onChange={(e) => setMasterApp({ ...masterApp, email: e.target.value })} placeholder={t("applications.masterBuilder.emailPlaceholder")} />
            <Input label={t("applications.masterBuilder.address")} value={masterApp.address} onChange={(e) => setMasterApp({ ...masterApp, address: e.target.value })} placeholder={t("applications.masterBuilder.addressPlaceholder")} />
          </div>
        </section>

        {/* Education */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800">{t("applications.masterBuilder.education")}</h2>
            <Button variant="ghost" size="sm" onClick={() => setMasterApp({ ...masterApp, education: [...masterApp.education, { school: "", degree: "", dates: "", location: "" }] })}>
              <Plus className="mr-1 h-4 w-4" />{t("common.add")}
            </Button>
          </div>
          {masterApp.education.map((edu, i) => (
            <div key={i} className="mb-3 rounded-lg border border-neutral-100 p-4 last:mb-0">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder={t("applications.masterBuilder.schoolPlaceholder")} value={edu.school} onChange={(e) => { const u = [...masterApp.education]; u[i] = { ...u[i], school: e.target.value }; setMasterApp({ ...masterApp, education: u }); }} />
                <Input placeholder={t("applications.masterBuilder.degreePlaceholder")} value={edu.degree} onChange={(e) => { const u = [...masterApp.education]; u[i] = { ...u[i], degree: e.target.value }; setMasterApp({ ...masterApp, education: u }); }} />
                <Input placeholder={t("applications.masterBuilder.locationPlaceholder")} value={edu.location} onChange={(e) => { const u = [...masterApp.education]; u[i] = { ...u[i], location: e.target.value }; setMasterApp({ ...masterApp, education: u }); }} />
                <Input placeholder={t("applications.masterBuilder.datesPlaceholder")} value={edu.dates} onChange={(e) => { const u = [...masterApp.education]; u[i] = { ...u[i], dates: e.target.value }; setMasterApp({ ...masterApp, education: u }); }} />
              </div>
            </div>
          ))}
        </section>

        {/* Work History */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800">{t("applications.masterBuilder.employmentHistory")}</h2>
            <Button variant="ghost" size="sm" onClick={() => setMasterApp({ ...masterApp, workHistory: [...masterApp.workHistory, emptyWork()] })}>
              <Plus className="mr-1 h-4 w-4" />{t("common.add")}
            </Button>
          </div>
          {masterApp.workHistory.map((work, i) => (
            <div key={i} className="mb-4 rounded-lg border border-neutral-100 p-4 last:mb-0">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-600">{t("applications.masterBuilder.positionN").replace("{n}", String(i + 1))}</span>
                {masterApp.workHistory.length > 1 && (
                  <button onClick={() => setMasterApp({ ...masterApp, workHistory: masterApp.workHistory.filter((_, j) => j !== i) })} className="text-neutral-400 hover:text-error" aria-label={t("applications.masterBuilder.positionN").replace("{n}", String(i + 1)) + " " + t("common.remove")}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder={t("applications.masterBuilder.companyPlaceholder")} value={work.company} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], company: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} />
                <Input placeholder={t("applications.masterBuilder.jobTitlePlaceholder")} value={work.title} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], title: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} />
                <Input placeholder={t("applications.masterBuilder.startDatePlaceholder")} value={work.startDate} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], startDate: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} />
                <Input placeholder={t("applications.masterBuilder.endDatePlaceholder")} value={work.endDate} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], endDate: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} />
                <Input placeholder={t("applications.masterBuilder.supervisorPlaceholder")} value={work.supervisorName} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], supervisorName: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} />
                <Input placeholder={t("applications.masterBuilder.reasonPlaceholder")} value={work.reasonLeft} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], reasonLeft: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} />
              </div>
              <div className="mt-3">
                <Textarea placeholder={t("applications.masterBuilder.dutiesPlaceholder")} value={work.duties} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], duties: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} rows={3} />
              </div>
            </div>
          ))}
        </section>

        {/* Skills & Certs */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800">{t("applications.masterBuilder.skillsQualifications")}</h2>
          <div className="space-y-4">
            <Textarea label={t("applications.masterBuilder.skillsLabel")} placeholder={t("applications.masterBuilder.skillsPlaceholder")} value={masterApp.skills} onChange={(e) => setMasterApp({ ...masterApp, skills: e.target.value })} rows={3} />
            <Input label={t("applications.masterBuilder.languagesLabel")} placeholder={t("applications.masterBuilder.languagesPlaceholder")} value={masterApp.languages} onChange={(e) => setMasterApp({ ...masterApp, languages: e.target.value })} />
            <Textarea label={t("applications.masterBuilder.certsLabel")} placeholder={t("applications.masterBuilder.certsPlaceholder")} value={masterApp.certifications} onChange={(e) => setMasterApp({ ...masterApp, certifications: e.target.value })} rows={2} />
          </div>
        </section>

        {/* References */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800">{t("applications.masterBuilder.references")}</h2>
            <Button variant="ghost" size="sm" onClick={() => setMasterApp({ ...masterApp, references: [...masterApp.references, { name: "", phone: "", email: "", occupation: "", yearsKnown: "" }] })}>
              <Plus className="mr-1 h-4 w-4" />{t("common.add")}
            </Button>
          </div>
          {masterApp.references.map((ref, i) => (
            <div key={i} className="mb-3 rounded-lg border border-neutral-100 p-4 last:mb-0">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder={t("applications.masterBuilder.refNamePlaceholder")} value={ref.name} onChange={(e) => { const u = [...masterApp.references]; u[i] = { ...u[i], name: e.target.value }; setMasterApp({ ...masterApp, references: u }); }} />
                <Input placeholder={t("applications.masterBuilder.refPhonePlaceholder")} value={ref.phone} onChange={(e) => { const u = [...masterApp.references]; u[i] = { ...u[i], phone: e.target.value }; setMasterApp({ ...masterApp, references: u }); }} />
                <Input placeholder={t("applications.masterBuilder.refEmailPlaceholder")} value={ref.email} onChange={(e) => { const u = [...masterApp.references]; u[i] = { ...u[i], email: e.target.value }; setMasterApp({ ...masterApp, references: u }); }} />
                <Input placeholder={t("applications.masterBuilder.refOccupationPlaceholder")} value={ref.occupation} onChange={(e) => { const u = [...masterApp.references]; u[i] = { ...u[i], occupation: e.target.value }; setMasterApp({ ...masterApp, references: u }); }} />
              </div>
            </div>
          ))}
        </section>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">{t("applications.masterBuilder.saveMasterApp")}</Button>
        </div>
      </div>
    </div>
  );
}
