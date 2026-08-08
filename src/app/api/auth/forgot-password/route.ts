import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const parsed = z.object({ email: z.string().email() }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: `${origin}/auth/callback?next=/update-password` });
  if (error) return NextResponse.json({ error: "We could not send a reset email. Try again shortly." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
