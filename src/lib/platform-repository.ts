import { getAuthContext } from "@/lib/auth";
import { classifyRisk } from "@/lib/safety-rules.mjs";
import type { CareCase, CareFeedItem, Message, Patient, PlatformSnapshot } from "@/lib/platform-types";

export async function getPlatformSnapshot(): Promise<PlatformSnapshot> {
  const { supabase, profile } = await getAuthContext();
  if (!profile) return { version: 1, users: [], patients: [], messages: [], medications: [], cases: [], feed: [] };

  const [{ data: elders }, { data: medications }, { data: requests }, { data: events }, { data: conversations }] = await Promise.all([
    supabase.from("elders").select("*").order("created_at", { ascending: false }),
    supabase.from("medications").select("*").order("created_at", { ascending: false }),
    supabase.from("care_requests").select("*").order("updated_at", { ascending: false }),
    supabase.from("case_events").select("*").order("created_at", { ascending: false }).limit(80),
    supabase.from("conversations").select("id,elder_id,household_id,messages(*)").order("updated_at", { ascending: false }).limit(20),
  ]);

  const elderRows = (elders ?? []) as Array<Record<string, unknown>>;
  const medicationRows = (medications ?? []) as Array<Record<string, unknown>>;
  const requestRows = (requests ?? []) as Array<Record<string, unknown>>;
  const eventRows = (events ?? []) as Array<Record<string, unknown>>;
  const conversationRows = (conversations as unknown as Array<Record<string, unknown>> | null) ?? [];
  const messageRows = conversationRows.flatMap((conversation) => ((conversation.messages as unknown as Array<Record<string, unknown>> | undefined) ?? []).map((message) => ({ ...message, elder_id: conversation.elder_id }))) as Array<Record<string, unknown>>;

  const patients: Patient[] = elderRows.map((elder) => ({
    id: String(elder.id), tenantId: String(elder.household_id), name: String(elder.name), age: Number(elder.approximate_age ?? 0), city: String(elder.city ?? "Pakistan"),
    riskLevel: (elder.risk_level as Patient["riskLevel"]) ?? "STABLE", mood: "Recorded information", activity: "No activity recorded", allergies: [], conditions: [], careManagerId: "", familyUserIds: [], vitals: [],
  }));

  const messages: Message[] = messageRows.map((message) => {
    const text = String(message.body ?? "");
    const risk = classifyRisk(text);
    return { id: String(message.id), tenantId: String(message.conversation_id), patientId: String(message.elder_id ?? ""), sender: String(message.sender_id ?? "Family member"), senderRole: "FAMILY", text, riskFlagged: risk.level !== "STABLE", riskReason: risk.reason, status: "PENDING_APPROVAL", timestamp: new Date(String(message.created_at)).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }) };
  });

  const cases: CareCase[] = requestRows.map((request) => {
    const description = String(request.description ?? "");
    const risk = (request.risk_level as CareCase["riskLevel"]) ?? classifyRisk(description).level;
    const status = String(request.status);
    return { id: String(request.id), tenantId: String(request.household_id), patientId: String(request.elder_id), sourceMessageId: messages.find((message) => message.patientId === String(request.elder_id))?.id ?? "", riskLevel: risk, riskReason: classifyRisk(description).reason, status: status === "ESCALATED" ? "ESCALATED_TO_DOCTOR" : status === "RESOLVED" || status === "CLOSED" ? "APPROVED" : "PENDING_APPROVAL", assignedCareManagerId: String(request.assigned_care_manager_id ?? ""), assignedDoctorId: String(request.assigned_clinician_id ?? "") || undefined, contextSummary: description, draftedResponse: "A Farz+ care manager is reviewing this request. Please use local emergency services if symptoms are severe or rapidly worsening.", updatedAt: String(request.updated_at) };
  });

  const feed: CareFeedItem[] = [
    ...eventRows.map((event) => ({ id: String(event.id), tenantId: "", patientId: "", kind: "HUMAN" as const, title: String(event.event_type), detail: String(event.detail ?? ""), actor: String(event.actor_id ?? "Farz+ team"), timestamp: new Date(String(event.created_at)).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }) })),
    ...messages.map((message) => ({ id: `message-${message.id}`, tenantId: message.tenantId, patientId: message.patientId, kind: "MESSAGE" as const, title: "Message received", detail: message.text, actor: message.sender, timestamp: message.timestamp })),
  ].slice(0, 80);

  return {
    version: Date.now(),
    users: [{ id: profile.id, tenantId: "", name: profile.display_name, role: profile.role === "CLINICIAN" ? "DOCTOR" : profile.role, email: profile.email, location: profile.city ?? profile.country ?? "" }],
    patients,
    messages,
    medications: medicationRows.map((medication) => ({ id: String(medication.id), tenantId: "", patientId: String(medication.elder_id), name: String(medication.name), dosage: String(medication.dosage ?? "Recorded dosage"), time: String(medication.time ?? medication.schedule ?? "As recorded"), status: medication.status === "TAKEN" || medication.status === "MISSED" ? medication.status : "PENDING" })),
    cases,
    feed,
  };
}

export async function getCurrentElderId() {
  const { supabase } = await getAuthContext();
  const { data } = await supabase.from("elders").select("id").order("created_at", { ascending: false }).limit(1).maybeSingle();
  return (data as { id?: string } | null)?.id ?? null;
}
