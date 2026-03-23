export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { PROMPTS } from "@/lib/ai/prompts";
import { rateLimitHeaders, getAIClient, getRateLimitResult, stripCodeFences } from "@/lib/api/ai-route-helpers";

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
  const rlResult = await getRateLimitResult(request);
  if (rlResult instanceof NextResponse) return rlResult;
  const { remaining, limit } = rlResult;

  const clientOrError = getAIClient();
  if (clientOrError instanceof NextResponse) return clientOrError;

  let body: SummaryRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request.", code: "INVALID_JSON" }, { status: 400 });
  }

  const { jobContext, exchanges } = body;
  if (!exchanges || !Array.isArray(exchanges) || exchanges.length === 0) {
    return NextResponse.json(
      { error: "At least one exchange is required.", code: "MISSING_FIELDS" },
      { status: 400 }
    );
  }

  // Validate each exchange has the required string fields
  const validExchanges = exchanges.every(
    (e): e is Exchange =>
      e && typeof e.question === "string" && typeof e.answer === "string" && typeof e.feedback === "string"
  );
  if (!validExchanges) {
    return NextResponse.json(
      { error: "Each exchange must have question, answer, and feedback fields.", code: "INVALID_EXCHANGE" },
      { status: 400 }
    );
  }

  if (exchanges.length > 20) {
    return NextResponse.json(
      { error: "Too many exchanges (max 20).", code: "INPUT_TOO_LONG" },
      { status: 400 }
    );
  }

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  const transcript = exchanges
    .map(
      (e, i) =>
        `Q${i + 1}: ${truncate(e.question, 500)}\nAnswer: ${truncate(e.answer, 2000)}\nFeedback: ${truncate(e.feedback, 1000)}`
    )
    .join("\n\n");

  try {
    const message = await clientOrError.messages.create({
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
      message.content[0]?.type === "text" ? message.content[0].text : "";
    const jsonText = stripCodeFences(rawText);

    const parsed = JSON.parse(jsonText);

    const result = {
      overall: typeof parsed.overall === "string" ? parsed.overall : "",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      confidenceRating: typeof parsed.confidenceRating === "number" ? Math.min(10, Math.max(1, Math.round(parsed.confidenceRating))) : 5,
      confidenceNote: typeof parsed.confidenceNote === "string" ? parsed.confidenceNote : "",
    };

    return NextResponse.json({ result, remaining }, { headers: rateLimitHeaders(remaining, limit) });
  } catch (err) {
    console.error("[mock-summary] AI request failed:", err);
    return NextResponse.json(
      { error: "Could not generate summary. Try again.", code: "AI_REQUEST_FAILED" },
      { status: 500 }
    );
  }
}
