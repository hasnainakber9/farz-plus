import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";
import { getPlatformSnapshot } from "@/lib/platform-repository";

const schema = z.object({ action: z.enum(["APPROVE", "ESCALATE", "DOCTOR_REVIEW"]), draftedResponse: z.string().max(4000).optional(), note: z.string().max(4000).optional() });

export async function PATCH(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid case action." }, { status: 400 });
  const { supabase, profile } = await getAuthContext();
  if (!profile || !["ADMIN", "CARE_MANAGER", "CLINICIAN"].includes(profile.role)) return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  const { data: current } = await supabase.from("care_requests").select("*").eq("id", caseId).maybeSingle();
  if (!current) return NextResponse.json({ error: "Case not found." }, { status: 404 });
  const nextStatus = parsed.data.action === "ESCALATE" ? "ESCALATED" : parsed.data.action === "DOCTOR_REVIEW" ? "RESOLVED" : "RESOLVED";
  const update: Record<string, unknown> = { status: nextStatus };
  if (parsed.data.action === "ESCALATE") {
    const { data: clinician } = await supabase.from("profiles").select("id").eq("role", "CLINICIAN").eq("active", true).limit(1).maybeSingle();
    if (clinician) update.assigned_clinician_id = clinician.id;
  }
  const { error } = await supabase.from("care_requests").update(update).eq("id", caseId);
  if (error) return NextResponse.json({ error: "Unable to update case." }, { status: 400 });
  await supabase.from("case_events").insert({ care_request_id: caseId, actor_id: profile.id, event_type: parsed.data.action === "APPROVE" ? "HUMAN_RESPONSE_APPROVED" : parsed.data.action === "ESCALATE" ? "CLINICAL_REVIEW_INITIATED" : "CLINICAL_REVIEW_COMPLETED", detail: parsed.data.note ?? parsed.data.draftedResponse ?? "Case updated by an authorized team member.", visible_to_family: true });
  if (parsed.data.note && ["ADMIN", "CARE_MANAGER", "CLINICIAN"].includes(profile.role)) await supabase.from("internal_notes").insert({ care_request_id: caseId, author_id: profile.id, note: parsed.data.note });
  await supabase.from("audit_events").insert({ actor_id: profile.id, action: `CASE_${parsed.data.action}`, entity_type: "care_request", entity_id: caseId, metadata: { source: "dashboard" } });
  return NextResponse.json({ snapshot: await getPlatformSnapshot() });
}
