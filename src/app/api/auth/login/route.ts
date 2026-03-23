// TODO: Auth V2 — implement when account creation feature ships
export const runtime = "edge";

import { NextRequest } from "next/server";
import { validateOrigin } from "@/lib/api/validate-origin";

export function POST(request: NextRequest) {
  const originError = validateOrigin(request);
  if (originError) return originError;

  return Response.json(
    {
      error: "Login is coming soon. Your data is saved locally in your browser.",
      code: "AUTH_NOT_AVAILABLE",
    },
    { status: 501 }
  );
}
