"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Callout } from "@/components/ui/Callout";
import { Plus } from "lucide-react";

export default function NetworkingPage() {
  const [professional, setProfessional] = useState(Array(5).fill(""));
  const [personal, setPersonal] = useState(Array(5).fill(""));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Build Your Network</h1>
        <p className="mt-1 text-sm text-neutral-500">Networking is the #1 way to find a job. List the people you'll reach out to.</p>
      </div>

      <Callout type="tip" className="mb-6">
        Include people who are NOT in your line of work too. You never know who has a valuable connection.
        Share your power statement when networking, and always ask for advice.
      </Callout>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-1 font-semibold text-neutral-800">Professional Contacts</h2>
          <p className="mb-4 text-xs text-neutral-500">Former employers, co-workers, teachers, classmates, mentors</p>
          <div className="space-y-2">
            {professional.map((v, i) => (
              <Input key={i} placeholder={`Contact ${i + 1}`} value={v} onChange={(e) => { const u = [...professional]; u[i] = e.target.value; setProfessional(u); }} />
            ))}
            <button onClick={() => setProfessional([...professional, ""])} className="text-xs font-medium text-primary-400 hover:text-primary-500"><Plus className="inline h-3.5 w-3.5" /> Add more</button>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-1 font-semibold text-neutral-800">Personal Contacts</h2>
          <p className="mb-4 text-xs text-neutral-500">Friends, neighbors, relatives, community members</p>
          <div className="space-y-2">
            {personal.map((v, i) => (
              <Input key={i} placeholder={`Contact ${i + 1}`} value={v} onChange={(e) => { const u = [...personal]; u[i] = e.target.value; setPersonal(u); }} />
            ))}
            <button onClick={() => setPersonal([...personal, ""])} className="text-xs font-medium text-primary-400 hover:text-primary-500"><Plus className="inline h-3.5 w-3.5" /> Add more</button>
          </div>
        </section>
      </div>
    </div>
  );
}
