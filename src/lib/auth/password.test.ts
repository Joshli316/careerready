import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password", () => {
  it("hashes a password and returns salt:hash format", async () => {
    const hashed = await hashPassword("mypassword1");
    expect(hashed).toContain(":");
    const [salt, hash] = hashed.split(":");
    expect(salt).toHaveLength(32); // 16 bytes = 32 hex chars
    expect(hash).toHaveLength(64); // 32 bytes = 64 hex chars
  });

  it("verifies correct password", async () => {
    const hashed = await hashPassword("correctpass1");
    const result = await verifyPassword("correctpass1", hashed);
    expect(result).toBe(true);
  });

  it("rejects incorrect password", async () => {
    const hashed = await hashPassword("correctpass1");
    const result = await verifyPassword("wrongpass123", hashed);
    expect(result).toBe(false);
  });

  it("produces different hashes for same password (unique salts)", async () => {
    const hash1 = await hashPassword("samepassword1");
    const hash2 = await hashPassword("samepassword1");
    expect(hash1).not.toBe(hash2);
  });

  it("rejects empty password", async () => {
    await expect(hashPassword("")).rejects.toThrow("Password must be at least 8 characters long.");
  });

  it("rejects short password (under 8 chars)", async () => {
    await expect(hashPassword("short")).rejects.toThrow("Password must be at least 8 characters long.");
  });

  it("rejects password without numbers", async () => {
    await expect(hashPassword("allletters")).rejects.toThrow("Password must contain at least one letter and one number.");
  });

  it("rejects password without letters", async () => {
    await expect(hashPassword("12345678")).rejects.toThrow("Password must contain at least one letter and one number.");
  });

  it("handles unicode password", async () => {
    const hashed = await hashPassword("pässwörd123!");
    const result = await verifyPassword("pässwörd123!", hashed);
    expect(result).toBe(true);
  });

  it("handles malformed stored hash gracefully", async () => {
    expect(await verifyPassword("password1", "")).toBe(false);
    expect(await verifyPassword("password1", "nocolon")).toBe(false);
    expect(await verifyPassword("password1", ":")).toBe(false);
  });
});
