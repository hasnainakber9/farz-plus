import type {
  CareCase,
  CareFeedItem,
  Medication,
  Message,
  Patient,
  PlatformSnapshot,
  User,
} from "@/lib/platform-types";

export const platformUsers: User[] = [
  {
    id: "usr-family-amina",
    tenantId: "tenant-hassan",
    name: "Amina Hassan",
    role: "FAMILY",
    email: "family@farzplus.pk",
    location: "Dubai",
  },
  {
    id: "usr-manager-ayesha",
    tenantId: "tenant-hassan",
    name: "Ayesha Khan",
    role: "CARE_MANAGER",
    email: "care@farzplus.pk",
    location: "Lahore",
  },
  {
    id: "usr-doctor-imran",
    tenantId: "tenant-hassan",
    name: "Dr. Imran Saeed",
    role: "DOCTOR",
    email: "doctor@farzplus.pk",
    location: "Lahore",
  },
];

export const platformPatients: Patient[] = [
  {
    id: "patient-hussain",
    tenantId: "tenant-hassan",
    name: "Hussain Ali",
    age: 78,
    city: "Lahore",
    riskLevel: "ATTENTION",
    mood: "Calm",
    activity: "Morning walk completed",
    allergies: ["No known drug allergies"],
    conditions: ["Hypertension", "Type 2 diabetes"],
    careManagerId: "usr-manager-ayesha",
    familyUserIds: ["usr-family-amina"],
    vitals: [
      { label: "Mon", systolic: 132, diastolic: 82, glucose: 121, heartRate: 72 },
      { label: "Tue", systolic: 128, diastolic: 80, glucose: 118, heartRate: 70 },
      { label: "Wed", systolic: 136, diastolic: 84, glucose: 126, heartRate: 74 },
      { label: "Thu", systolic: 130, diastolic: 81, glucose: 120, heartRate: 71 },
      { label: "Fri", systolic: 134, diastolic: 83, glucose: 124, heartRate: 73 },
    ],
  },
  {
    id: "patient-zarina",
    tenantId: "tenant-hassan",
    name: "Zarina Begum",
    age: 72,
    city: "Islamabad",
    riskLevel: "STABLE",
    mood: "Positive",
    activity: "Physiotherapy completed",
    allergies: ["Penicillin"],
    conditions: ["Osteoarthritis"],
    careManagerId: "usr-manager-ayesha",
    familyUserIds: [],
    vitals: [
      { label: "Mon", systolic: 124, diastolic: 78, glucose: 104, heartRate: 68 },
      { label: "Tue", systolic: 122, diastolic: 77, glucose: 106, heartRate: 67 },
      { label: "Wed", systolic: 126, diastolic: 79, glucose: 102, heartRate: 69 },
      { label: "Thu", systolic: 123, diastolic: 78, glucose: 105, heartRate: 68 },
      { label: "Fri", systolic: 125, diastolic: 79, glucose: 103, heartRate: 67 },
    ],
  },
  {
    id: "patient-saeeda",
    tenantId: "tenant-hassan",
    name: "Saeeda Khan",
    age: 81,
    city: "Karachi",
    riskLevel: "CRITICAL",
    mood: "Anxious",
    activity: "Awaiting doctor review",
    allergies: ["Sulfa drugs"],
    conditions: ["Heart failure", "Hypertension"],
    careManagerId: "usr-manager-ayesha",
    familyUserIds: [],
    vitals: [
      { label: "Mon", systolic: 148, diastolic: 92, glucose: 134, heartRate: 86 },
      { label: "Tue", systolic: 152, diastolic: 94, glucose: 138, heartRate: 89 },
      { label: "Wed", systolic: 145, diastolic: 90, glucose: 132, heartRate: 84 },
      { label: "Thu", systolic: 158, diastolic: 96, glucose: 141, heartRate: 92 },
      { label: "Fri", systolic: 154, diastolic: 93, glucose: 137, heartRate: 88 },
    ],
  },
];

export const platformMedications: Medication[] = [
  {
    id: "med-lisinopril",
    tenantId: "tenant-hassan",
    patientId: "patient-hussain",
    name: "Lisinopril",
    dosage: "10 mg",
    time: "08:30 AM",
    status: "PENDING",
  },
  {
    id: "med-metformin",
    tenantId: "tenant-hassan",
    patientId: "patient-hussain",
    name: "Metformin",
    dosage: "500 mg",
    time: "01:00 PM",
    status: "TAKEN",
  },
  {
    id: "med-vitamin-d",
    tenantId: "tenant-hassan",
    patientId: "patient-hussain",
    name: "Vitamin D3",
    dosage: "5,000 IU",
    time: "06:00 PM",
    status: "PENDING",
  },
];

