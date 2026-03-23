export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { PROMPTS } from "@/lib/ai/prompts";
import { rateLimitHeaders, getAIClient, getRateLimitResult, stripCodeFences } from "@/lib/api/ai-route-helpers";
import type { StarStory } from "@/types/interview";

interface DecodeRequest {
  jobDescription: string;
  stories?: StarStory[];
}

export async function POST(request: NextRequest) {
  const rlResult = await getRateLimitResult(request);
  if (rlResult instanceof NextResponse) return rlResult;
  const { remaining, limit } = rlResult;

  const clientOrError = getAIClient();
  if (clientOrError instanceof NextResponse) return clientOrError;

  let body: DecodeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request.", code: "INVALID_JSON" }, { status: 400 });
  }

  const { jobDescription, stories } = body;

  if (
    !jobDescription ||
    typeof jobDescription !== "string" ||
    jobDescription.length > 15000
  ) {
    return NextResponse.json(
      { error: "Job description is required (max 15,000 characters).", code: "INVALID_INPUT" },
      { status: 400 }
    );
  }

  const storiesText =
    stories && stories.length > 0
      ? stories
          .filter((s) => s && s.id)
          .slice(0, 20) // Limit to 20 stories to control token usage
          .map(
            (s) =>
              `[${s.id}] Q: ${s.question || ""} | Skills: ${s.primarySkill || ""}, ${s.secondarySkill || ""} | S: ${(s.situation || "").slice(0, 500)} | A: ${(s.action || "").slice(0, 500)} | R: ${(s.result || "").slice(0, 500)}`
          )
          .join("\n")
      : "No stories available.";

  try {
    const message = await clientOrError.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: PROMPTS.decodeJD,
      messages: [
        {
          role: "user",
          content: `<job_description>\n${jobDescription}\n</job_description>\n\n<user_stories>\n${storiesText}\n</user_stories>`,
        },
      ],
    });

    const rawText =
      message.content[0]?.type === "text" ? message.content[0].text : "";

    const jsonText = stripCodeFences(rawText);

    const parsed = JSON.parse(jsonText);

    const result = {
      jobTitle: typeof parsed.jobTitle === "string" ? parsed.jobTitle : "",
      company: typeof parsed.company === "string" ? parsed.company : "",
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      requirements: Array.isArray(parsed.requirements) ? parsed.requirements : [],
      storyMatches: Array.isArray(parsed.storyMatches) ? parsed.storyMatches : [],
      gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
      mockQuestions: Array.isArray(parsed.mockQuestions) ? parsed.mockQuestions : [],
      prepChecklist: Array.isArray(parsed.prepChecklist) ? parsed.prepChecklist : [],
    };

    return NextResponse.json({ result, remaining }, { headers: rateLimitHeaders(remaining, limit) });
  } catch (err) {
    console.error("[decode-jd] AI request failed:", err);
    return NextResponse.json(
      { error: "Could not analyze this job posting. Try again.", code: "AI_REQUEST_FAILED" },
      { status: 500 }
    );
  }
}
