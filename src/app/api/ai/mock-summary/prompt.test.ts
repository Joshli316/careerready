import { describe, it, expect } from "vitest";
import { PROMPTS } from "@/lib/ai/prompts";

describe("mockInterviewSummary prompt", () => {
  it("exists and instructs JSON output with expected fields", () => {
    expect(typeof PROMPTS.mockInterviewSummary).toBe("string");
    expect(PROMPTS.mockInterviewSummary.length).toBeGreaterThan(100);
    expect(PROMPTS.mockInterviewSummary).toContain("Return ONLY valid JSON");
    expect(PROMPTS.mockInterviewSummary).toContain("overall");
    expect(PROMPTS.mockInterviewSummary).toContain("strengths");
    expect(PROMPTS.mockInterviewSummary).toContain("improvements");
    expect(PROMPTS.mockInterviewSummary).toContain("confidenceRating");
  });
});
