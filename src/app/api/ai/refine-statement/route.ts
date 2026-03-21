export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getAIClient } from "@/lib/ai/client";
import { PROMPTS } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getClientIp } from "@/lib/ai/client-ip";

export async function POST(request: NextRequest) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI features are not configured" }, { status: 503 });
  }

  const ip = getClientIp(request);
  const { allowed, remaining } = checkRateLimit(`ai:ip:${ip}`, false);
  if (!allowed) {
    return NextResponse.json({ error: "Daily AI limit reached." }, { status: 429 });
  }

  let body: { statement?: string; type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { statement, type } = body;
  if (!statement || typeof statement !== "string" || statement.length > 2000) {
    return NextResponse.json({ error: "Invalid statement" }, { status: 400 });
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
    return NextResponse.json({ result: text, remaining });
  } catch {
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
