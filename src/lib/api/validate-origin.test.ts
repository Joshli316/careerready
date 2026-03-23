import { describe, it, expect } from "vitest";
import { validateOrigin } from "./validate-origin";
import { NextRequest } from "next/server";

function makeRequest(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest("https://careerready.pages.dev/api/test", {
    headers,
  });
}

describe("validateOrigin", () => {
  it("allows requests from https://careerready.pages.dev", () => {
    const req = makeRequest({ origin: "https://careerready.pages.dev" });
    const result = validateOrigin(req);
    expect(result).toBeNull();
  });

  it("allows requests from http://localhost:3000", () => {
    const req = makeRequest({ origin: "http://localhost:3000" });
    const result = validateOrigin(req);
    expect(result).toBeNull();
  });

  it("allows requests from http://localhost with other ports", () => {
    const req = makeRequest({ origin: "http://localhost:8080" });
    const result = validateOrigin(req);
    expect(result).toBeNull();
  });

  it("allows requests when Origin is missing but Referer is a valid origin", () => {
    const req = makeRequest({
      referer: "https://careerready.pages.dev/some/page",
    });
    const result = validateOrigin(req);
    expect(result).toBeNull();
  });

  it("blocks requests with no Origin or Referer header", () => {
    const req = makeRequest();
    const result = validateOrigin(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);
  });

  it("returns 403 with proper error body when origin is missing", async () => {
    const req = makeRequest();
    const result = validateOrigin(req);
    expect(result).not.toBeNull();
    const body = await result!.json();
    expect(body).toEqual({ error: "Forbidden: missing origin." });
  });

  it("blocks requests from unknown origins like https://evil.com", () => {
    const req = makeRequest({ origin: "https://evil.com" });
    const result = validateOrigin(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);
  });

  it("returns proper error body when origin is not allowed", async () => {
    const req = makeRequest({ origin: "https://evil.com" });
    const result = validateOrigin(req);
    const body = await result!.json();
    expect(body).toEqual({ error: "Forbidden: origin not allowed." });
  });

  it("blocks requests with unknown referer when no origin header", () => {
    const req = makeRequest({ referer: "https://evil.com/path" });
    const result = validateOrigin(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);
  });

  it("allows Cloudflare preview deploy origins", () => {
    const req = makeRequest({ origin: "https://abc123.careerready.pages.dev" });
    const result = validateOrigin(req);
    expect(result).toBeNull();
  });

  it("blocks origins that look like preview but aren't", () => {
    const req = makeRequest({ origin: "https://evil.careerready.pages.dev.attacker.com" });
    const result = validateOrigin(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);
  });

  it("handles malformed referer gracefully", () => {
    const req = makeRequest({ referer: "not-a-valid-url" });
    const result = validateOrigin(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);
  });
});
