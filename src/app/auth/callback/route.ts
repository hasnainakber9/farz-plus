import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routeForRole } from "@/lib/auth";
import type { AppRole, ProfileRecord } from "@/lib/supabase/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/onboarding";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/onboarding";
  const supabase = await createClient();
  if (code) await supabase.auth.exchangeCodeForSession(code);
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.redirect(new URL("/login?error=auth-callback", url.origin));
  const { data: profile } = await supabase.from("profiles").select("role,onboarding_completed").eq("auth_user_id", data.user.id).maybeSingle();
  const role = ((profile as Pick<ProfileRecord, "role"> | null)?.role ?? "FAMILY") as AppRole;
  const destination = (profile as { onboarding_completed?: boolean } | null)?.onboarding_completed ? routeForRole(role) : safeNext;
  return NextResponse.redirect(new URL(destination, url.origin));
}
