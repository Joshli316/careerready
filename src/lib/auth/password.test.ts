import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password", () => {
  it("hashes a password and returns salt:hash format", async () => {
    const hashed = await hashPassword("mypassword");
    expect(hashed).toContain(":");
    const [salt, hash] = hashed.split(":");
    expect(salt).toHaveLength(32); // 16 bytes = 32 hex chars
    expect(hash).toHaveLength(64); // 32 bytes = 64 hex chars
  });

  it("verifies correct password", async () => {
    const hashed = await hashPassword("correctpassword");
    const result = await verifyPassword("correctpassword", hashed);
    expect(result).toBe(true);
  });

  it("rejects incorrect password", async () => {
    const hashed = await hashPassword("correctpassword");
    const result = await verifyPassword("wrongpassword", hashed);
    expect(result).toBe(false);
  });

  it("produces different hashes for same password (unique salts)", async () => {
    const hash1 = await hashPassword("samepassword");
    const hash2 = await hashPassword("samepassword");
    expect(hash1).not.toBe(hash2);
  });

  it("handles empty password", async () => {
    const hashed = await hashPassword("");
    const result = await verifyPassword("", hashed);
    expect(result).toBe(true);
  });

  it("handles unicode password", async () => {
    const hashed = await hashPassword("pässwörd123!");
    const result = await verifyPassword("pässwörd123!", hashed);
    expect(result).toBe(true);
  });
});
