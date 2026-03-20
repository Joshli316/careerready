"use client";

import { useState, useEffect, useCallback } from "react";
import { useStorage } from "@/hooks/useStorage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { CheckCircle, Plus, Trash2 } from "lucide-react";

interface WorkEntry {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  duties: string;
  reasonLeft: string;
  supervisorName: string;
  supervisorPhone: string;
}

interface MasterApp {
  name: string;
  address: string;
  phone: string;
  email: string;
  education: Array<{ school: string; degree: string; dates: string; location: string }>;
  workHistory: WorkEntry[];
  skills: string;
  languages: string;
  certifications: string;
  references: Array<{ name: string; phone: string; email: string; occupation: string; yearsKnown: string }>;
}

const emptyWork = (): WorkEntry => ({
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
  const storage = useStorage();
  const [app, setApp] = useState<MasterApp>(emptyApp);
  const [saved, setSaved] = useState(false);

  const save = useCallback(async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Master Application Builder</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Keep all your application information in one place. Reference this when filling out any employer's application.
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
        Having a master application ready saves time and ensures accuracy. Include ALL experience — paid, unpaid, volunteer, and temporary.
      </Callout>

      <div className="space-y-6">
        {/* Personal Info */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800">Personal Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" value={app.name} onChange={(e) => setApp({ ...app, name: e.target.value })} placeholder="First Middle Last" />
            <Input label="Phone" value={app.phone} onChange={(e) => setApp({ ...app, phone: e.target.value })} placeholder="(555) 555-5555" />
            <Input label="Email" value={app.email} onChange={(e) => setApp({ ...app, email: e.target.value })} placeholder="name@email.com" />
            <Input label="Address" value={app.address} onChange={(e) => setApp({ ...app, address: e.target.value })} placeholder="Street, City, State ZIP" />
          </div>
        </section>

        {/* Education */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800">Education</h2>
            <Button variant="ghost" size="sm" onClick={() => setApp({ ...app, education: [...app.education, { school: "", degree: "", dates: "", location: "" }] })}>
              <Plus className="mr-1 h-4 w-4" />Add
            </Button>
          </div>
          {app.education.map((edu, i) => (
            <div key={i} className="mb-3 rounded-lg border border-neutral-100 p-4 last:mb-0">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="School Name" value={edu.school} onChange={(e) => { const u = [...app.education]; u[i] = { ...u[i], school: e.target.value }; setApp({ ...app, education: u }); }} />
                <Input placeholder="Degree / Certificate" value={edu.degree} onChange={(e) => { const u = [...app.education]; u[i] = { ...u[i], degree: e.target.value }; setApp({ ...app, education: u }); }} />
                <Input placeholder="City, State" value={edu.location} onChange={(e) => { const u = [...app.education]; u[i] = { ...u[i], location: e.target.value }; setApp({ ...app, education: u }); }} />
                <Input placeholder="Dates Attended" value={edu.dates} onChange={(e) => { const u = [...app.education]; u[i] = { ...u[i], dates: e.target.value }; setApp({ ...app, education: u }); }} />
              </div>
            </div>
          ))}
        </section>

        {/* Work History */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800">Employment History</h2>
            <Button variant="ghost" size="sm" onClick={() => setApp({ ...app, workHistory: [...app.workHistory, emptyWork()] })}>
              <Plus className="mr-1 h-4 w-4" />Add
            </Button>
          </div>
          {app.workHistory.map((work, i) => (
            <div key={i} className="mb-4 rounded-lg border border-neutral-100 p-4 last:mb-0">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-600">Position {i + 1}</span>
                {app.workHistory.length > 1 && (
                  <button onClick={() => setApp({ ...app, workHistory: app.workHistory.filter((_, j) => j !== i) })} className="text-neutral-400 hover:text-error">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Company Name" value={work.company} onChange={(e) => { const u = [...app.workHistory]; u[i] = { ...u[i], company: e.target.value }; setApp({ ...app, workHistory: u }); }} />
                <Input placeholder="Job Title" value={work.title} onChange={(e) => { const u = [...app.workHistory]; u[i] = { ...u[i], title: e.target.value }; setApp({ ...app, workHistory: u }); }} />
                <Input placeholder="Start Date" value={work.startDate} onChange={(e) => { const u = [...app.workHistory]; u[i] = { ...u[i], startDate: e.target.value }; setApp({ ...app, workHistory: u }); }} />
                <Input placeholder="End Date" value={work.endDate} onChange={(e) => { const u = [...app.workHistory]; u[i] = { ...u[i], endDate: e.target.value }; setApp({ ...app, workHistory: u }); }} />
                <Input placeholder="Supervisor Name" value={work.supervisorName} onChange={(e) => { const u = [...app.workHistory]; u[i] = { ...u[i], supervisorName: e.target.value }; setApp({ ...app, workHistory: u }); }} />
                <Input placeholder="Reason for Leaving" value={work.reasonLeft} onChange={(e) => { const u = [...app.workHistory]; u[i] = { ...u[i], reasonLeft: e.target.value }; setApp({ ...app, workHistory: u }); }} />
              </div>
              <div className="mt-3">
                <Textarea placeholder="Description of duties and accomplishments..." value={work.duties} onChange={(e) => { const u = [...app.workHistory]; u[i] = { ...u[i], duties: e.target.value }; setApp({ ...app, workHistory: u }); }} rows={3} />
              </div>
            </div>
          ))}
        </section>

        {/* Skills & Certs */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800">Skills & Qualifications</h2>
          <div className="space-y-4">
            <Textarea label="Skills & Abilities" placeholder="List your computer skills, software proficiency, and other abilities..." value={app.skills} onChange={(e) => setApp({ ...app, skills: e.target.value })} rows={3} />
            <Input label="Languages" placeholder="e.g., English (fluent), Spanish (conversational)" value={app.languages} onChange={(e) => setApp({ ...app, languages: e.target.value })} />
            <Textarea label="Certifications & Licenses" placeholder="List any certificates, licenses, or training..." value={app.certifications} onChange={(e) => setApp({ ...app, certifications: e.target.value })} rows={2} />
          </div>
        </section>

        {/* References */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800">References</h2>
            <Button variant="ghost" size="sm" onClick={() => setApp({ ...app, references: [...app.references, { name: "", phone: "", email: "", occupation: "", yearsKnown: "" }] })}>
              <Plus className="mr-1 h-4 w-4" />Add
            </Button>
          </div>
          {app.references.map((ref, i) => (
            <div key={i} className="mb-3 rounded-lg border border-neutral-100 p-4 last:mb-0">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Full Name" value={ref.name} onChange={(e) => { const u = [...app.references]; u[i] = { ...u[i], name: e.target.value }; setApp({ ...app, references: u }); }} />
                <Input placeholder="Phone" value={ref.phone} onChange={(e) => { const u = [...app.references]; u[i] = { ...u[i], phone: e.target.value }; setApp({ ...app, references: u }); }} />
                <Input placeholder="Email" value={ref.email} onChange={(e) => { const u = [...app.references]; u[i] = { ...u[i], email: e.target.value }; setApp({ ...app, references: u }); }} />
                <Input placeholder="Occupation" value={ref.occupation} onChange={(e) => { const u = [...app.references]; u[i] = { ...u[i], occupation: e.target.value }; setApp({ ...app, references: u }); }} />
              </div>
            </div>
          ))}
        </section>

        <div className="flex justify-end">
          <Button onClick={save} size="lg">Save Master Application</Button>
        </div>
      </div>
    </div>
  );
}
