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

  let body: { coverLetter?: string; jobTitle?: string; company?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body.", code: "INVALID_JSON" }, { status: 400 });
  }
  const { coverLetter, jobTitle, company } = body;
  if (!coverLetter || typeof coverLetter !== "string" || coverLetter.length > 10000) {
    return NextResponse.json({ error: "Invalid cover letter", code: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    const message = await clientOrError.messages.create({
      model: AI_MODEL,
      max_tokens: 512,
      system: PROMPTS.reviewCoverLetter,
      messages: [
        {
          role: "user",
          content: `<job_info>${jobTitle || "Not specified"} at ${company || "Not specified"}</job_info>\n\n<cover_letter>${coverLetter}</cover_letter>`,
        },
      ],
    });

    const text = message.content[0]?.type === "text" ? message.content[0].text : "";
    return NextResponse.json({ result: text, remaining }, { headers: rateLimitHeaders(remaining, limit) });
  } catch (err) {
    console.error("[review-cover-letter] AI request failed:", err);
    return NextResponse.json({ error: "AI request failed", code: "AI_REQUEST_FAILED" }, { status: 500 });
  }
}
