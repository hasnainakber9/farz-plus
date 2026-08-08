import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { getCurrentElderId, getPlatformSnapshot } from "@/lib/platform-repository";

export async function POST() {
  const { supabase, profile } = await getAuthContext();
  const elderId = await getCurrentElderId();
  if (!profile || !elderId) return NextResponse.json({ error: "Add a parent and emergency contact before using this workflow." }, { status: 400 });
  const { data: elder } = await supabase.from("elders").select("household_id,name").eq("id", elderId).maybeSingle();
  if (!elder) return NextResponse.json({ error: "Parent record not found." }, { status: 404 });
  const { data: request, error } = await supabase.from("care_requests").insert({ household_id: elder.household_id, elder_id: elderId, created_by: profile.id, type: "GENERAL_CONCERN", title: "Urgent family escalation", description: "Family requested urgent help. This automated route does not replace local emergency services.", status: "ESCALATED", risk_level: "CRITICAL" }).select("id").single();
  if (error || !request) return NextResponse.json({ error: "Unable to create urgent request." }, { status: 400 });
  await supabase.from("elders").update({ risk_level: "CRITICAL" }).eq("id", elderId);
  await supabase.from("case_events").insert({ care_request_id: request.id, actor_id: profile.id, event_type: "URGENT_ROUTING_NOTICE", detail: "Automated notice displayed. Family directed to local emergency services and recorded emergency contact.", visible_to_family: true });
  await supabase.from("audit_events").insert({ actor_id: profile.id, action: "URGENT_CASE_CREATED", entity_type: "care_request", entity_id: request.id, metadata: { automated: true } });
  return NextResponse.json({ message: `Urgent request created for ${elder.name}. Call local emergency services now if anyone is in immediate danger.`, snapshot: await getPlatformSnapshot() });
}
