import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  // Note: rate-limit uses module-level Map, so tests share state.
  // Use unique keys per test to avoid interference.

  it("allows first request", () => {
    const result = checkRateLimit("test-first-1", false);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4); // 5 limit - 1 used
  });

  it("enforces anonymous limit of 5", () => {
    const key = "test-anon-limit";
    for (let i = 0; i < 5; i++) {
      const r = checkRateLimit(key, false);
      expect(r.allowed).toBe(true);
    }
    const blocked = checkRateLimit(key, false);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("enforces authenticated limit of 20", () => {
    const key = "test-auth-limit";
    for (let i = 0; i < 20; i++) {
      expect(checkRateLimit(key, true).allowed).toBe(true);
    }
    expect(checkRateLimit(key, true).allowed).toBe(false);
  });

  it("returns correct remaining count", () => {
    const key = "test-remaining";
    expect(checkRateLimit(key, false).remaining).toBe(4);
    expect(checkRateLimit(key, false).remaining).toBe(3);
    expect(checkRateLimit(key, false).remaining).toBe(2);
  });

  it("returns correct limit for anon vs auth", () => {
    expect(checkRateLimit("test-limit-anon", false).limit).toBe(5);
    expect(checkRateLimit("test-limit-auth", true).limit).toBe(20);
  });
});
