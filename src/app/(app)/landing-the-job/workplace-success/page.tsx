import type { Metadata } from "next";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Workplace Success",
  description: "Work habits, communication tips, and professional growth advice for your first job.",
};

const areas = [
  {
    title: "Work Habits",
    items: [
      "Maintain a professional image — live your brand",
      "Arrive on time and call in promptly when you'll be late or absent",
      "Limit personal cell phone use to breaks and rest periods",
      "Show up with a good attitude — it gets noticed",
      "Do not participate in office gossip",
    ],
  },
  {
    title: "Performance of Duties",
    items: [
      "Understand what is expected of you",
      "Meet performance goals and standards",
      "Be a team player — contribute to team objectives",
      "Be neat and organized in all your tasks",
      "If you make a mistake, take responsibility and communicate",
    ],
  },
  {
    title: "Communication & Feedback",
    items: [
      "Maintain professional relationships with co-workers and supervisors",
      "Ask for and learn from feedback and constructive criticism",
      "Speak up when there is a problem — follow the chain of command",
      "Learn to disagree respectfully — listen carefully, then share your perspective",
      "Treat customers in a friendly yet professional manner",
      "Be respectful — no swearing, bullying, or inappropriate comments",
    ],
  },
  {
    title: "Professional Growth",
    items: [
      "Be willing to change and grow with the company",
      "Be self-motivated and seek ways to remain positive and productive",
      "Assist with tasks outside of your job description when possible",
      "Support and participate in company activities",
    ],
  },
  {
    title: "Personal Life Balance",
    items: [
      "Keep personal life out of the workplace — don't let challenges affect your performance",
      "Use good judgment when sharing personal information with co-workers",
      "Understand and follow company guidelines regarding social media",
      "Do not drink alcohol or use drugs before or during work hours",
    ],
  },
];

export default function WorkplaceSuccessPage() {
  return (
    <div>
      <Breadcrumb href="/landing-the-job" label="Landing the Job" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Long-Term Workplace Success</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Good habits at work keep you employed and get you promoted.
          Here's what managers actually look for.
        </p>
      </div>

      <Callout type="tip" className="mb-6">
        These habits matter at every stage of your career. Review them before your first week,
        then revisit monthly to stay on track.
      </Callout>

      <div className="space-y-6">
        {areas.map((area) => (
          <section key={area.title} className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-neutral-800">{area.title}</h2>
            <ul className="space-y-2">
              {area.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-neutral-600">
                  <span className="mt-0.5 text-primary-400 shrink-0" aria-hidden="true">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
