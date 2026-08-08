import type { Metadata } from "next";
import { FamilyDashboard } from "@/components/family-dashboard";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Family Dashboard",
  description: "Live parent-care status, medication, and family updates.",
};

export default async function FamilyDashboardPage() {
  const { profile } = await requireRole("FAMILY");
  return <FamilyDashboard name={profile.display_name} />;
}
