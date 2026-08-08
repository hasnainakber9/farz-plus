import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const signupSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  country: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  acceptTerms: z.literal(true),
  acknowledgePrivacy: z.literal(true),
});

export async function POST(request: Request) {
  const parsed = signupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Complete every required field and accept the terms." }, { status: 400 });

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
      data: {
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        country: parsed.data.country,
        phone: parsed.data.phone || null,
      },
    },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ needsEmailConfirmation: !data.session, route: data.session ? "/onboarding" : "/login?confirmed=check-email" });
}
