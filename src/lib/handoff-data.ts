export type HandoffEventCategory = "family" | "system" | "corti" | "human" | "notes";

export interface HandoffEvent {
  id: string;
  time: string;
  category: HandoffEventCategory;
  actor: string;
  title: string;
  detail: string;
  meta?: string[];
  tone: "family" | "risk" | "safe" | "corti" | "human";
}

export const handoffCase = {
  id: "HHR-2026-07-29-0487",
  receivedAt: "29 Jul 2026, 09:18 AM",
  status: "In review",
  risk: "High risk",
  sla: "45m remaining",
  dueAt: "Due by 10:05 AM",
  familyMessage: "My father accidentally took his medicine twice.",
  familyMember: {
    name: "Amina Hassan",
    relation: "Daughter",
    channel: "WhatsApp",
    image: "/avatars/amina-hassan.png",
  },
  parent: {
    name: "Hussain Ali",
    age: 78,
    city: "Lahore",
    medications: ["Lisinopril 10mg - once daily", "Vitamin D3 5000 IU - daily"],
    allergies: ["No known drug allergies"],
    carePlan: ["Hypertension", "Type 2 diabetes"],
    emergencyContact: "Amina Hassan - +92 300 1234567",
  },
  careManager: {
    name: "Ayesha Khan",
    role: "Care Manager",
    image: "/avatars/ayesha-khan.jpg",
  },
  supervisor: {
    name: "Nadia Raza",
    role: "Supervisor",
    image: "/avatars/nadia-raza.jpg",
  },
  medicalAdvisor: {
    name: "Dr. Imran Saeed",
    role: "Medical Advisor",
    image: "/avatars/dr-imran-saeed.png",
  },
  proposedResponse:
    "Thank you for letting us know. Please contact the prescribing doctor or local urgent medical service now for guidance. Monitor for dizziness, lightheadedness, or unusual tiredness. We will follow up shortly.",
  interimResponse:
    "We've received your message. A Farz+ care manager is reviewing it now and will respond shortly.",
} as const;

export const initialHandoffEvents: HandoffEvent[] = [
  {
    id: "evt-family-message",
    time: "09:18 AM",
    category: "family",
    actor: "Amina (Daughter)",
    title: handoffCase.familyMessage,
    detail: "Received through the verified family WhatsApp channel.",
    meta: ["Family via WhatsApp"],
    tone: "family",
  },
  {
    id: "evt-risk-detected",
    time: "09:19 AM",
    category: "system",
    actor: "System",
    title: "Medication risk detected",
    detail: "Possible duplicate dose of Lisinopril detected. Automated medical advice was stopped.",
    meta: ["Risk rule: MED_DUP_DOSE", "Severity: High"],
    tone: "risk",
  },
  {
    id: "evt-interim-response",
    time: "09:20 AM",
    category: "system",
    actor: "System",
    title: "Safe interim reply sent",
    detail: handoffCase.interimResponse,
    meta: ["Delivered via WhatsApp"],
    tone: "safe",
  },
  {
    id: "evt-corti-context",
    time: "09:21 AM",
    category: "corti",
    actor: "Corti",
    title: "Corti context assembled",
    detail: "Medication, allergy, care-plan, and emergency-contact context is ready for human review.",
    meta: ["Source-grounded context", "Human review required"],
    tone: "corti",
  },
  {
    id: "evt-corti-summary",
    time: "09:21 AM",
    category: "corti",
    actor: "Corti",
    title: "Structured encounter summary ready",
    detail:
      "Family reported a possible duplicate morning medication dose. No symptoms were reported in the incoming message.",
    meta: ["Sources verified", "No diagnosis generated"],
    tone: "corti",
  },
  {
    id: "evt-human-route",
    time: "09:22 AM",
    category: "system",
    actor: "System",
    title: "Routed to human",
    detail: "Automated response remained blocked and the case was assigned to Ayesha Khan.",
    meta: ["Policy: no clinical advice", "Reason: medication safety risk"],
    tone: "human",
  },
  {
    id: "evt-care-note",
    time: "09:24 AM",
    category: "human",
    actor: "Ayesha Khan",
    title: "Care-manager review started",
    detail: "Checking the recorded medication list, family contact, and escalation protocol.",
    meta: ["Internal note"],
    tone: "human",
  },
];

export const decisionLayers = [
  {
    name: "Risk rule",
    detail: "Medication name plus duplicate-dose language matched MED_DUP_DOSE.",
  },
  {
    name: "Classifier",
    detail: "The message was classified as medication safety with high confidence.",
  },
  {
    name: "Source check",
    detail: "The medication and family-contact records were available and attributable.",
  },
  {
    name: "Policy judge",
    detail: "The policy boundary blocked diagnosis, dosing changes, and prescribing advice.",
  },
  {
    name: "Action validator",
    detail: "A consequential reply could not be sent without assigned human approval.",
  },
  {
    name: "Human approval",
    detail: "The reviewed response is awaiting a care-manager decision.",
  },
] as const;

export const initialAuditTrail = [
  { time: "09:18 AM", event: "Family message received via WhatsApp", actor: "Amina" },
  { time: "09:19 AM", event: "Medication risk detected (MED_DUP_DOSE)", actor: "System" },
  { time: "09:20 AM", event: "Safe interim reply delivered", actor: "System" },
] as const;
