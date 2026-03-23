// TODO: Auth V2 — implement when account creation feature ships
export const runtime = "edge";

import { NextRequest } from "next/server";
import { validateOrigin } from "@/lib/api/validate-origin";

export function POST(request: NextRequest) {
  const originError = validateOrigin(request);
  if (originError) return originError;

  return Response.json(
    {
      error: "Logout is coming soon.",
      code: "AUTH_NOT_AVAILABLE",
    },
    { status: 501 }
  );
}
