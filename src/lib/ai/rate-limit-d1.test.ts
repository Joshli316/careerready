import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkRateLimitD1 } from "./rate-limit";

interface MockStatement {
  bind: ReturnType<typeof vi.fn>;
  first: ReturnType<typeof vi.fn>;
  run: ReturnType<typeof vi.fn>;
}

function createMockD1() {
  const mockStatement: MockStatement = {
    bind: vi.fn(),
    first: vi.fn(),
    run: vi.fn(),
  };
  // bind returns the same statement so chaining works
  mockStatement.bind.mockReturnValue(mockStatement);

  const mockD1 = {
    prepare: vi.fn().mockReturnValue(mockStatement),
  };

  return { mockD1: mockD1 as unknown as D1Database, mockStatement };
}

describe("checkRateLimitD1", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("allows first request (atomic INSERT then SELECT shows 1)", async () => {
    const { mockD1, mockStatement } = createMockD1();
    // INSERT runs first (atomic upsert), then SELECT reads the new count
    mockStatement.run.mockResolvedValue({});
    mockStatement.first.mockResolvedValue({ requests: 1 });

    const result = await checkRateLimitD1(mockD1, "user:123", false);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4); // ANON_LIMIT(5) - 1
    expect(result.limit).toBe(5);
  });

  it("blocks when at limit (INSERT increments past limit)", async () => {
    const { mockD1, mockStatement } = createMockD1();
    // INSERT increments to 6, SELECT shows 6 (which is > limit of 5)
    mockStatement.run.mockResolvedValue({});
    mockStatement.first.mockResolvedValue({ requests: 6 });

    const result = await checkRateLimitD1(mockD1, "user:456", false);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.limit).toBe(5);
  });

  it("returns correct remaining count", async () => {
    const { mockD1, mockStatement } = createMockD1();
    // Authenticated user: INSERT increments, SELECT shows 11
    mockStatement.run.mockResolvedValue({});
    mockStatement.first.mockResolvedValue({ requests: 11 });

    const result = await checkRateLimitD1(mockD1, "user:789", true);

    expect(result.allowed).toBe(true);
    // AUTH_LIMIT(20) - 11 = 9
    expect(result.remaining).toBe(9);
    expect(result.limit).toBe(20);
  });

  it("falls back to in-memory when D1 throws", async () => {
    const { mockD1, mockStatement } = createMockD1();
    // Both INSERT and SELECT throw
    mockStatement.run.mockRejectedValue(new Error("D1 unavailable"));

    const result = await checkRateLimitD1(mockD1, "fallback-d1-key", false);

    // Should succeed via in-memory fallback (halved limit: ceil(5/2) = 3)
    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(3);
    expect(result.remaining).toBe(2);
  });
});
