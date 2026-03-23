export function stripCodeFences(text: string): string {
  return text.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
}

import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getAIClient as getClient } from "@/lib/ai/client";
import { checkRateLimitD1 } from "@/lib/ai/rate-limit";
import { getClientIp } from "@/lib/ai/client-ip";
import { validateOrigin } from "@/lib/api/validate-origin";
import type { RateLimitResult } from "@/lib/ai/rate-limit";
import type Anthropic from "@anthropic-ai/sdk";

export function rateLimitHeaders(remaining: number, limit: number) {
  return {
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Limit": String(limit),
  };
}

/**
 * Check the API key and return an Anthropic client, or a 503 Response if not configured.
 * Reads from Cloudflare env bindings first, falls back to process.env for local dev.
 */
export function getAIClient(): Anthropic | NextResponse {
  let apiKey: string | undefined;
  try {
    const { env } = getRequestContext();
    apiKey = (env as unknown as Record<string, string>).CLAUDE_API_KEY;
  } catch {
    // getRequestContext() throws outside Cloudflare Workers (e.g., local dev)
  }
  apiKey = apiKey || process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI features are not available right now.", code: "AI_NOT_CONFIGURED" },
      { status: 503 }
    );
  }
  return getClient(apiKey);
}

const MAX_BODY_BYTES = 100_000; // 100KB — generous for all AI routes

/**
 * Validate origin, enforce body size limit, and check D1-backed rate limit.
 * Returns either an error Response or the rate limit result.
 */
export async function getRateLimitResult(
  request: NextRequest
): Promise<NextResponse | RateLimitResult> {
  const originError = validateOrigin(request);
  if (originError) return originError;

  // Guard against oversized request bodies
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Request body too large.", code: "PAYLOAD_TOO_LARGE" },
      { status: 413 }
    );
  }

  const ip = getClientIp(request);
  const { env } = getRequestContext();
  const result = await checkRateLimitD1(env.DB, `ai:ip:${ip}`, false);

  if (!result.allowed) {
    return NextResponse.json(
      { error: "Daily AI limit reached. Try again tomorrow.", code: "RATE_LIMIT_EXCEEDED" },
      { status: 429 }
    );
  }

  return result;
}
