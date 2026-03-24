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

  let body: { question?: string; answer?: string; jobContext?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request.", code: "INVALID_JSON" }, { status: 400 });
  }
  const { question, answer, jobContext } = body;
  if (!question || typeof question !== "string" || !answer || typeof answer !== "string") {
    return NextResponse.json({ error: "Question and answer are both required.", code: "MISSING_FIELDS" }, { status: 400 });
  }
  if (question.length > 2000) {
    return NextResponse.json({ error: "Question too long (max 2000 chars)", code: "INPUT_TOO_LONG" }, { status: 400 });
  }
  if (answer.length > 5000) {
    return NextResponse.json({ error: "Answer too long (max 5000 chars)", code: "INPUT_TOO_LONG" }, { status: 400 });
  }
  if (jobContext && (typeof jobContext !== "string" || jobContext.length > 5000)) {
    return NextResponse.json({ error: "Job context too long (max 5000 chars)", code: "INPUT_TOO_LONG" }, { status: 400 });
  }

  try {
    const message = await clientOrError.messages.create({
      model: AI_MODEL,
      max_tokens: 512,
      system: PROMPTS.coachResponse,
      messages: [
        {
          role: "user",
          content: `<job_context>${jobContext || "Entry-level position"}</job_context>\n\n<question>${question}</question>\n\n<candidate_answer>${answer}</candidate_answer>`,
        },
      ],
    });

    const text = message.content[0]?.type === "text" ? message.content[0].text : "";
    return NextResponse.json({ result: text, remaining }, { headers: rateLimitHeaders(remaining, limit) });
  } catch (err) {
    console.error("[coach-response] AI request failed:", err);
    return NextResponse.json({ error: "Could not get feedback. Try again.", code: "AI_REQUEST_FAILED" }, { status: 500 });
  }
}
