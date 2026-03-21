import { describe, it, expect } from "vitest";
import { PROMPTS } from "@/lib/ai/prompts";

describe("decodeJD prompt", () => {
  it("exists and is a non-empty string", () => {
    expect(typeof PROMPTS.decodeJD).toBe("string");
    expect(PROMPTS.decodeJD.length).toBeGreaterThan(100);
  });

  it("instructs structured JSON output", () => {
    expect(PROMPTS.decodeJD).toContain("Return ONLY valid JSON");
    expect(PROMPTS.decodeJD).toContain("jobTitle");
    expect(PROMPTS.decodeJD).toContain("requirements");
    expect(PROMPTS.decodeJD).toContain("storyMatches");
    expect(PROMPTS.decodeJD).toContain("gaps");
    expect(PROMPTS.decodeJD).toContain("mockQuestions");
    expect(PROMPTS.decodeJD).toContain("prepChecklist");
  });
});
