export type UserRole = "FAMILY" | "ELDER" | "CARE_MANAGER" | "CLINICIAN" | "DOCTOR" | "ADMIN" | "PARTNER" | "EMPLOYER";
export type RiskLevel = "STABLE" | "ATTENTION" | "CRITICAL";
export type MessageStatus = "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "ESCALATED";
export type MedicationStatus = "TAKEN" | "MISSED" | "PENDING";
export type CaseStatus = "PENDING_APPROVAL" | "APPROVED" | "ESCALATED_TO_DOCTOR" | "DOCTOR_REVIEWED";

export interface User {
  id: string;
  tenantId: string;
  name: string;
  role: UserRole;
  email: string;
  location: string;
}

export interface VitalPoint {
  label: string;
  systolic: number;
  diastolic: number;
  glucose: number;
  heartRate: number;
}

export interface Patient {
  id: string;
  tenantId: string;
  name: string;
  age: number;
  city: string;
  riskLevel: RiskLevel;
  mood: string;
  activity: string;
  allergies: string[];
  conditions: string[];
  careManagerId: string;
  familyUserIds: string[];
  vitals: VitalPoint[];
}

export interface Message {
  id: string;
  tenantId: string;
  patientId: string;
  sender: string;
  senderRole: UserRole | "SYSTEM" | "CORTI";
  text: string;
  riskFlagged: boolean;
  riskReason?: string;
  status: MessageStatus;
  timestamp: string;
}

export interface Medication {
  id: string;
  tenantId: string;
  patientId: string;
  name: string;
  dosage: string;
  time: string;
  status: MedicationStatus;
}

export interface CareCase {
  id: string;
  tenantId: string;
  patientId: string;
  sourceMessageId: string;
  riskLevel: RiskLevel;
  riskReason: string;
  status: CaseStatus;
  assignedCareManagerId: string;
  assignedDoctorId?: string;
  contextSummary: string;
  draftedResponse: string;
  updatedAt: string;
}

export interface CareFeedItem {
  id: string;
  tenantId: string;
  patientId: string;
  kind: "MESSAGE" | "RISK" | "CORTI" | "HUMAN" | "MEDICATION" | "VITAL" | "EMERGENCY";
  title: string;
  detail: string;
  actor: string;
  timestamp: string;
}

export interface PlatformSnapshot {
  version: number;
  users: User[];
  patients: Patient[];
  messages: Message[];
  medications: Medication[];
  cases: CareCase[];
  feed: CareFeedItem[];
}

export interface PlatformEvent {
  type: "SNAPSHOT" | "MESSAGE_RECEIVED" | "CASE_UPDATED" | "MEDICATION_UPDATED" | "EMERGENCY_TRIGGERED";
  snapshot: PlatformSnapshot;
  occurredAt: string;
}

export interface HandoffLifecycleStage {
  id: "received" | "risk" | "context" | "human";
  title: string;
  detail: string;
  status: "complete" | "held";
}
