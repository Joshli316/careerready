export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Placeholder — full implementation requires D1 binding at runtime
  // In production, this creates a user, hashes password, creates session
  return NextResponse.json(
    { message: "Registration requires Cloudflare D1. Use localStorage for now." },
    { status: 501 }
  );
}
