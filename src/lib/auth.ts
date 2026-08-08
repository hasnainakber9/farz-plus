import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, ProfileRecord } from "@/lib/supabase/types";

export function routeForRole(role: AppRole) {
  switch (role) {
    case "FAMILY":
    case "ELDER":
      return "/dashboard/family";
    case "CARE_MANAGER":
      return "/dashboard/care-manager";
    case "CLINICIAN":
      return "/dashboard/clinician";
    case "ADMIN":
      return "/dashboard/admin";
    case "PARTNER":
    case "EMPLOYER":
      return "/dashboard";
  }
}

export async function getAuthContext() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return { supabase, user: null, profile: null };

  const { data: profile } = await supabase.from("profiles").select("*").eq("auth_user_id", userData.user.id).maybeSingle();
  return { supabase, user: userData.user, profile: (profile as ProfileRecord | null) ?? null };
}

export async function requireUser() {
  const context = await getAuthContext();
  if (!context.user || !context.profile || !context.profile.active) redirect("/login");
  return context as typeof context & { user: NonNullable<typeof context.user>; profile: ProfileRecord };
}

export async function requireRole(roles: AppRole | AppRole[]) {
  const context = await requireUser();
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(context.profile.role)) redirect(routeForRole(context.profile.role));
  if (["CARE_MANAGER", "CLINICIAN", "ADMIN"].includes(context.profile.role)) {
    const { data: assurance } = await context.supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance?.currentLevel !== "aal2") redirect("/mfa");
  }
  return context;
}
