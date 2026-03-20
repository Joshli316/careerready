import { Callout } from "@/components/ui/Callout";

const boards = [
  { name: "LinkedIn", type: "Professional Network", tip: "Build your profile, set job alerts, use Easy Apply" },
  { name: "Indeed", type: "Job Aggregator", tip: "Upload resume, set daily email alerts by keyword" },
  { name: "Glassdoor", type: "Reviews + Jobs", tip: "Research company culture and salary ranges" },
  { name: "Handshake", type: "College-Focused", tip: "Connect with employers recruiting from your school" },
  { name: "Google Jobs", type: "Search Engine", tip: "Search 'jobs near me' — aggregates from multiple sites" },
  { name: "Company Websites", type: "Direct Apply", tip: "Visit the Careers page of companies you admire" },
  { name: "USAJobs.gov", type: "Government", tip: "Federal job listings with structured applications" },
  { name: "AngelList / Wellfound", type: "Startups", tip: "Startup and tech company opportunities" },
];

export default function JobBoardsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Job Boards & Websites</h1>
        <p className="mt-1 text-sm text-neutral-500">Use multiple job search platforms to maximize your opportunities.</p>
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
          <div key={board.name} className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-800">{board.name}</h2>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">{board.type}</span>
            </div>
            <p className="text-sm text-neutral-600">{board.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
