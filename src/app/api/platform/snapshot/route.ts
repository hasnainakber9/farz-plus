import { NextResponse } from "next/server";
import { getPlatformSnapshot } from "@/lib/platform-repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try { return NextResponse.json(await getPlatformSnapshot(), { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ error: "Care operations are temporarily unavailable." }, { status: 503 }); }
}
