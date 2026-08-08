import type { UserRole } from "@/lib/platform-types";

export const demoAccounts = [
  {
    role: "FAMILY" as const,
    name: "Amina Hassan",
    email: "family@farzplus.pk",
    password: "FarzFamily123",
    route: "/dashboard/family",
    label: "Overseas family",
    description: "Parent status, WhatsApp feed, medication schedule, and escalation.",
  },
  {
    role: "CARE_MANAGER" as const,
    name: "Ayesha Khan",
    email: "care@farzplus.pk",
    password: "FarzCare123",
    route: "/dashboard/care-manager",
    label: "Care manager",
    description: "Patient queue, risk triage, MAR, and human approval workspace.",
  },
  {
    role: "DOCTOR" as const,
    name: "Dr. Imran Saeed",
    email: "doctor@farzplus.pk",
    password: "FarzDoctor123",
    route: "/dashboard/doctor",
    label: "Doctor / clinic",
    description: "Escalation inbox, clinical context, vitals, and observations.",
  },
] as const;

export interface DemoSession {
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
}

export function encodeDemoSession(session: DemoSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeDemoSession(value?: string): DemoSession | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as DemoSession;
    if (!["FAMILY", "CARE_MANAGER", "DOCTOR"].includes(parsed.role)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function routeForRole(role: UserRole) {
  return demoAccounts.find((account) => account.role === role)?.route ?? "/login";
}
