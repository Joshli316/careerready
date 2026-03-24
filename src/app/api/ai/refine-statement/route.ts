export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { PROMPTS } from "@/lib/ai/prompts";
import { rateLimitHeaders, getAIClient, getRateLimitResult, AI_MODEL } from "@/lib/api/ai-route-helpers";

export async function POST(request: NextRequest) {
  const rlResult = await getRateLimitResult(request);
  if (rlResult instanceof NextResponse) return rlResult;
  const { remaining, limit } = rlResult;

  const clientOrError = getAIClient();
  if (clientOrError instanceof NextResponse) return clientOrError;

  let body: { statement?: string; type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body.", code: "INVALID_JSON" }, { status: 400 });
  }
  const { statement, type } = body;
  if (!statement || typeof statement !== "string" || statement.length > 2000) {
    return NextResponse.json({ error: "Invalid statement", code: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    const message = await clientOrError.messages.create({
      model: AI_MODEL,
      max_tokens: 256,
      system: PROMPTS.refineStatement,
      messages: [
        {
          role: "user",
          content: `<statement_type>${type || "brand statement"}</statement_type>\n\n<original_statement>${statement}</original_statement>`,
        },
      ],
    });

    const text = message.content[0]?.type === "text" ? message.content[0].text : "";
    return NextResponse.json({ result: text, remaining }, { headers: rateLimitHeaders(remaining, limit) });
  } catch (err) {
    console.error("[refine-statement] AI request failed:", err);
    return NextResponse.json({ error: "AI request failed", code: "AI_REQUEST_FAILED" }, { status: 500 });
  }
}
