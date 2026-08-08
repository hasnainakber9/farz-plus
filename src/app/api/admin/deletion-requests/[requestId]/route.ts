import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({ action: z.enum(["APPROVE", "REJECT", "PURGE"]), legalHold: z.boolean().optional() });

export async function PATCH(request: Request, context: { params: Promise<{ requestId: string }> }) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Choose an approved deletion action." }, { status: 400 });
  const { requestId } = await context.params;
  const { profile } = await requireRole("ADMIN");
  const admin = createAdminClient();
  const { data: deletion } = await admin.from("deletion_requests").select("id,status,legal_hold,household_id,requested_by").eq("id", requestId).maybeSingle();
  if (!deletion) return NextResponse.json({ error: "Deletion request not found." }, { status: 404 });

  if (parsed.data.action === "PURGE") {
    if (deletion.status !== "APPROVED" || deletion.legal_hold) return NextResponse.json({ error: "Only an approved request without legal hold can be purged." }, { status: 409 });
    const { data: members } = deletion.household_id ? await admin.from("household_members").select("user_id").eq("household_id", deletion.household_id) : { data: [] };
    const userIds = (members ?? []).map((member: { user_id: string }) => member.user_id);
    if (deletion.household_id) await admin.from("households").delete().eq("id", deletion.household_id);
    await admin.from("deletion_requests").update({ status: "PURGED", purged_at: new Date().toISOString(), decided_by: profile.id, decided_at: new Date().toISOString() }).eq("id", requestId);
    for (const userId of userIds) await admin.auth.admin.deleteUser(userId);
    return NextResponse.json({ ok: true, status: "PURGED" });
  }

  const status = parsed.data.action === "APPROVE" ? "APPROVED" : "REJECTED";
  const legalHold = parsed.data.legalHold ?? deletion.legal_hold;
  await admin.from("deletion_requests").update({ status, legal_hold: legalHold, decided_by: profile.id, decided_at: new Date().toISOString() }).eq("id", requestId);
  if (status === "APPROVED" && deletion.household_id) {
    const { data: members } = await admin.from("household_members").select("user_id").eq("household_id", deletion.household_id);
    for (const member of (members ?? []) as Array<{ user_id: string }>) await admin.from("profiles").update({ active: false }).eq("id", member.user_id);
  }
  await admin.from("audit_events").insert({ actor_id: profile.id, action: `DELETION_${status}`, entity_type: "deletion_request", entity_id: requestId, metadata: { legal_hold: legalHold } });
  return NextResponse.json({ ok: true, status, legalHold });
}
