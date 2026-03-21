import { Input } from "@/components/ui/Input";
import type { Resume } from "@/types/resume";

interface Props {
  contactInfo: Resume["content"]["contactInfo"];
  onChange: (field: keyof Resume["content"]["contactInfo"], value: string) => void;
}

export function ContactInfoSection({ contactInfo, onChange }: Props) {
  return (
    <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-neutral-800">Contact Information</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full Name" value={contactInfo.name} onChange={(e) => onChange("name", e.target.value)} placeholder="First Last" />
        <Input label="Phone" value={contactInfo.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="(555) 555-5555" inputMode="tel" />
        <Input label="Email" value={contactInfo.email} onChange={(e) => onChange("email", e.target.value)} placeholder="name@email.com" inputMode="email" />
        <Input label="LinkedIn (optional)" value={contactInfo.linkedin ?? ""} onChange={(e) => onChange("linkedin", e.target.value)} placeholder="linkedin.com/in/yourname" />
      </div>
    </section>
  );
}
