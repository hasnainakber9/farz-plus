import { NextResponse } from "next/server";
import { z } from "zod";
import { routeForRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, ProfileRecord } from "@/lib/supabase/types";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return NextResponse.json({ error: "Those credentials do not match a Farz+ account." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("*").eq("auth_user_id", data.user.id).maybeSingle();
  const role = ((profile as ProfileRecord | null)?.role ?? "FAMILY") as AppRole;
  return NextResponse.json({ role, name: (profile as ProfileRecord | null)?.display_name ?? data.user.email, route: routeForRole(role) });
}
