import type { Metadata } from "next";
import { DoctorDashboard } from "@/components/doctor-dashboard";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Doctor Portal",
  description: "Clinical escalation inbox, patient summary, vitals, and observations.",
};

export default async function DoctorDashboardPage() {
  const { profile } = await requireRole("CLINICIAN");
  return <DoctorDashboard name={profile.display_name} />;
}