export const platformMessages: Message[] = [
  {
    id: "msg-initial-family",
    tenantId: "tenant-hassan",
    patientId: "patient-hussain",
    sender: "Amina Hassan",
    senderRole: "FAMILY",
    text: "Did Abbu take his blood pressure medicine twice?",
    riskFlagged: true,
    riskReason: "Possible duplicate medication dose",
    status: "PENDING_APPROVAL",
    timestamp: "09:18 AM",
  },
  {
    id: "msg-clinical-saeeda",
    tenantId: "tenant-hassan",
    patientId: "patient-saeeda",
    sender: "Ayesha Khan",
    senderRole: "CARE_MANAGER",
    text: "Three elevated BP readings and new breathlessness during the morning visit. Requesting clinical review.",
    riskFlagged: true,
    riskReason: "Elevated blood pressure trend with breathlessness",
    status: "ESCALATED",
    timestamp: "09:28 AM",
  },
];

export const platformCases: CareCase[] = [
  {
    id: "case-hhr-0487",
    tenantId: "tenant-hassan",
    patientId: "patient-hussain",
    sourceMessageId: "msg-initial-family",
    riskLevel: "CRITICAL",
    riskReason: "Possible duplicate dose of Lisinopril",
    status: "PENDING_APPROVAL",
    assignedCareManagerId: "usr-manager-ayesha",
    contextSummary:
      "Family reports a possible duplicate morning dose. Lisinopril 10 mg is active. No symptoms were reported. Automated clinical advice is blocked.",
    draftedResponse:
      "Thank you for letting us know. A Farz+ care manager is reviewing this now. Please contact the prescribing doctor or local urgent medical service for guidance, and tell us immediately if dizziness, fainting, or unusual weakness appears.",
    updatedAt: "09:22 AM",
  },
  {
    id: "case-saeeda-0214",
    tenantId: "tenant-hassan",
    patientId: "patient-saeeda",
    sourceMessageId: "msg-clinical-saeeda",
    riskLevel: "CRITICAL",
    riskReason: "Elevated blood pressure trend with breathlessness",
    status: "ESCALATED_TO_DOCTOR",
    assignedCareManagerId: "usr-manager-ayesha",
    assignedDoctorId: "usr-doctor-imran",
    contextSummary:
      "Three elevated BP readings and new breathlessness were documented during the morning visit. Emergency warning signs were reviewed with the family.",
    draftedResponse:
      "The care team has escalated this case to Dr. Imran. Please keep Saeeda seated, monitor symptoms, and use local emergency services if symptoms worsen.",
    updatedAt: "09:28 AM",
  },
];

export const platformFeed: CareFeedItem[] = [
  {
    id: "feed-checkin",
    tenantId: "tenant-hassan",
    patientId: "patient-hussain",
    kind: "VITAL",
    title: "Morning check-in completed",
    detail: "BP 134/83, mood calm, breakfast completed.",
    actor: "Ayesha Khan",
    timestamp: "08:10 AM",
  },
  {
    id: "feed-message",
    tenantId: "tenant-hassan",
    patientId: "patient-hussain",
    kind: "MESSAGE",
    title: "Family WhatsApp received",
    detail: "Did Abbu take his blood pressure medicine twice?",
    actor: "Amina Hassan",
    timestamp: "09:18 AM",
  },
  {
    id: "feed-risk",
    tenantId: "tenant-hassan",
    patientId: "patient-hussain",
    kind: "RISK",
    title: "Duplicate-dose risk detected",
    detail: "Automated medical advice stopped. Human review required.",
    actor: "Farz+ Safety Layer",
    timestamp: "09:19 AM",
  },
  {
    id: "feed-corti",
    tenantId: "tenant-hassan",
    patientId: "patient-hussain",
    kind: "CORTI",
    title: "Corti context assembled",
    detail: "Medication, allergy, care-plan, and emergency-contact context is attributable and ready.",
    actor: "Corti",
    timestamp: "09:21 AM",
  },
];

export function createInitialPlatformSnapshot(): PlatformSnapshot {
  return {
    version: 1,
    users: structuredClone(platformUsers),
    patients: structuredClone(platformPatients),
    messages: structuredClone(platformMessages),
    medications: structuredClone(platformMedications),
    cases: structuredClone(platformCases),
    feed: structuredClone(platformFeed),
  };
}
