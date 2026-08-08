import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";

const schema = z.object({ reason: z.string().trim().max(1000).optional() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "The deletion request is invalid." }, { status: 400 });
  const { supabase, profile } = await getAuthContext();
  if (!profile) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: household } = await supabase.from("households").select("id").eq("created_by", profile.id).limit(1).maybeSingle();
  const { data, error } = await supabase.from("deletion_requests").insert({ requested_by: profile.id, household_id: household?.id ?? null, admin_decision: parsed.data.reason ?? null }).select("id,status,created_at").single();
  if (error || !data) return NextResponse.json({ error: "Unable to submit deletion request." }, { status: 400 });
  await supabase.from("audit_events").insert({ actor_id: profile.id, action: "DELETION_REQUESTED", entity_type: "deletion_request", entity_id: data.id, metadata: {} });
  return NextResponse.json({ ok: true, request: data });
}
