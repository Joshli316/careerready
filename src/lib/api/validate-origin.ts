import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://careerready.pages.dev",
];

/**
 * Check if the origin matches the Cloudflare Pages preview pattern.
 * Preview deploys use `<hash>.<project>.pages.dev` subdomains.
 */
function isCloudflarePreview(origin: string): boolean {
  return /^https:\/\/[a-z0-9-]+\.careerready\.pages\.dev$/.test(origin);
}

/**
 * Validates the Origin (or Referer) header against allowed origins.
 * Returns a 403 NextResponse if the origin is not allowed, or null if valid.
 *
 * Allows all localhost origins for local development and Cloudflare preview deploys.
 */
export function validateOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Extract origin from referer if no Origin header (e.g., same-origin GET)
  let refererOrigin: string | null = null;
  if (referer) {
    try {
      refererOrigin = new URL(referer).origin;
    } catch {
      // Malformed referer — treat as missing
    }
  }
  const checkValue = origin ?? refererOrigin;

  // If no origin header at all (e.g., server-to-server, curl), block it
  if (!checkValue) {
    return NextResponse.json(
      { error: "Forbidden: missing origin." },
      { status: 403 }
    );
  }

  // Allow localhost for development
  if (
    checkValue.startsWith("http://localhost:") ||
    checkValue === "http://localhost"
  ) {
    return null;
  }

  // Allow configured origins and Cloudflare preview deploys
  if (ALLOWED_ORIGINS.includes(checkValue) || isCloudflarePreview(checkValue)) {
    return null;
  }

  return NextResponse.json(
    { error: "Forbidden: origin not allowed." },
    { status: 403 }
  );
}
