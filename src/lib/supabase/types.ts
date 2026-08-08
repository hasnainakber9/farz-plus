export type AppRole = "FAMILY" | "ELDER" | "CARE_MANAGER" | "CLINICIAN" | "ADMIN" | "PARTNER" | "EMPLOYER";
export type RiskLevel = "STABLE" | "ATTENTION" | "CRITICAL";
export type CareRequestStatus = "NEW" | "ACKNOWLEDGED" | "IN_PROGRESS" | "WAITING_ON_FAMILY" | "WAITING_ON_PROVIDER" | "ESCALATED" | "RESOLVED" | "CLOSED";

export interface ProfileRecord {
  id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  role: AppRole;
  onboarding_completed: boolean;
  active: boolean;
}

export interface ElderRecord {
  id: string;
  household_id: string;
  name: string;
  approximate_age: number | null;
  city: string | null;
  preferred_language: string | null;
  risk_level: RiskLevel;
  consent_state: string;
}

export interface MedicationRecord {
  id: string;
  elder_id: string;
  name: string;
  dosage: string | null;
  schedule: string | null;
  time: string | null;
  status: string;
}
