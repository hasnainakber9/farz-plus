export type UserRole =
  | "FAMILY"
  | "ELDER"
  | "CARE_MANAGER"
  | "CLINICIAN"
  | "ADMIN"
  | "PARTNER"
  | "EMPLOYER";

export type RiskStatus = "ROUTINE" | "ATTENTION" | "URGENT_REVIEW";
export type MedicationAdherenceStatus = "COMPLETED" | "PENDING" | "MISSED" | "NOT_RECORDED";
export type Visibility = "FAMILY_VISIBLE" | "INTERNAL" | "CLINICIAN";
export type ReviewState = "NO_REVIEW_REQUIRED" | "PENDING_HUMAN_REVIEW" | "APPROVED" | "EDITED" | "ESCALATED";
export type OperationalPriority = "ROUTINE" | "STANDARD" | "HIGH" | "URGENT";
export type CaseStatus = "OPEN" | "IN_PROGRESS" | "AWAITING_FAMILY" | "AWAITING_PROVIDER" | "ESCALATED" | "RESOLVED";
export type RequestStatus = "OPEN" | "COORDINATING" | "ESCALATED" | "COMPLETED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  organizationId?: string;
  createdAt: string;
}

export interface Household {
  id: string;
  name: string;
  city: string;
  createdAt: string;
}

export interface HouseholdMember {
  id: string;
  householdId: string;
  userId?: string;
  name: string;
  relation: string;
  role: UserRole;
  consentScope: string;
}

export interface ElderProfile {
  id: string;
  householdId: string;
  name: string;
  dateOfBirth?: string;
  age?: number;
  city: string;
  preferredLanguage: string;
  riskStatus: RiskStatus;
  accessibilityPreferences?: string[];
  emergencyContacts?: EmergencyContact[];
  allergies?: Allergy[];
  knownConditions?: Condition[];
  activeMedications?: Medication[];
  assignedCareManager?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  elderId: string;
  name: string;
  relationship: string;
  phone: string;
  preferredChannel: "CALL" | "WHATSAPP" | "SMS" | "EMAIL";
}

export interface Allergy {
  id: string;
  elderId: string;
  name: string;
  severity?: string;
  source?: string;
}

export interface Condition {
  id: string;
  elderId: string;
  name: string;
  status?: string;
  source?: string;
}

export interface Medication {
  id: string;
  elderId: string;
  name: string;
  dosageAsRecorded: string;
  scheduleAsRecorded: string;
  prescribingClinicianName?: string;
  active: boolean;
  adherenceEvents?: MedicationEvent[];
}

export interface MedicationEvent {
  id: string;
  medicationId: string;
  elderId: string;
  eventType: "REPORTED_TAKEN" | "PENDING_CONFIRMATION" | "MISSED" | "NOT_RECORDED";
  reportedAt?: string;
  source: "FAMILY" | "CARE_MANAGER" | "PARENT" | "CLINICIAN" | "PARTNER";
}

export interface CareManagerAssignment {
  id: string;
  elderId: string;
  careManagerId: string;
  householdId: string;
  assignedAt: string;
  status: "ACTIVE" | "HOLD" | "REASSIGNED";
}

export interface Appointment {
  id: string;
  elderId: string;
  householdId: string;
  title: string;
  appointmentType: string;
  providerName?: string;
  providerLocation?: string;
  appointmentDate: string;
  status: "REQUESTED" | "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NEEDS_FOLLOW_UP";
}

export interface Task {
  id: string;
  caseId?: string;
  title: string;
  ownerId?: string;
  dueDate?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED";
  notes?: string;
}

export interface CheckIn {
  id: string;
  elderId: string;
  scheduledAt?: string;
  completedAt?: string;
  contactedBy?: string;
  wellbeingAsReported?: string;
  mealsHydration?: string;
  mobilityObservation?: string;
  medicationAdherence?: string;
  followUpRequired: boolean;
  notes?: string;
}

export interface CaseCareRequest {
  id: string;
  elderId: string;
  householdId: string;
  createdBy: string;
  category: string;
  description: string;
  operationalPriority: OperationalPriority;
  status: CaseStatus;
  assignedCareManager?: string;
  escalationStatus: "NONE" | "PENDING" | "REVIEWING" | "RESOLVED";
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  text: string;
  visibility: Visibility;
  riskFlag: boolean;
  riskReason?: string;
  reviewState: ReviewState;
  timestamp: string;
}

export interface Escalation {
  id: string;
  caseId: string;
  elderId: string;
  clinicianId?: string;
  reason: string;
  status: "OPEN" | "IN_REVIEW" | "COMPLETED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalReview {
  id: string;
  escalationId: string;
  clinicianId: string;
  notes: string;
  recommendedAction?: string;
  status: "PENDING" | "COMPLETED" | "RETURNED_FOR_INFO";
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRecord {
  id: string;
  elderId: string;
  caseId?: string;
  uploaderId: string;
  url: string;
  documentType: string;
  uploadedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  unread: boolean;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorRole: UserRole;
  action: string;
  entity: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ConsentRecord {
  id: string;
  elderId: string;
  householdId: string;
  grantedBy: string;
  scope: string;
  active: boolean;
  capturedAt: string;
}

export interface Partner {
  id: string;
  name: string;
  organizationType: "HOSPITAL" | "LAB" | "PHARMACY" | "PHYSIOTHERAPY" | "HOME_CARE" | "AMBULANCE" | "TRANSPORT";
  city: string;
  status: "ACTIVE" | "PROBATION" | "PAUSED";
}

export interface Subscription {
  id: string;
  householdId: string;
  tier: "BASIC" | "PLUS" | "PREMIUM" | "EMPLOYER";
  status: "REQUESTED" | "PENDING_ACTIVATION" | "ACTIVE" | "PAUSED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  familyLocation: string;
  parentCity: string;
  urgency: "planning" | "this_week" | "urgent";
  needs: string;
  consent: boolean;
  status: "new" | "contacted" | "consultation_booked" | "qualified" | "converted" | "closed";
  createdAt: string;
}

export interface PartnerReferral {
  id: string;
  partnerId: string;
  elderId: string;
  caseId?: string;
  serviceType: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CLOSED";
}

export interface ServiceRequestRecord {
  id: string;
  elderId: string;
  householdId: string;
  providerId?: string;
  createdBy: string;
  title: string;
  category: string;
  status: RequestStatus;
}

export interface Conversation {
  id: string;
  caseId?: string;
  householdId?: string;
}
