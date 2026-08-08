import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const parsed = z.object({ password: z.string().min(8).max(128) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Use a password with at least 8 characters." }, { status: 400 });
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return NextResponse.json({ error: "Password update failed. Open the reset link again." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
