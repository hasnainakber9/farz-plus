import { createInitialPlatformSnapshot } from "@/lib/platform-data";
import type {
  CareCase,
  HandoffLifecycleStage,
  MedicationStatus,
  Message,
  PlatformEvent,
  PlatformSnapshot,
} from "@/lib/platform-types";

type PlatformListener = (event: PlatformEvent) => void;

interface PlatformRuntime {
  snapshot: PlatformSnapshot;
  listeners: Set<PlatformListener>;
}

declare global {
  var __farzPlatformRuntime: PlatformRuntime | undefined;
}

function runtime(): PlatformRuntime {
  if (!globalThis.__farzPlatformRuntime) {
    globalThis.__farzPlatformRuntime = {
      snapshot: createInitialPlatformSnapshot(),
      listeners: new Set(),
    };
  }
  return globalThis.__farzPlatformRuntime;
}

function currentTime() {
  return new Intl.DateTimeFormat("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Karachi",
  }).format(new Date());
}

function commit(type: PlatformEvent["type"]) {
  const state = runtime();
  state.snapshot.version += 1;
  const event: PlatformEvent = {
    type,
    snapshot: structuredClone(state.snapshot),
    occurredAt: new Date().toISOString(),
  };
  state.listeners.forEach((listener) => listener(event));
  return event.snapshot;
}

export function getPlatformSnapshot() {
  return structuredClone(runtime().snapshot);
}

export function subscribeToPlatformEvents(listener: PlatformListener) {
  runtime().listeners.add(listener);
  return () => runtime().listeners.delete(listener);
}

function detectRisk(text: string) {
  const normalized = text.toLowerCase();
  if (/(twice|double|duplicate|extra dose|two doses)/.test(normalized)) {
    return {
      level: "CRITICAL" as const,
      reason: "Possible duplicate medication dose",
      context:
        "Duplicate-dose language was detected. Active medication records and known allergies were assembled. Automated clinical advice is blocked.",
    };
  }
  if (/(chest pain|breathless|unconscious|fell|fall|bleeding)/.test(normalized)) {
    return {
      level: "CRITICAL" as const,
      reason: "Possible urgent symptom or safety event",
      context:
        "Urgent symptom language was detected. The emergency plan and clinician contact are available. A named human must review immediately.",
    };
  }
  if (/(missed|forgot|dizzy|weak|fever|medicine|medication|dose)/.test(normalized)) {
    return {
      level: "ATTENTION" as const,
      reason: "Medication or symptom follow-up required",
      context:
        "A medication or symptom concern was detected. Current medications, recent vitals, and the care plan are ready for human review.",
    };
  }
  return {
    level: "STABLE" as const,
    reason: "Routine care question",
    context:
      "This appears to be a routine care question. Recent check-ins and the active care plan are ready for a care-manager response.",
  };
}

export function createIncomingMessage(text: string) {
  const state = runtime();
  const risk = detectRisk(text);
  const timestamp = currentTime();
  const suffix = `${Date.now()}`;
  const message: Message = {
    id: `msg-${suffix}`,
    tenantId: "tenant-hassan",
    patientId: "patient-hussain",
    sender: "Amina Hassan",
    senderRole: "FAMILY",
    text,
    riskFlagged: risk.level !== "STABLE",
    riskReason: risk.reason,
    status: "PENDING_APPROVAL",
    timestamp,
  };
  const careCase: CareCase = {
    id: `case-${suffix}`,
    tenantId: "tenant-hassan",
    patientId: "patient-hussain",
    sourceMessageId: message.id,
    riskLevel: risk.level,
    riskReason: risk.reason,
    status: "PENDING_APPROVAL",
    assignedCareManagerId: "usr-manager-ayesha",
    contextSummary: risk.context,
    draftedResponse:
      risk.level === "STABLE"
        ? "Thank you for the update. Ayesha has received this and will confirm the next step with you shortly."
        : "Thank you for letting us know. A Farz+ care manager is reviewing this now. Please use local emergency services if severe or rapidly worsening symptoms are present.",
    updatedAt: timestamp,
  };

  state.snapshot.messages.unshift(message);
  state.snapshot.cases.unshift(careCase);
  state.snapshot.feed.unshift(
    {
      id: `feed-message-${suffix}`,
      tenantId: "tenant-hassan",
      patientId: "patient-hussain",
      kind: "MESSAGE",
      title: "Family WhatsApp received",
      detail: text,
      actor: "Amina Hassan",
      timestamp,
    },
    {
      id: `feed-risk-${suffix}`,
      tenantId: "tenant-hassan",
      patientId: "patient-hussain",
      kind: "RISK",
      title: risk.reason,
      detail:
        risk.level === "STABLE"
          ? "Routed to the assigned care manager."
          : "Automated clinical advice stopped. Human review required.",
      actor: "Farz+ Safety Layer",
      timestamp,
    },
    {
      id: `feed-corti-${suffix}`,
      tenantId: "tenant-hassan",
      patientId: "patient-hussain",
      kind: "CORTI",
      title: "Corti context assembled",
      detail: risk.context,
      actor: "Corti",
      timestamp,
    },
  );

  const snapshot = commit("MESSAGE_RECEIVED");
  const lifecycle: HandoffLifecycleStage[] = [
    {
      id: "received",
      title: "Incoming message received",
      detail: "Verified family channel attached to Hussain Ali.",
      status: "complete",
    },
    {
      id: "risk",
      title: `Safety screen: ${risk.reason}`,
      detail: risk.level === "STABLE" ? "No urgent risk rule matched." : "Automated medical advice stopped.",
      status: "complete",
    },
    {
      id: "context",
      title: "Corti context assembled",
      detail: "Source-linked medications, vitals, allergies, and care plan are ready.",
      status: "complete",
    },
    {
      id: "human",
      title: "Held for Ayesha Khan",
      detail: "Only a named care manager can approve or escalate the response.",
      status: "held",
    },
  ];

  return { message, careCase, lifecycle, snapshot };
}

