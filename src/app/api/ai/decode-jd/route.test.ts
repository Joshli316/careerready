import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies before importing the route
vi.mock("@/lib/ai/client", () => ({
  getAIClient: vi.fn(),
}));

vi.mock("@/lib/ai/rate-limit", () => ({
  checkRateLimit: vi.fn(),
}));

vi.mock("@/lib/ai/client-ip", () => ({
  getClientIp: vi.fn(() => "127.0.0.1"),
}));

import { POST } from "./route";
import { getAIClient } from "@/lib/ai/client";
import { checkRateLimit } from "@/lib/ai/rate-limit";

const mockCreate = vi.fn();
const mockGetAIClient = vi.mocked(getAIClient);
const mockCheckRateLimit = vi.mocked(checkRateLimit);

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/ai/decode-jd", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const sampleResult = {
  jobTitle: "Software Engineer",
  company: "TestCo",
  summary: "A software engineering role.",
  requirements: [{ id: "req_1", category: "hard_skill", description: "TypeScript", importance: "must_have", competency: "Technical Skills" }],
  storyMatches: [],
  gaps: [],
  mockQuestions: [],
  prepChecklist: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  mockCheckRateLimit.mockReturnValue({ allowed: true, remaining: 4, limit: 5 });
  mockGetAIClient.mockReturnValue({
    messages: { create: mockCreate },
  } as unknown as ReturnType<typeof getAIClient>);
  mockCreate.mockResolvedValue({
    content: [{ type: "text", text: JSON.stringify(sampleResult) }],
  });
});

describe("POST /api/ai/decode-jd", () => {
  it("returns 503 when CLAUDE_API_KEY is missing", async () => {
    const original = process.env.CLAUDE_API_KEY;
    delete process.env.CLAUDE_API_KEY;

    const res = await POST(makeRequest({ jobDescription: "Test JD" }));
    expect(res.status).toBe(503);
    const json = (await res.json()) as any;
    expect(json.error).toContain("not available");

    if (original) process.env.CLAUDE_API_KEY = original;
  });

  it("returns 400 when jobDescription is missing", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const json = (await res.json()) as any;
    expect(json.error).toContain("Job description is required");
  });

  it("returns 400 when jobDescription exceeds 15000 chars", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    const res = await POST(makeRequest({ jobDescription: "x".repeat(15001) }));
    expect(res.status).toBe(400);
  });

  it("returns 429 when rate limited", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    mockCheckRateLimit.mockReturnValue({ allowed: false, remaining: 0, limit: 5 });
    const res = await POST(makeRequest({ jobDescription: "Test JD content here" }));
    expect(res.status).toBe(429);
    const json = (await res.json()) as any;
    expect(json.error).toContain("Daily AI limit");
  });

  it("returns 200 with parsed result on success", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    const res = await POST(makeRequest({ jobDescription: "We need a TypeScript developer..." }));
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.result.jobTitle).toBe("Software Engineer");
    expect(json.result.company).toBe("TestCo");
    expect(json.remaining).toBe(4);
  });

  it("strips markdown code fences from response JSON", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: "```json\n" + JSON.stringify(sampleResult) + "\n```" }],
    });
    const res = await POST(makeRequest({ jobDescription: "We need a developer for our team" }));
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.result.jobTitle).toBe("Software Engineer");
  });

  it("returns 500 when Claude returns invalid JSON", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: "This is not JSON at all" }],
    });
    const res = await POST(makeRequest({ jobDescription: "Some job description here" }));
    expect(res.status).toBe(500);
    const json = (await res.json()) as any;
    expect(json.error).toContain("Could not analyze");
  });
});
