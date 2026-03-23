import type { Metadata } from "next";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Application Tips",
  description: "10 tips for completing job applications that get you noticed. Avoid the errors that reject 50% of applicants.",
};

const tips = [
  {
    number: 1,
    title: "Review the job announcement first",
    description: "Make sure you meet most of the minimum qualifications: experience, education/certificates, and hard and soft skills.",
  },
  {
    number: 2,
    title: "Gather detailed information",
    description: "Work history, education, references: create a master application with complete and accurate employment information to have on hand.",
  },
  {
    number: 3,
    title: "Follow instructions carefully",
    description: "Read all directions before completing each section. Use the exact date format requested. List employment history in the order specified.",
  },
  {
    number: 4,
    title: "Include all work experience",
    description: "List all paid and unpaid work: volunteer, charity, community activities, internships, self-employment, and temporary experience. Don't leave gaps in your history.",
  },
  {
    number: 5,
    title: "Use keywords from the job posting",
    description: "Include transferable skills and keywords in the availability, education, and work history sections. Online applications use software to filter by keywords.",
  },
  {
    number: 6,
    title: "Never leave the reference section blank",
    description: "Always enter the number of references requested. Ask permission first, and verify current contact information for each reference.",
  },
  {
    number: 7,
    title: "Spell everything correctly",
    description: "Use proper capitalization and grammar. Use a dictionary, spell-checker, or have someone proofread before submitting.",
  },
  {
    number: 8,
    title: "Customize for each application",
    description: "For each application, submit a customized resume and cover letter that match the specified requirements.",
  },
  {
    number: 9,
    title: "Review before submitting",
    description: "Thoroughly review the application and all supporting documents before submitting. Check for errors, missing information, and consistency.",
  },
  {
    number: 10,
    title: "Keep a copy for your records",
    description: "Save or screenshot every application along with the job announcement. This helps when preparing for interviews and following up.",
  },
];

export default function ApplicationTipsPage() {
  return (
    <div>
      <Breadcrumb href="/applications" label="Applications" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">10 Essential Application Tips</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Follow these tips to complete effective applications that get you noticed.
        </p>
      </div>

      <Callout type="tip" className="mb-6">
        Many applications are rejected because of errors or failure to tailor the content.
        Following up within 3&#8211;5 days shows your commitment and keeps your name on the employer&#8217;s radar.
      </Callout>

      <div className="space-y-4">
        {tips.map((tip) => (
          <div key={tip.number} className="flex gap-4 rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-400 text-lg font-bold text-white">
              {tip.number}
            </div>
            <div>
              <h2 className="font-semibold text-neutral-800">{tip.title}</h2>
              <p className="mt-1 text-sm text-neutral-600">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
