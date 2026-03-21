import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

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
  return new NextRequest("http://localhost/api/ai/mock-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const sampleSummary = {
  overall: "Solid performance overall.",
  strengths: ["Clear communication", "Good examples"],
  improvements: ["Add more specifics"],
  confidenceRating: 7,
  confidenceNote: "Ready for first-round interviews.",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockCheckRateLimit.mockReturnValue({ allowed: true, remaining: 4, limit: 5 });
  mockGetAIClient.mockReturnValue({
    messages: { create: mockCreate },
  } as unknown as ReturnType<typeof getAIClient>);
  mockCreate.mockResolvedValue({
    content: [{ type: "text", text: JSON.stringify(sampleSummary) }],
  });
});

const validBody = {
  jobContext: "Frontend Engineer",
  exchanges: [
    { question: "Tell me about yourself.", answer: "I build web apps.", feedback: "Good." },
  ],
};

describe("POST /api/ai/mock-summary", () => {
  it("returns 503 when CLAUDE_API_KEY is missing", async () => {
    const original = process.env.CLAUDE_API_KEY;
    delete process.env.CLAUDE_API_KEY;
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(503);
    if (original) process.env.CLAUDE_API_KEY = original;
  });

  it("returns 400 when exchanges array is empty", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    const res = await POST(makeRequest({ jobContext: "Test", exchanges: [] }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as any;
    expect(json.error).toContain("At least one exchange");
  });

  it("returns 429 when rate limited", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    mockCheckRateLimit.mockReturnValue({ allowed: false, remaining: 0, limit: 5 });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(429);
  });

  it("returns 200 with parsed summary on success", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.result.overall).toBe("Solid performance overall.");
    expect(json.result.confidenceRating).toBe(7);
    expect(json.remaining).toBe(4);
  });

  it("strips markdown code fences from response", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: "```json\n" + JSON.stringify(sampleSummary) + "\n```" }],
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.result.confidenceRating).toBe(7);
  });
});
