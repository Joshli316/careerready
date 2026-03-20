export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getAIClient } from "@/lib/ai/client";
import { PROMPTS } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";

export async function POST(request: NextRequest) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI features are not configured" }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed, remaining } = checkRateLimit(`ai:ip:${ip}`, false);
  if (!allowed) {
    return NextResponse.json({ error: "Daily AI limit reached." }, { status: 429 });
  }

  const { statement, type } = (await request.json()) as { statement: string; type?: string };
  if (!statement) {
    return NextResponse.json({ error: "Missing statement" }, { status: 400 });
  }

  try {
    const client = getAIClient(apiKey);
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      system: PROMPTS.refineStatement,
      messages: [
        {
          role: "user",
          content: `Type: ${type || "brand statement"}\n\nOriginal: ${statement}`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ refined: text, remaining });
  } catch {
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
