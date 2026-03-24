export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { PROMPTS } from "@/lib/ai/prompts";
import { rateLimitHeaders, getAIClient, getRateLimitResult, stripCodeFences, AI_MODEL } from "@/lib/api/ai-route-helpers";

interface GenerateRequest {
  jobTitle?: string;
  company?: string;
  jobDescription?: string;
  resume?: string;
}

interface GeneratedLetter {
  recipientName: string;
  opening: string;
  body: string;
  closing: string;
}

export async function POST(request: NextRequest) {
  const rlResult = await getRateLimitResult(request);
  if (rlResult instanceof NextResponse) return rlResult;
  const { remaining, limit } = rlResult;

  const clientOrError = getAIClient();
  if (clientOrError instanceof NextResponse) return clientOrError;

  let body: GenerateRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body.", code: "INVALID_JSON" }, { status: 400 });
  }

  const { jobTitle, company, jobDescription, resume } = body;

  if (!jobDescription || typeof jobDescription !== "string" || jobDescription.length > 15000) {
    return NextResponse.json(
      { error: "Job description is required (max 15,000 characters).", code: "INVALID_INPUT" },
      { status: 400 }
    );
  }
  if (!resume || typeof resume !== "string" || resume.length > 15000) {
    return NextResponse.json(
      { error: "Resume is required (max 15,000 characters).", code: "INVALID_INPUT" },
      { status: 400 }
    );
  }

  try {
    const message = await clientOrError.messages.create({
      model: AI_MODEL,
      max_tokens: 1024,
      system: PROMPTS.generateCoverLetter,
      messages: [
        {
          role: "user",
          content: `<job_title>${jobTitle || "Not specified"}</job_title>
<company>${company || "Not specified"}</company>

<job_description>${jobDescription}</job_description>

<resume>${resume}</resume>`,
        },
      ],
    });

    const rawText =
      message.content[0]?.type === "text" ? message.content[0].text : "";

    // Strip markdown code fences that the AI sometimes wraps around JSON
    const jsonText = stripCodeFences(rawText);

    let result: GeneratedLetter;
    try {
      const parsed = JSON.parse(jsonText);
      result = {
        recipientName: typeof parsed.recipientName === "string" ? parsed.recipientName : "Hiring Manager",
        opening: typeof parsed.opening === "string" ? parsed.opening : "",
        body: typeof parsed.body === "string" ? parsed.body : "",
        closing: typeof parsed.closing === "string" ? parsed.closing : "",
      };
    } catch {
      // If JSON parsing still fails, try to split the raw text into paragraphs
      const paragraphs = rawText.split(/\n\n+/).filter((p) => p.trim());
      if (paragraphs.length <= 1) {
        result = {
          recipientName: "Hiring Manager",
          opening: "",
          body: paragraphs[0] || rawText,
          closing: "",
        };
      } else if (paragraphs.length === 2) {
        result = {
          recipientName: "Hiring Manager",
          opening: paragraphs[0],
          body: "",
          closing: paragraphs[1],
        };
      } else {
        result = {
          recipientName: "Hiring Manager",
          opening: paragraphs[0],
          body: paragraphs.slice(1, -1).join("\n\n"),
          closing: paragraphs[paragraphs.length - 1],
        };
      }
    }

    return NextResponse.json({ result, remaining }, { headers: rateLimitHeaders(remaining, limit) });
  } catch (err) {
    console.error("[generate-cover-letter] AI request failed:", err);
    return NextResponse.json(
      { error: "Cover letter generation failed. Please try again.", code: "AI_REQUEST_FAILED" },
      { status: 500 }
    );
  }
}
