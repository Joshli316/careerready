import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  // Note: rate-limit uses module-level Map, so tests share state.
  // Use unique keys per test to avoid interference.

  // In-memory fallback uses halved limits: ceil(5/2)=3 for anon, ceil(20/2)=10 for auth

  it("allows first request", () => {
    const result = checkRateLimit("test-first-1", false);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2); // 3 limit - 1 used
  });

  it("enforces anonymous fallback limit of 3 (halved from 5)", () => {
    const key = "test-anon-limit";
    for (let i = 0; i < 3; i++) {
      const r = checkRateLimit(key, false);
      expect(r.allowed).toBe(true);
    }
    const blocked = checkRateLimit(key, false);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("enforces authenticated fallback limit of 10 (halved from 20)", () => {
    const key = "test-auth-limit";
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit(key, true).allowed).toBe(true);
    }
    expect(checkRateLimit(key, true).allowed).toBe(false);
  });

  it("returns correct remaining count", () => {
    const key = "test-remaining";
    expect(checkRateLimit(key, false).remaining).toBe(2);
    expect(checkRateLimit(key, false).remaining).toBe(1);
    expect(checkRateLimit(key, false).remaining).toBe(0);
  });

  it("returns correct fallback limit for anon vs auth", () => {
    expect(checkRateLimit("test-limit-anon", false).limit).toBe(3);
    expect(checkRateLimit("test-limit-auth", true).limit).toBe(10);
  });
});
