import type { Metadata } from "next";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Job Boards & Websites",
  description: "Job search websites for recent graduates: LinkedIn, Indeed, Handshake, and others. Tips for each platform.",
};

const boards = [
  { name: "LinkedIn", type: "Professional Network", tip: "Build your profile, set job alerts, use Easy Apply", url: "https://www.linkedin.com/jobs" },
  { name: "Indeed", type: "Job Aggregator", tip: "Upload resume, set daily email alerts by keyword", url: "https://www.indeed.com" },
  { name: "Glassdoor", type: "Reviews + Jobs", tip: "Research company culture and salary ranges", url: "https://www.glassdoor.com" },
  { name: "Handshake", type: "College-Focused", tip: "Connect with employers recruiting from your school", url: "https://joinhandshake.com" },
  { name: "Google Jobs", type: "Search Engine", tip: "Search 'jobs near me'. It pulls listings from multiple sites.", url: "https://www.google.com/search?q=jobs+near+me" },
  { name: "USAJobs.gov", type: "Government", tip: "Federal job listings with structured applications", url: "https://www.usajobs.gov" },
  { name: "Wellfound", type: "Startups", tip: "Startup and tech company opportunities", url: "https://wellfound.com" },
  { name: "ZipRecruiter", type: "Job Matching", tip: "AI-matched job recommendations based on your resume", url: "https://www.ziprecruiter.com" },
];

export default function JobBoardsPage() {
  return (
    <div>
      <Breadcrumb href="/job-search" label="Job Search" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Job Boards & Websites</h1>
        <p className="mt-1 text-sm text-neutral-500">Post your resume on multiple sites and set up alerts so openings come to you.</p>
      </div>

      <Callout type="tip" className="mb-6">
        Use a variety of sites, set job alerts, and use keyword-rich search terms.
        If a company's name appears, apply directly through their website when possible.
      </Callout>

      <Callout type="warning" className="mb-6">
        <strong>Watch out for scams.</strong> Be wary of listings that promise quick income, require fees,
        or ask for your Social Security number or bank info before hiring.
      </Callout>

      <div className="grid gap-4 sm:grid-cols-2">
        {boards.map((board) => (
          <a
            key={board.name}
            href={board.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-neutral-150 bg-white p-5 shadow-sm transition-[shadow,border-color] hover:shadow-md hover:border-primary-300"
          >
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-800 group-hover:text-primary-400">{board.name}</h2>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">{board.type}</span>
            </div>
            <p className="text-sm text-neutral-600">{board.tip}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
