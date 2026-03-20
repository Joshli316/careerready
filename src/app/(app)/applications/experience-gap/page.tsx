"use client";

import { useState } from "react";
import { Callout } from "@/components/ui/Callout";
import { CheckCircle } from "lucide-react";

const categories = [
  {
    title: "Unpaid or Volunteer Work",
    description: "Have you done any work for family, friends, or organizations?",
    items: ["Community Service", "Tutoring", "Mentoring", "Campus Organizations", "Church/Faith-Based", "School Events", "Family Caregiving"],
  },
  {
    title: "Internships & Training",
    description: "Did you attend college, trade school, or complete any training?",
    items: ["Internship", "Externship", "Certificate Program", "On-the-Job Training", "Job Shadowing", "Research Assistant", "Teaching Assistant"],
  },
  {
    title: "Campus & Extracurricular",
    description: "Activities that demonstrate leadership and teamwork.",
    items: ["Student Government", "Club Officer/Member", "Sports Team", "Student Newspaper", "Event Planning", "Peer Counseling", "Resident Advisor"],
  },
  {
    title: "Self-Employment & Freelance",
    description: "Did you work independently or from home?",
    items: ["Freelance Projects", "Tutoring", "Social Media Management", "Web Design", "Photography", "Crafts/Etsy", "Gig Work (DoorDash, etc.)"],
  },
  {
    title: "Part-Time & Temporary",
    description: "Short-term or part-time work of any kind.",
    items: ["Seasonal Work", "Retail", "Food Service", "Staffing Agency", "Contract Work", "Campus Job (Work-Study)", "Summer Jobs"],
  },
];

export default function ExperienceGapPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(item: string) {
    const next = new Set(checked);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setChecked(next);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Experience Gap Solver</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Think you don't have enough experience? You likely have more than you realize.
          Check all types of experience that apply to you.
        </p>
      </div>

      <Callout type="tip" className="mb-6">
        Employers value all types of experience. Volunteer work, campus activities, internships,
        and class projects all demonstrate transferable skills that belong on your resume and applications.
      </Callout>

      <div className="space-y-6">
        {categories.map((cat) => (
          <section key={cat.title} className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <h2 className="mb-1 font-semibold text-neutral-800">{cat.title}</h2>
            <p className="mb-3 text-sm text-neutral-500">{cat.description}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {cat.items.map((item) => {
                const isChecked = checked.has(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      isChecked
                        ? "border-primary-400 bg-primary-50 text-primary-700"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      isChecked ? "border-primary-400 bg-primary-400" : "border-neutral-300"
                    }`}>
                      {isChecked && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    {item}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {checked.size > 0 && (
        <div className="mt-6 rounded-xl border border-primary-200 bg-primary-50 p-5">
          <h3 className="font-semibold text-primary-800">
            You identified {checked.size} types of experience!
          </h3>
          <p className="mt-1 text-sm text-primary-700">
            Include these on your applications and resume. Even informal experience demonstrates valuable skills to employers.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from(checked).map((item) => (
              <span key={item} className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
