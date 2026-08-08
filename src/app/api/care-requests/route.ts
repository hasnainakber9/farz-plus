import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";

const requestSchema = z.object({ type: z.enum(["REGULAR_CHECK_IN", "APPOINTMENT_COORDINATION", "LAB_COORDINATION", "PHARMACY_COORDINATION", "HOME_CARE", "PHYSIOTHERAPY", "TRANSPORT", "DOCUMENT_FOLLOW_UP", "MEDICATION_CONCERN", "GENERAL_CONCERN", "OTHER"]), title: z.string().trim().min(3).max(140), description: z.string().trim().min(3).max(4000), elderId: z.string().uuid() });

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Add a request type and a short description." }, { status: 400 });
  const { supabase, profile } = await getAuthContext();
  if (!profile) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: elder } = await supabase.from("elders").select("household_id,consent_state").eq("id", parsed.data.elderId).maybeSingle();
  if (!elder) return NextResponse.json({ error: "Parent record not found." }, { status: 404 });
  const { data: careRequest, error } = await supabase.from("care_requests").insert({ household_id: elder.household_id, elder_id: parsed.data.elderId, created_by: profile.id, type: parsed.data.type, title: parsed.data.title, description: parsed.data.description }).select("id").single();
  if (error || !careRequest) return NextResponse.json({ error: "Unable to create care request." }, { status: 400 });
  await supabase.from("case_events").insert({ care_request_id: careRequest.id, actor_id: profile.id, event_type: "CARE_REQUEST_CREATED", detail: parsed.data.title, visible_to_family: true });
  await supabase.from("audit_events").insert({ actor_id: profile.id, action: "CARE_REQUEST_CREATED", entity_type: "care_request", entity_id: careRequest.id, metadata: { type: parsed.data.type } });
  return NextResponse.json({ ok: true, id: careRequest.id });
}
