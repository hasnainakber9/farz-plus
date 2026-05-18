import type { Metadata } from "next";
import { CheckRow, GlassCard, SectionHeading, Shell, StatusPill } from "@/components/ui";
import { launchPlan, metrics, sops } from "@/lib/content";

export const metadata: Metadata = {
  title: "Operations System",
  description: "Farz+ SOPs, launch plan, and operating metrics.",
};

export default function OperationsPage() {
  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 grid-texture opacity-40" />
        <Shell className="relative">
          <SectionHeading eyebrow="Operations System" title="The operating discipline behind the Farz+ trust promise.">
            <p>
              Farz+ wins by turning scattered elder care into one accountable system: SOPs, proof logs, partner scoring, escalation, and monthly reporting.
            </p>
          </SectionHeading>
        </Shell>
      </section>
      <section className="pb-20">
        <Shell className="grid gap-10">
          <div className="grid gap-5 lg:grid-cols-3">
            {launchPlan.map((phase) => (
              <GlassCard key={phase.phase} className="p-6">
                <StatusPill>{phase.phase}</StatusPill>
                <h2 className="mt-4 text-xl font-semibold text-white">{phase.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#B8C0C8]">{phase.detail}</p>
              </GlassCard>
            ))}
          </div>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold text-white">Required SOPs</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {sops.map((sop) => (
                  <CheckRow key={sop}>{sop}</CheckRow>
                ))}
              </ul>
            </GlassCard>
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold text-white">Metrics to track</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {metrics.map((metric) => (
                  <div key={metric} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#D7DEE6]">
                    {metric}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </Shell>
      </section>
    </>
  );
}
