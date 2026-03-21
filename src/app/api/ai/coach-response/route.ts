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

  const { question, answer, jobContext } = (await request.json()) as { question: string; answer: string; jobContext?: string };
  if (!question || typeof question !== "string" || !answer || typeof answer !== "string") {
    return NextResponse.json({ error: "Missing or invalid question/answer" }, { status: 400 });
  }
  if (answer.length > 5000) {
    return NextResponse.json({ error: "Answer too long (max 5000 chars)" }, { status: 400 });
  }

  try {
    const client = getAIClient(apiKey);
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: PROMPTS.coachResponse,
      messages: [
        {
          role: "user",
          content: `Job context: ${jobContext || "Entry-level position"}\n\nQuestion: ${question}\n\nMy answer: ${answer}`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ coaching: text, remaining });
  } catch {
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
