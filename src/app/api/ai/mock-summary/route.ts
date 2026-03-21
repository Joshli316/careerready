export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getAIClient } from "@/lib/ai/client";
import { PROMPTS } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getClientIp } from "@/lib/ai/client-ip";

interface Exchange {
  question: string;
  answer: string;
  feedback: string;
}

interface SummaryRequest {
  jobContext: string;
  exchanges: Exchange[];
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI features are not configured" },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  const { allowed, remaining } = checkRateLimit(`ai:ip:${ip}`, false);
  if (!allowed) {
    return NextResponse.json(
      { error: "Daily AI limit reached. Try again tomorrow." },
      { status: 429 }
    );
  }

  let body: SummaryRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { jobContext, exchanges } = body;
  if (!exchanges || !Array.isArray(exchanges) || exchanges.length === 0) {
    return NextResponse.json(
      { error: "At least one exchange is required." },
      { status: 400 }
    );
  }

  const transcript = exchanges
    .map(
      (e, i) =>
        `Q${i + 1}: ${e.question}\nAnswer: ${e.answer}\nFeedback: ${e.feedback}`
    )
    .join("\n\n");

  try {
    const client = getAIClient(apiKey);
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: PROMPTS.mockInterviewSummary,
      messages: [
        {
          role: "user",
          content: `Job context: ${jobContext || "General interview practice"}\n\nTRANSCRIPT:\n${transcript}`,
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const jsonText = rawText
      .replace(/^```(?:json)?\s*\n?/, "")
      .replace(/\n?```\s*$/, "");

    const parsed = JSON.parse(jsonText);

    // Validate required fields
    const result = {
      overall: typeof parsed.overall === "string" ? parsed.overall : "",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      confidenceRating: typeof parsed.confidenceRating === "number" ? parsed.confidenceRating : 5,
      confidenceNote: typeof parsed.confidenceNote === "string" ? parsed.confidenceNote : "",
    };

    return NextResponse.json({ result, remaining });
  } catch {
    return NextResponse.json(
      { error: "Summary generation failed. Please try again." },
      { status: 500 }
    );
  }
}
