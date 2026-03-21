import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

interface Experience {
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
}

interface Props {
  experience: Experience[];
  onUpdate: (index: number, field: string, value: string) => void;
  onUpdateBullet: (expIndex: number, bulletIndex: number, value: string) => void;
  onAddBullet: (expIndex: number) => void;
  onRemoveBullet: (expIndex: number, bulletIndex: number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function ExperienceSection({
  experience,
  onUpdate,
  onUpdateBullet,
  onAddBullet,
  onRemoveBullet,
  onAdd,
  onRemove,
}: Props) {
  return (
    <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800">Experience</h2>
        <Button variant="ghost" size="sm" onClick={onAdd}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>
      {experience.length === 0 && (
        <p className="text-sm text-neutral-400 italic">
          No experience added yet. Include jobs, internships, volunteer work, and campus roles.
        </p>
      )}
      {experience.map((exp, i) => (
        <div key={i} className="mb-4 rounded-lg border border-neutral-100 p-4 last:mb-0">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600">Position {i + 1}</span>
            <button onClick={() => onRemove(i)} className="text-neutral-400 hover:text-error" aria-label={`Remove position ${i + 1}`}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Job Title" value={exp.title} onChange={(e) => onUpdate(i, "title", e.target.value)} />
            <Input placeholder="Company" value={exp.company} onChange={(e) => onUpdate(i, "company", e.target.value)} />
            <Input placeholder="Location" value={exp.location} onChange={(e) => onUpdate(i, "location", e.target.value)} />
            <Input placeholder="Dates (e.g., 06/2024 - Present)" value={exp.dates} onChange={(e) => onUpdate(i, "dates", e.target.value)} />
          </div>
          <div className="mt-3">
            <label className="mb-1.5 block text-sm font-medium text-neutral-600">
              Bullet Points (use result-oriented statements)
            </label>
            {exp.bullets.map((bullet, j) => (
              <div key={j} className="mb-2 flex items-start gap-2">
                <span className="mt-2.5 text-neutral-400">&#8226;</span>
                <Input
                  className="flex-1"
                  placeholder="e.g., Increased customer satisfaction by 20% through..."
                  value={bullet}
                  onChange={(e) => onUpdateBullet(i, j, e.target.value)}
                />
                {exp.bullets.length > 1 && (
                  <button onClick={() => onRemoveBullet(i, j)} className="mt-2 text-neutral-400 hover:text-error" aria-label="Remove bullet point">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => onAddBullet(i)} className="text-xs font-medium text-primary-400 hover:text-primary-500">
              + Add bullet
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
