import type { Metadata } from "next";
import { CareManagerDashboard } from "@/components/care-manager-dashboard";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Care Manager Dashboard",
  description: "Human handoff, patient queue, risk triage, and medication administration workspace.",
};

export default async function CareManagerDashboardPage() {
  const { profile } = await requireRole("CARE_MANAGER");
  return <CareManagerDashboard name={profile.display_name} />;
}
