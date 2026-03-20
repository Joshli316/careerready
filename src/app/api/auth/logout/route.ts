export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { message: "Logout requires Cloudflare D1. Use localStorage for now." },
    { status: 501 }
  );
}
