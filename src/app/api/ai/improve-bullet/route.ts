export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getAIClient } from "@/lib/ai/client";
import { PROMPTS } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";

export async function POST(request: NextRequest) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI features are not configured" },
      { status: 503 }
    );
  }

  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed, remaining } = checkRateLimit(`ai:ip:${ip}`, false);

  if (!allowed) {
    return NextResponse.json(
      { error: "Daily AI limit reached. Create an account for more." },
      { status: 429 }
    );
  }

  const { bullet, context } = (await request.json()) as { bullet: string; context?: string };
  if (!bullet || typeof bullet !== "string" || bullet.length > 500) {
    return NextResponse.json(
      { error: "Invalid bullet. Must be a non-empty string under 500 characters." },
      { status: 400 }
    );
  }

  try {
    const client = getAIClient(apiKey);
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      system: PROMPTS.improveBullet,
      messages: [
        {
          role: "user",
          content: `Context: ${context || "Entry-level position"}\n\nOriginal bullet: ${bullet}`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ improved: text, remaining });
  } catch {
    return NextResponse.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}
