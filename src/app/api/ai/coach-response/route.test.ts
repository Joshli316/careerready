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
  return new NextRequest("http://localhost/api/ai/coach-response", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockCheckRateLimit.mockReturnValue({ allowed: true, remaining: 4, limit: 5 });
  mockGetAIClient.mockReturnValue({
    messages: { create: mockCreate },
  } as unknown as ReturnType<typeof getAIClient>);
  mockCreate.mockResolvedValue({
    content: [{ type: "text", text: "Great answer! Here is some feedback." }],
  });
});

describe("POST /api/ai/coach-response", () => {
  it("returns 503 when CLAUDE_API_KEY is missing", async () => {
    const original = process.env.CLAUDE_API_KEY;
    delete process.env.CLAUDE_API_KEY;
    const res = await POST(makeRequest({ question: "Q", answer: "A" }));
    expect(res.status).toBe(503);
    if (original) process.env.CLAUDE_API_KEY = original;
  });

  it("returns 400 when question or answer is missing", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    const res1 = await POST(makeRequest({ answer: "A" }));
    expect(res1.status).toBe(400);

    const res2 = await POST(makeRequest({ question: "Q" }));
    expect(res2.status).toBe(400);
  });

  it("returns 400 when answer exceeds 5000 chars", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    const res = await POST(makeRequest({ question: "Q", answer: "x".repeat(5001) }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as any;
    expect(json.error).toContain("too long");
  });

  it("returns 400 when jobContext exceeds 5000 chars", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    const res = await POST(makeRequest({ question: "Q", answer: "A", jobContext: "x".repeat(5001) }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as any;
    expect(json.error).toContain("Job context too long");
  });

  it("returns 429 when rate limited", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    mockCheckRateLimit.mockReturnValue({ allowed: false, remaining: 0, limit: 5 });
    const res = await POST(makeRequest({ question: "Q", answer: "A" }));
    expect(res.status).toBe(429);
  });

  it("returns 200 with feedback text on success", async () => {
    process.env.CLAUDE_API_KEY = "test-key";
    const res = await POST(makeRequest({ question: "Tell me about yourself.", answer: "I am a developer." }));
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.result).toBe("Great answer! Here is some feedback.");
    expect(json.remaining).toBe(4);
  });
});
