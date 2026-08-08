import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";

const schema = z.object({ planKey: z.string().trim().min(2).max(80) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Choose a care plan." }, { status: 400 });
  const { supabase, profile } = await getAuthContext();
  if (!profile) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: household } = await supabase.from("households").select("id").eq("created_by", profile.id).limit(1).maybeSingle();
  if (!household) return NextResponse.json({ error: "Complete family onboarding first." }, { status: 400 });
  const { data: subscription, error } = await supabase.from("subscriptions").insert({ household_id: household.id, plan_key: parsed.data.planKey, requested_by: profile.id, status: "REQUESTED" }).select("id,plan_key,status,created_at").single();
  if (error || !subscription) return NextResponse.json({ error: "Unable to record the plan request." }, { status: 400 });
  await supabase.from("audit_events").insert({ actor_id: profile.id, action: "PLAN_REQUESTED", entity_type: "subscription", entity_id: subscription.id, metadata: { plan_key: parsed.data.planKey } });
  return NextResponse.json({ ok: true, subscription });
}
