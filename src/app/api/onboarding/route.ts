import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";

const schema = z.object({
  country: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  parentName: z.string().trim().min(2).max(120),
  approximateAge: z.coerce.number().int().min(18).max(120),
  relationship: z.string().trim().min(2).max(60),
  preferredLanguage: z.string().trim().min(2).max(40),
  livingArrangement: z.string().trim().min(2).max(120),
  emergencyName: z.string().trim().min(2).max(120),
  emergencyPhone: z.string().trim().min(5).max(40),
  emergencyRelationship: z.string().trim().min(2).max(60),
  consentAttested: z.literal(true),
  healthConsent: z.boolean().default(false),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Complete the parent, emergency, and consent fields." }, { status: 400 });
  const { supabase, profile } = await getAuthContext();
  if (!profile) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { data: household } = await supabase.from("households").select("id").eq("created_by", profile.id).limit(1).maybeSingle();
  const householdId = household?.id ?? (await supabase.from("households").insert({ name: `${profile.display_name}'s family`, created_by: profile.id, country: parsed.data.country, city: parsed.data.city }).select("id").single()).data?.id;
  if (!householdId) return NextResponse.json({ error: "Unable to create household." }, { status: 400 });
  await supabase.from("household_members").upsert({ household_id: householdId, user_id: profile.id, member_role: "OWNER" });
  const { data: elder, error: elderError } = await supabase.from("elders").insert({ household_id: householdId, created_by: profile.id, name: parsed.data.parentName, approximate_age: parsed.data.approximateAge, relationship: parsed.data.relationship, city: parsed.data.city, preferred_language: parsed.data.preferredLanguage, living_arrangement: parsed.data.livingArrangement, consent_state: parsed.data.healthConsent ? "VERIFIED" : "ATTESTED" }).select("id").single();
  if (elderError || !elder) return NextResponse.json({ error: "Unable to create parent profile." }, { status: 400 });
  await supabase.from("emergency_contacts").insert({ elder_id: elder.id, name: parsed.data.emergencyName, phone: parsed.data.emergencyPhone, relationship: parsed.data.emergencyRelationship, is_primary: true });
  await supabase.from("consent_records").insert({ elder_id: elder.id, granted_by: profile.id, consent_type: "FAMILY_ATTESTATION", purpose: "Store and coordinate recorded parent-care information", policy_version: "2026-08-08-v1" });
  if (parsed.data.healthConsent) await supabase.from("consent_records").insert({ elder_id: elder.id, granted_by: profile.id, consent_type: "HEALTH_RECORDS", purpose: "Coordinate health records, documents, and clinician handoffs", policy_version: "2026-08-08-v1", consent_state: "VERIFIED" });
  await supabase.from("profiles").update({ country: parsed.data.country, city: parsed.data.city, onboarding_completed: true }).eq("id", profile.id);
  await supabase.from("audit_events").insert({ actor_id: profile.id, action: "ONBOARDING_COMPLETED", entity_type: "elder", entity_id: elder.id, metadata: { basic_consent: "ATTESTED", health_consent: parsed.data.healthConsent ? "VERIFIED" : "PENDING" } });
  return NextResponse.json({ ok: true, elderId: elder.id, route: "/dashboard/family" });
}
