import type { Metadata } from "next";
import {
  AdminDashboardPreview,
  CareManagerDashboardPreview,
  ElderMobilePreview,
  FamilyDashboardPreview,
  MonthlyReportCard,
} from "@/components/dashboard-panels";
import { EmergencyButton } from "@/components/emergency-button";
import { GlassCard, SectionHeading, Shell, StatusPill } from "@/components/ui";

export const metadata: Metadata = {
  title: "MVP Dashboard",
  description: "Farz+ family, care-manager, elder, and admin dashboard MVP.",
};

export default function DashboardPage() {
  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 grid-texture opacity-40" />
        <Shell className="relative">
          <SectionHeading eyebrow="MVP Dashboard" title="Family visibility, care-manager execution, and admin control in one operating system.">
            <p>
              These demo views use mock data shaped like the future Supabase schema, so the MVP can start manually and become automated without redesigning the product.
            </p>
          </SectionHeading>
        </Shell>
      </section>
      <section className="pb-20">
        <Shell className="grid gap-12">
          <GlassCard className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <StatusPill>Family app</StatusPill>
                <h2 className="mt-4 text-2xl font-semibold text-white">Parent dashboard and proof timeline</h2>
              </div>
              <EmergencyButton />
            </div>
            <div className="mt-6">
              <FamilyDashboardPreview />
            </div>
          </GlassCard>
          <div>
            <div className="mb-6 flex items-center gap-3">
              <StatusPill tone="info">Care manager app</StatusPill>
              <h2 className="text-2xl font-semibold text-white">Daily tasks, scripts, risk flags, and supervisor review</h2>
            </div>
            <CareManagerDashboardPreview />
          </div>
          <div>
            <div className="mb-6 flex items-center gap-3">
              <StatusPill tone="info">Admin OS</StatusPill>
              <h2 className="text-2xl font-semibold text-white">Operations, partners, city performance, and corporate accounts</h2>
            </div>
            <AdminDashboardPreview />
          </div>
          <div className="grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <ElderMobilePreview />
            <MonthlyReportCard />
          </div>
        </Shell>
      </section>
    </>
  );
}
