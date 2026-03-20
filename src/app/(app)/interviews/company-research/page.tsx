"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { CheckCircle, Plus, Trash2 } from "lucide-react";

interface Research {
  company: string;
  mission: string;
  products: string;
  culture: string;
  recentNews: string;
  questions: string[];
}

const emptyResearch = (): Research => ({
  company: "", mission: "", products: "", culture: "", recentNews: "", questions: [""],
});

export default function CompanyResearchPage() {
  const [entries, setEntries] = useState<Research[]>([emptyResearch()]);
  const [active, setActive] = useState(0);

  const entry = entries[active];

  function update(field: keyof Research, value: string) {
    const u = [...entries];
    u[active] = { ...u[active], [field]: value };
    setEntries(u);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Company Research</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Research each company before your interview. Use this framework to organize your findings.
        </p>
      </div>

      <Callout type="tip" className="mb-6">
        <strong>What to research:</strong> How long they've been in business, products/services, mission statement,
        locations, recent news, the role's purpose, growth opportunities, and salary/benefits.
      </Callout>

      <div className="mb-4 flex items-center gap-2 overflow-x-auto">
        {entries.map((e, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap ${i === active ? "bg-primary-400 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}>
            {e.company || `Company ${i + 1}`}
          </button>
        ))}
        <button onClick={() => { setEntries([...entries, emptyResearch()]); setActive(entries.length); }}
          className="flex items-center gap-1 rounded-lg border border-dashed border-neutral-300 px-3 py-1.5 text-sm text-neutral-500 hover:border-primary-300">
          <Plus className="h-3.5 w-3.5" />New
        </button>
      </div>

      {entry && (
        <div className="space-y-4 rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
          <Input label="Company Name" value={entry.company} onChange={(e) => update("company", e.target.value)} placeholder="e.g., Acme Corp" />
          <Textarea label="Mission Statement" value={entry.mission} onChange={(e) => update("mission", e.target.value)} placeholder="What is their mission?" rows={2} />
          <Textarea label="Products / Services" value={entry.products} onChange={(e) => update("products", e.target.value)} placeholder="What do they offer?" rows={2} />
          <Textarea label="Company Culture" value={entry.culture} onChange={(e) => update("culture", e.target.value)} placeholder="What's the work environment like?" rows={2} />
          <Textarea label="Recent News" value={entry.recentNews} onChange={(e) => update("recentNews", e.target.value)} placeholder="Any recent announcements, awards, or changes?" rows={2} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Questions to Ask</label>
            {entry.questions.map((q, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <Input className="flex-1" placeholder={`Question ${i + 1}`} value={q}
                  onChange={(e) => { const qs = [...entry.questions]; qs[i] = e.target.value; const u = [...entries]; u[active] = { ...u[active], questions: qs }; setEntries(u); }} />
              </div>
            ))}
            <button onClick={() => { const u = [...entries]; u[active] = { ...u[active], questions: [...u[active].questions, ""] }; setEntries(u); }}
              className="text-xs font-medium text-primary-400 hover:text-primary-500">+ Add question</button>
          </div>
        </div>
      )}
    </div>
  );
}
