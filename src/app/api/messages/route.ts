import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";
import { analyzeWithCorti } from "@/lib/corti-gateway";

const schema = z.object({ elderId: z.string().uuid(), body: z.string().trim().min(1).max(4000) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Write a message before sending." }, { status: 400 });
  const { supabase, profile } = await getAuthContext();
  if (!profile) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: elder } = await supabase.from("elders").select("household_id,consent_state").eq("id", parsed.data.elderId).maybeSingle();
  if (!elder) return NextResponse.json({ error: "Parent record not found." }, { status: 404 });
  let { data: conversation } = await supabase.from("conversations").select("id").eq("household_id", elder.household_id).eq("elder_id", parsed.data.elderId).limit(1).maybeSingle();
  if (!conversation) conversation = (await supabase.from("conversations").insert({ household_id: elder.household_id, elder_id: parsed.data.elderId }).select("id").single()).data;
  if (!conversation) return NextResponse.json({ error: "Unable to open care conversation." }, { status: 400 });
  const { data: message, error } = await supabase.from("messages").insert({ conversation_id: conversation.id, sender_id: profile.id, body: parsed.data.body }).select("id").single();
  if (error || !message) return NextResponse.json({ error: "Unable to send message." }, { status: 400 });
  const ai = await analyzeWithCorti({ message: parsed.data.body, patientContext: `Elder ${parsed.data.elderId}`, consentState: String(elder.consent_state) });
  const { data: job } = await supabase.from("ai_jobs").insert({ message_id: message.id, status: ai.provider === "CORTI" ? "COMPLETED" : "DISABLED", provider: ai.provider, risk_level: ai.riskLevel, risk_reason: ai.riskReason, context_summary: ai.contextSummary, drafted_response: ai.draftedResponse, processed_at: new Date().toISOString() }).select("id").single();
  await supabase.from("messages").update({ risk_level: ai.riskLevel, ai_job_id: job?.id ?? null }).eq("id", message.id);
  return NextResponse.json({ ok: true, messageId: message.id, automatedNotice: ai.riskLevel === "CRITICAL" ? ai.draftedResponse : null, aiEnabled: ai.enabled });
}
