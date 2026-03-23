"use client";

import { useState, useEffect, useCallback } from "react";
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
      <Breadcrumb href="/applications" label="Applications" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Master Application Builder</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Keep all your application information in one place. Reference this when filling out any employer's application.
          </p>
        </div>
        <SavedIndicator visible={saved} />
      </div>

      <Callout type="tip" className="mb-6">
        A master application saves time and keeps your info consistent. Include ALL experience: paid, unpaid, volunteer, and temporary.
      </Callout>

      <div className="space-y-6">
        {/* Personal Info */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800">Personal Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" value={masterApp.name} onChange={(e) => setMasterApp({ ...masterApp, name: e.target.value })} placeholder="First Middle Last" />
            <Input label="Phone" value={masterApp.phone} onChange={(e) => setMasterApp({ ...masterApp, phone: e.target.value })} placeholder="(555) 555-5555" />
            <Input label="Email" value={masterApp.email} onChange={(e) => setMasterApp({ ...masterApp, email: e.target.value })} placeholder="name@email.com" />
            <Input label="Address" value={masterApp.address} onChange={(e) => setMasterApp({ ...masterApp, address: e.target.value })} placeholder="Street, City, State ZIP" />
          </div>
        </section>

        {/* Education */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800">Education</h2>
            <Button variant="ghost" size="sm" onClick={() => setMasterApp({ ...masterApp, education: [...masterApp.education, { school: "", degree: "", dates: "", location: "" }] })}>
              <Plus className="mr-1 h-4 w-4" />Add
            </Button>
          </div>
          {masterApp.education.map((edu, i) => (
            <div key={i} className="mb-3 rounded-lg border border-neutral-100 p-4 last:mb-0">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="School Name" value={edu.school} onChange={(e) => { const u = [...masterApp.education]; u[i] = { ...u[i], school: e.target.value }; setMasterApp({ ...masterApp, education: u }); }} />
                <Input placeholder="Degree / Certificate" value={edu.degree} onChange={(e) => { const u = [...masterApp.education]; u[i] = { ...u[i], degree: e.target.value }; setMasterApp({ ...masterApp, education: u }); }} />
                <Input placeholder="City, State" value={edu.location} onChange={(e) => { const u = [...masterApp.education]; u[i] = { ...u[i], location: e.target.value }; setMasterApp({ ...masterApp, education: u }); }} />
                <Input placeholder="Dates Attended" value={edu.dates} onChange={(e) => { const u = [...masterApp.education]; u[i] = { ...u[i], dates: e.target.value }; setMasterApp({ ...masterApp, education: u }); }} />
              </div>
            </div>
          ))}
        </section>

        {/* Work History */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800">Employment History</h2>
            <Button variant="ghost" size="sm" onClick={() => setMasterApp({ ...masterApp, workHistory: [...masterApp.workHistory, emptyWork()] })}>
              <Plus className="mr-1 h-4 w-4" />Add
            </Button>
          </div>
          {masterApp.workHistory.map((work, i) => (
            <div key={i} className="mb-4 rounded-lg border border-neutral-100 p-4 last:mb-0">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-600">Position {i + 1}</span>
                {masterApp.workHistory.length > 1 && (
                  <button onClick={() => setMasterApp({ ...masterApp, workHistory: masterApp.workHistory.filter((_, j) => j !== i) })} className="text-neutral-400 hover:text-error" aria-label={`Remove position ${i + 1}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Company Name" value={work.company} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], company: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} />
                <Input placeholder="Job Title" value={work.title} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], title: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} />
                <Input placeholder="Start Date" value={work.startDate} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], startDate: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} />
                <Input placeholder="End Date" value={work.endDate} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], endDate: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} />
                <Input placeholder="Supervisor Name" value={work.supervisorName} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], supervisorName: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} />
                <Input placeholder="Reason for Leaving" value={work.reasonLeft} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], reasonLeft: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} />
              </div>
              <div className="mt-3">
                <Textarea placeholder="Description of duties and accomplishments..." value={work.duties} onChange={(e) => { const u = [...masterApp.workHistory]; u[i] = { ...u[i], duties: e.target.value }; setMasterApp({ ...masterApp, workHistory: u }); }} rows={3} />
              </div>
            </div>
          ))}
        </section>

        {/* Skills & Certs */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800">Skills & Qualifications</h2>
          <div className="space-y-4">
            <Textarea label="Skills & Abilities" placeholder="List your computer skills, software proficiency, and other abilities..." value={masterApp.skills} onChange={(e) => setMasterApp({ ...masterApp, skills: e.target.value })} rows={3} />
            <Input label="Languages" placeholder="e.g., English (fluent), Spanish (conversational)" value={masterApp.languages} onChange={(e) => setMasterApp({ ...masterApp, languages: e.target.value })} />
            <Textarea label="Certifications & Licenses" placeholder="List any certificates, licenses, or training..." value={masterApp.certifications} onChange={(e) => setMasterApp({ ...masterApp, certifications: e.target.value })} rows={2} />
          </div>
        </section>

        {/* References */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800">References</h2>
            <Button variant="ghost" size="sm" onClick={() => setMasterApp({ ...masterApp, references: [...masterApp.references, { name: "", phone: "", email: "", occupation: "", yearsKnown: "" }] })}>
              <Plus className="mr-1 h-4 w-4" />Add
            </Button>
          </div>
          {masterApp.references.map((ref, i) => (
            <div key={i} className="mb-3 rounded-lg border border-neutral-100 p-4 last:mb-0">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Full Name" value={ref.name} onChange={(e) => { const u = [...masterApp.references]; u[i] = { ...u[i], name: e.target.value }; setMasterApp({ ...masterApp, references: u }); }} />
                <Input placeholder="Phone" value={ref.phone} onChange={(e) => { const u = [...masterApp.references]; u[i] = { ...u[i], phone: e.target.value }; setMasterApp({ ...masterApp, references: u }); }} />
                <Input placeholder="Email" value={ref.email} onChange={(e) => { const u = [...masterApp.references]; u[i] = { ...u[i], email: e.target.value }; setMasterApp({ ...masterApp, references: u }); }} />
                <Input placeholder="Occupation" value={ref.occupation} onChange={(e) => { const u = [...masterApp.references]; u[i] = { ...u[i], occupation: e.target.value }; setMasterApp({ ...masterApp, references: u }); }} />
              </div>
            </div>
          ))}
        </section>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">Save Master Application</Button>
        </div>
      </div>
    </div>
  );
}