export function updateCase(
  caseId: string,
  input: { action: "APPROVE" | "ESCALATE" | "DOCTOR_REVIEW"; draftedResponse?: string; note?: string },
) {
  const state = runtime();
  const careCase = state.snapshot.cases.find((item) => item.id === caseId);
  if (!careCase) return null;

  const timestamp = currentTime();
  if (input.draftedResponse?.trim()) careCase.draftedResponse = input.draftedResponse.trim();

  if (input.action === "APPROVE") {
    careCase.status = "APPROVED";
    const message = state.snapshot.messages.find((item) => item.id === careCase.sourceMessageId);
    if (message) message.status = "APPROVED";
    state.snapshot.feed.unshift({
      id: `feed-approval-${Date.now()}`,
      tenantId: careCase.tenantId,
      patientId: careCase.patientId,
      kind: "HUMAN",
      title: "Human-reviewed response approved",
      detail: careCase.draftedResponse,
      actor: "Ayesha Khan",
      timestamp,
    });
  }

  if (input.action === "ESCALATE") {
    careCase.status = "ESCALATED_TO_DOCTOR";
    careCase.assignedDoctorId = "usr-doctor-imran";
    const message = state.snapshot.messages.find((item) => item.id === careCase.sourceMessageId);
    if (message) message.status = "ESCALATED";
    state.snapshot.feed.unshift({
      id: `feed-escalation-${Date.now()}`,
      tenantId: careCase.tenantId,
      patientId: careCase.patientId,
      kind: "HUMAN",
      title: "Escalated to Dr. Imran Saeed",
      detail: input.note?.trim() || "Clinical review requested by the assigned care manager.",
      actor: "Ayesha Khan",
      timestamp,
    });
  }

  if (input.action === "DOCTOR_REVIEW") {
    careCase.status = "DOCTOR_REVIEWED";
    state.snapshot.feed.unshift({
      id: `feed-doctor-${Date.now()}`,
      tenantId: careCase.tenantId,
      patientId: careCase.patientId,
      kind: "HUMAN",
      title: "Doctor observation recorded",
      detail: input.note?.trim() || "Clinical review completed. Care manager notified.",
      actor: "Dr. Imran Saeed",
      timestamp,
    });
  }

  careCase.updatedAt = timestamp;
  return { careCase: structuredClone(careCase), snapshot: commit("CASE_UPDATED") };
}

export function updateMedication(medicationId: string, status: MedicationStatus) {
  const state = runtime();
  const medication = state.snapshot.medications.find((item) => item.id === medicationId);
  if (!medication) return null;
  medication.status = status;
  state.snapshot.feed.unshift({
    id: `feed-medication-${Date.now()}`,
    tenantId: medication.tenantId,
    patientId: medication.patientId,
    kind: "MEDICATION",
    title: `${medication.name} marked ${status.toLowerCase()}`,
    detail: `${medication.dosage} scheduled for ${medication.time}.`,
    actor: status === "TAKEN" ? "Ayesha Khan" : "Farz+ Medication Record",
    timestamp: currentTime(),
  });
  return { medication: structuredClone(medication), snapshot: commit("MEDICATION_UPDATED") };
}

export function triggerEmergency() {
  const state = runtime();
  const timestamp = currentTime();
  const patient = state.snapshot.patients.find((item) => item.id === "patient-hussain");
  if (patient) patient.riskLevel = "CRITICAL";
  state.snapshot.feed.unshift({
    id: `feed-emergency-${Date.now()}`,
    tenantId: "tenant-hassan",
    patientId: "patient-hussain",
    kind: "EMERGENCY",
    title: "Urgent family escalation requested",
    detail: "Care manager, family decision-maker, and emergency plan notified. This demo does not contact emergency services.",
    actor: "Amina Hassan",
    timestamp,
  });
  return commit("EMERGENCY_TRIGGERED");
}
