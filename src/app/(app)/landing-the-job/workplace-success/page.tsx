import { Callout } from "@/components/ui/Callout";

const areas = [
  {
    title: "1. Work Habits",
    items: [
      "Maintain a professional image — live your brand",
      "Arrive on time and call in promptly when you'll be late or absent",
      "Limit personal cell phone use to breaks and rest periods",
      "Demonstrate a positive attitude and enthusiasm for your work",
      "Do not participate in office gossip",
    ],
  },
  {
    title: "2. Performance of Duties",
    items: [
      "Understand what is expected of you",
      "Meet performance goals and standards",
      "Be a team player — contribute to team objectives",
      "Be neat and organized in all your tasks",
      "If you make a mistake, take responsibility and communicate",
    ],
  },
  {
    title: "3. Communication & Feedback",
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
    title: "4. Professional Growth",
    items: [
      "Be willing to change and grow with the company",
      "Be self-motivated and seek ways to remain positive and productive",
      "Assist with tasks outside of your job description when possible",
      "Support and participate in company activities",
    ],
  },
  {
    title: "5. Personal Life Balance",
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Long-Term Workplace Success</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Solid work practices and interpersonal skills will support your career growth
          and lead to greater job satisfaction.
        </p>
      </div>

      <Callout type="tip" className="mb-6">
        Whether you're starting a new job or want to level up, continuously fine-tune and upgrade
        your skills. These practices will help you thrive in any workplace.
      </Callout>

      <div className="space-y-6">
        {areas.map((area) => (
          <section key={area.title} className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-neutral-800">{area.title}</h2>
            <ul className="space-y-2">
              {area.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-neutral-600">
                  <span className="mt-0.5 text-primary-400 shrink-0">&#10003;</span>
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
