import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  const parsed = z.object({ text: z.string().trim().min(3).max(500) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a care message between 3 and 500 characters." }, { status: 400 });
  const value = parsed.data.text.toLowerCase();
  const critical = /(chest pain|breathless|unconscious|fell|fall|bleeding|twice|double|extra dose|two doses)/.test(value);
  const attention = /(missed|forgot|dizzy|weak|fever|medicine|medication|dose)/.test(value);
  const riskLevel = critical ? "CRITICAL" : attention ? "ATTENTION" : "STABLE";
  const riskReason = critical ? "Urgent safety or medication concern" : attention ? "Medication or symptom follow-up required" : "Routine care question";
  const now = new Date().toISOString();
  return NextResponse.json({
    message: { id: `simulation-${Date.now()}`, patientId: "simulation-parent", sender: "Family member", senderRole: "FAMILY", text: parsed.data.text, riskFlagged: riskLevel !== "STABLE", riskReason, status: "PENDING_APPROVAL", timestamp: now },
    careCase: { id: `simulation-case-${Date.now()}`, patientId: "simulation-parent", sourceMessageId: "simulation-message", riskLevel, riskReason, status: "PENDING_APPROVAL", assignedCareManagerId: "simulation-care-manager", contextSummary: "This is an educational simulation. Production requests are stored only after a signed-in family member submits them.", draftedResponse: critical ? "This automated notice may indicate an urgent situation. Please contact local emergency services or the recorded emergency contact if anyone is in immediate danger. A human care manager would review the request next." : "Thank you for the update. A Farz+ care manager would review this request and confirm the next step.", updatedAt: now },
    lifecycle: [
      { id: "received", title: "Message received", detail: "Educational family-channel simulation", status: "complete" },
      { id: "risk", title: `Safety screen: ${riskReason}`, detail: "Automated advice is blocked", status: "complete" },
      { id: "context", title: "Context assembled", detail: "A human review packet would be prepared", status: "complete" },
      { id: "human", title: "Human decision", detail: "Approval or clinical escalation stays required", status: "held" },
    ],
  }, { status: 201 });
}
