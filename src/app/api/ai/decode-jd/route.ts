export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getAIClient } from "@/lib/ai/client";
import { PROMPTS } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getClientIp } from "@/lib/ai/client-ip";
import type { StarStory } from "@/types/interview";

interface DecodeRequest {
  jobDescription: string;
  stories?: StarStory[];
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI features are not available right now." },
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

  let body: DecodeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { jobDescription, stories } = body;

  if (
    !jobDescription ||
    typeof jobDescription !== "string" ||
    jobDescription.length > 15000
  ) {
    return NextResponse.json(
      { error: "Job description is required (max 15,000 characters)." },
      { status: 400 }
    );
  }

  const storiesText =
    stories && stories.length > 0
      ? stories
          .filter((s) => s && s.id)
          .map(
            (s) =>
              `[${s.id}] Q: ${s.question || ""} | Skills: ${s.primarySkill || ""}, ${s.secondarySkill || ""} | S: ${(s.situation || "").slice(0, 500)} | A: ${(s.action || "").slice(0, 500)} | R: ${(s.result || "").slice(0, 500)}`
          )
          .join("\n")
      : "No stories available.";

  try {
    const client = getAIClient(apiKey);
    const message = await client.messages.create({
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
      message.content[0].type === "text" ? message.content[0].text : "";

    // Strip markdown code fences if present
    const jsonText = rawText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");

    const parsed = JSON.parse(jsonText);

    // Validate required fields are arrays (guard against malformed AI responses)
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

    return NextResponse.json({ result, remaining });
  } catch {
    return NextResponse.json(
      { error: "Could not analyze this job posting. Try again." },
      { status: 500 }
    );
  }
}
