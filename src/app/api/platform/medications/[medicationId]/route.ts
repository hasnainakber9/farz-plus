import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";
import { getPlatformSnapshot } from "@/lib/platform-repository";

export async function PATCH(request: Request, { params }: { params: Promise<{ medicationId: string }> }) {
  const { medicationId } = await params;
  const parsed = z.object({ status: z.enum(["TAKEN", "MISSED", "PENDING"]) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid medication status." }, { status: 400 });
  const { supabase, profile } = await getAuthContext();
  if (!profile) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { error } = await supabase.from("medications").update({ status: parsed.data.status }).eq("id", medicationId);
  if (error) return NextResponse.json({ error: "Medication record could not be updated." }, { status: 400 });
  await supabase.from("audit_events").insert({ actor_id: profile.id, action: "MEDICATION_STATUS_UPDATED", entity_type: "medication", entity_id: medicationId, metadata: { status: parsed.data.status } });
  return NextResponse.json({ snapshot: await getPlatformSnapshot() });
}
