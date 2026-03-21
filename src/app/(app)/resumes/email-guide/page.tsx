import type { Metadata } from "next";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Emailing Your Resume",
  description: "How to write a professional email when sending your resume. Subject line format, body template, and attachment tips.",
};

export default function EmailGuidePage() {
  return (
    <div>
      <Breadcrumb href="/resumes" label="Resumes" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Emailing Your Resume</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Follow these guidelines when submitting your resume via email.
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-400 text-sm font-bold text-white">1</div>
            <div>
              <h2 className="font-semibold text-neutral-800">Subject Line</h2>
              <p className="mt-1 text-sm text-neutral-600">
                Include the job title or position you are applying for and your full name.
              </p>
              <div className="mt-2 rounded-lg bg-neutral-50 p-3 font-mono text-sm text-neutral-700">
                Subject: Marketing Coordinator Position - Jane Smith
              </div>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-400 text-sm font-bold text-white">2</div>
            <div>
              <h2 className="font-semibold text-neutral-800">Email Body</h2>
              <p className="mt-1 text-sm text-neutral-600">
                Write a brief introductory message. You can use your cover letter as the body, or compose a shorter message and attach the cover letter.
              </p>
              <ul className="mt-2 space-y-1 text-sm text-neutral-600">
                <li className="flex gap-2"><span className="text-primary-400">&#10003;</span>Address to the contact person if possible</li>
                <li className="flex gap-2"><span className="text-primary-400">&#10003;</span>1-2 short paragraphs explaining your qualifications</li>
                <li className="flex gap-2"><span className="text-primary-400">&#10003;</span>Mention key qualifications from the job description</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-400 text-sm font-bold text-white">3</div>
            <div>
              <h2 className="font-semibold text-neutral-800">Contact Information</h2>
              <p className="mt-1 text-sm text-neutral-600">
                Include your full name, phone number, and email at the end of your email. Make it easy for the employer to contact you.
              </p>
            </div>
          </div>
        </section>

        {/* Step 4 */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-400 text-sm font-bold text-white">4</div>
            <div>
              <h2 className="font-semibold text-neutral-800">Attachments</h2>
              <p className="mt-1 text-sm text-neutral-600">
                Attach your resume and cover letter as PDF files. Name them clearly:
              </p>
              <div className="mt-2 space-y-1 rounded-lg bg-neutral-50 p-3 font-mono text-sm text-neutral-700">
                <div>Jane Smith Resume.pdf</div>
                <div>Jane Smith Cover Letter.pdf</div>
              </div>
            </div>
          </div>
        </section>

        <Callout type="warning">
          Double check your spelling, grammar, and capitalization before sending. Proofread everything — emails create a first impression too.
        </Callout>

        {/* Sample email */}
        <section className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800">Sample Email</h2>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700">
            <div className="mb-2 border-b border-neutral-200 pb-2">
              <div><strong>To:</strong> hiring@company.com</div>
              <div><strong>Subject:</strong> Marketing Coordinator Position - Jane Smith</div>
            </div>
            <p>Hello Ms. Johnson,</p>
            <br />
            <p>
              Attached please find a copy of my resume and cover letter for your review. I am a highly
              motivated recent graduate with a degree in Marketing and internship experience in social media
              management. I am interested in applying for the Marketing Coordinator position currently available.
            </p>
            <br />
            <p>
              I look forward to hearing from you. In advance, thank you for your time and consideration.
            </p>
            <br />
            <p>Sincerely,</p>
            <p>Jane Smith</p>
            <p>555-555-5555</p>
            <p>janesmith@email.com</p>
          </div>
        </section>
      </div>
    </div>
  );
}
