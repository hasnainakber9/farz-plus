export type ConsentRole =
  | "primary_decision_maker"
  | "secondary_contact"
  | "viewer"
  | "billing"
  | "care_manager"
  | "supervisor";

export type CareScoreLabel = "Stable" | "Watch" | "Needs Attention" | "High Risk";

export type CarePlanTier = "basic" | "plus" | "premium" | "corporate";

export type TimelineEventType =
  | "check_in"
  | "medicine"
  | "appointment"
  | "lab"
  | "emergency"
  | "invoice"
  | "report"
  | "family_update";

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  location: string;
  phone: string;
  role: ConsentRole;
  notificationPreference: "whatsapp" | "call" | "email";
}

export interface CareManager {
  id: string;
  name: string;
  city: string;
  languages: string[];
  caseload: number;
  supervisor: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  adherence: "completed" | "pending" | "missed";
}

export interface Appointment {
  id: string;
  provider: string;
  type: string;
  date: string;
  status: "scheduled" | "completed" | "needs_followup";
}

export interface EmergencyPlan {
  preferredHospital: string;
  nearestHospital: string;
  ambulanceProvider: string;
  primaryDecisionMaker: string;
  secondaryContact: string;
  doctorContact: string;
  allergies: string[];
  chronicConditions: string[];
  bloodGroup: string;
  homeAccessInstructions: string;
  neighborBackup: string;
  status: "active" | "needs_review";
}

export interface CareScore {
  value: number;
  label: CareScoreLabel;
  inputs: string[];
}

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  detail: string;
  proof: string;
  time: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  category: string;
  status: "open" | "coordinating" | "completed" | "escalated";
  sla: string;
}

export interface ElderProfile {
  id: string;
  name: string;
  city: string;
  age: number;
  status: CareScoreLabel;
  careScore: CareScore;
  careManager: CareManager;
  familyMembers: FamilyMember[];
  medications: Medication[];
  appointments: Appointment[];
  emergencyPlan: EmergencyPlan;
  timeline: TimelineEvent[];
  serviceRequests: ServiceRequest[];
}

export interface PartnerScore {
  responseTime: number;
  quality: number;
  complaintRate: number;
  pricingTransparency: number;
  documentationQuality: number;
  familyRating: number;
  careManagerRating: number;
  onTimeCompletion: number;
  emergencyReliability: number;
}

export interface Partner {
  id: string;
  name: string;
  category: string;
  city: string;
  score: PartnerScore;
  status: "verified" | "probation" | "paused";
}

export interface Complaint {
  id: string;
  elderId: string;
  title: string;
  status: "open" | "investigating" | "resolved";
  priority: "low" | "medium" | "high";
}

export interface Invoice {
  id: string;
  elderId: string;
  vendor: string;
  amount: string;
  status: "pending" | "paid" | "disputed";
}

export interface CorporateAccount {
  id: string;
  company: string;
  employeesCovered: number;
  activeParents: number;
  plan: "pilot" | "standard" | "enterprise";
}

export interface MonthlyReport {
  id: string;
  elderId: string;
  month: string;
  careScoreTrend: number[];
  notes: string[];
}
