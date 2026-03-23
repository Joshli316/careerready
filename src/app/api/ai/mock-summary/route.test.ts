import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/ai/client", () => ({
  getAIClient: vi.fn(),
}));
vi.mock("@/lib/ai/rate-limit", () => ({
  checkRateLimitD1: vi.fn(),
}));
vi.mock("@/lib/ai/client-ip", () => ({
  getClientIp: vi.fn(() => "127.0.0.1"),
}));
vi.mock("@cloudflare/next-on-pages", () => ({
  getRequestContext: vi.fn(() => ({ env: { DB: {} } })),
}));
vi.mock("@/lib/api/validate-origin", () => ({
  validateOrigin: vi.fn(() => null),
}));

import { POST } from "./route";
import { getAIClient } from "@/lib/ai/client";
import { checkRateLimitD1 } from "@/lib/ai/rate-limit";

const mockCreate = vi.fn();
const mockGetAIClient = vi.mocked(getAIClient);
const mockCheckRateLimitD1 = vi.mocked(checkRateLimitD1);

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
  mockCheckRateLimitD1.mockResolvedValue({ allowed: true, remaining: 4, limit: 5 });
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
    mockCheckRateLimitD1.mockResolvedValue({ allowed: false, remaining: 0, limit: 5 });
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

  it("returns 400 when exchanges have invalid structure", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    const res = await POST(makeRequest({
      jobContext: "Test",
      exchanges: [{ question: "Q1" }], // missing answer and feedback
    }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as any;
    expect(json.code).toBe("INVALID_EXCHANGE");
  });

  it("returns 400 when too many exchanges", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    const exchanges = Array.from({ length: 21 }, (_, i) => ({
      question: `Q${i}`, answer: `A${i}`, feedback: `F${i}`,
    }));
    const res = await POST(makeRequest({ jobContext: "Test", exchanges }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as any;
    expect(json.code).toBe("INPUT_TOO_LONG");
  });

  it("clamps confidence rating to 1-10 range", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: JSON.stringify({ ...sampleSummary, confidenceRating: 15 }) }],
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.result.confidenceRating).toBe(10);
  });
});
