import type { Resume } from "@/types/resume";

interface Props {
  resume: Resume;
}

export function ResumePreview({ resume }: Props) {
  const c = resume.content;
  return (
    <div className="sticky top-20 rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-500">Live Preview</h3>
      </div>
      <div className="space-y-4 text-xs leading-relaxed">
        {/* Header */}
        <div className="text-center">
          <div className="text-base font-bold text-neutral-900">
            {c.contactInfo.name || "Your Name"}
          </div>
          <div className="text-neutral-500">
            {[c.contactInfo.phone, c.contactInfo.email, c.contactInfo.linkedin]
              .filter(Boolean)
              .join(" | ") || "Phone | Email | LinkedIn"}
          </div>
        </div>

        {/* Profile */}
        {c.profileOverview && (
          <div>
            <div className="mb-1 border-b border-neutral-200 pb-0.5 text-xs font-bold uppercase tracking-wide text-neutral-700">
              Profile
            </div>
            <p className="text-neutral-600">{c.profileOverview}</p>
          </div>
        )}

        {/* Experience */}
        {c.experience.length > 0 && (
          <div>
            <div className="mb-1 border-b border-neutral-200 pb-0.5 text-xs font-bold uppercase tracking-wide text-neutral-700">
              Experience
            </div>
            {c.experience.map((exp, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-neutral-800">
                    {exp.title || "Job Title"}{exp.company ? ` | ${exp.company}` : ""}
                  </span>
                  <span className="text-neutral-400">{exp.dates}</span>
                </div>
                {exp.location && <div className="text-neutral-400">{exp.location}</div>}
                <ul className="mt-0.5 space-y-0.5">
                  {exp.bullets.filter(Boolean).map((b, j) => (
                    <li key={j} className="flex gap-1">
                      <span>&#8226;</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {c.education.length > 0 && (
          <div>
            <div className="mb-1 border-b border-neutral-200 pb-0.5 text-xs font-bold uppercase tracking-wide text-neutral-700">
              Education
            </div>
            {c.education.map((edu, i) => (
              <div key={i} className="mb-1 flex justify-between">
                <div>
                  <span className="font-semibold">{edu.school || "School"}</span>
                  {edu.degree && <span className="text-neutral-500"> — {edu.degree}</span>}
                </div>
                <span className="text-neutral-400">{edu.dates}</span>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {c.skills.length > 0 && (
          <div>
            <div className="mb-1 border-b border-neutral-200 pb-0.5 text-xs font-bold uppercase tracking-wide text-neutral-700">
              Skills
            </div>
            <p className="text-neutral-600">{c.skills.join(" | ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
