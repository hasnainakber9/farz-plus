import { requireRole } from "@/lib/auth";
import type { AppRole } from "@/lib/supabase/types";

export async function requireDemoRole(role: AppRole | "DOCTOR") {
  return requireRole(role === "DOCTOR" ? "CLINICIAN" : role);
}
