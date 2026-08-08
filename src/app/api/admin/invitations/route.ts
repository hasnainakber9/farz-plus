import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({ email: z.string().email(), role: z.enum(["CARE_MANAGER", "CLINICIAN", "PARTNER", "EMPLOYER"]) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Use a valid email and restricted role." }, { status: 400 });
  const { profile } = await requireRole("ADMIN");
  let admin;
  try { admin = createAdminClient(); } catch { return NextResponse.json({ error: "Admin invitations are not configured." }, { status: 503 }); }
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://farz-plus.vercel.app"}/auth/callback?next=/dashboard`;
  const { data, error } = await admin.auth.admin.inviteUserByEmail(parsed.data.email, { redirectTo, data: { invited_role: parsed.data.role } });
  if (error || !data.user) return NextResponse.json({ error: error?.message ?? "Unable to send invitation." }, { status: 400 });
  const { data: invitedProfile } = await admin.from("profiles").select("id").eq("auth_user_id", data.user.id).maybeSingle();
  if (invitedProfile) await admin.from("profiles").update({ role: parsed.data.role, mfa_required: true }).eq("id", invitedProfile.id);
  await admin.from("invitations").insert({ email: parsed.data.email, role: parsed.data.role, invited_by: profile.id, token_hash: crypto.randomUUID() });
  await admin.from("audit_events").insert({ actor_id: profile.id, action: "INVITATION_SENT", entity_type: "profile", entity_id: invitedProfile?.id ?? data.user.id, metadata: { role: parsed.data.role } });
  return NextResponse.json({ ok: true, email: parsed.data.email, role: parsed.data.role });
}
