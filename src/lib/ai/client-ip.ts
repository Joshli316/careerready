import type { NextRequest } from "next/server";

/**
 * Get the real client IP. On Cloudflare, CF-Connecting-IP is set by the
 * edge and cannot be spoofed by clients. Falls back to X-Forwarded-For
 * for local development only.
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anonymous"
  );
}
