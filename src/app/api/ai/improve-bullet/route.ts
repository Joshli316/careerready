export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { PROMPTS } from "@/lib/ai/prompts";
import { rateLimitHeaders, getAIClient, getRateLimitResult } from "@/lib/api/ai-route-helpers";

export async function POST(request: NextRequest) {
  const rlResult = await getRateLimitResult(request);
  if (rlResult instanceof NextResponse) return rlResult;
  const { remaining, limit } = rlResult;

  const clientOrError = getAIClient();
  if (clientOrError instanceof NextResponse) return clientOrError;

  let body: { bullet?: string; context?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body.", code: "INVALID_JSON" }, { status: 400 });
  }
  const { bullet, context } = body;
  if (!bullet || typeof bullet !== "string" || bullet.length > 500) {
    return NextResponse.json(
      { error: "Invalid bullet. Must be a non-empty string under 500 characters.", code: "INVALID_INPUT" },
      { status: 400 }
    );
  }

  try {
    const message = await clientOrError.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      system: PROMPTS.improveBullet,
      messages: [
        {
          role: "user",
          content: `<context>${context || "Entry-level position"}</context>\n\n<original_bullet>${bullet}</original_bullet>`,
        },
      ],
    });

    const text =
      message.content[0]?.type === "text" ? message.content[0].text : "";

    return NextResponse.json({ result: text, remaining }, { headers: rateLimitHeaders(remaining, limit) });
  } catch (err) {
    console.error("[improve-bullet] AI request failed:", err);
    return NextResponse.json(
      { error: "AI request failed", code: "AI_REQUEST_FAILED" },
      { status: 500 }
    );
  }
}
