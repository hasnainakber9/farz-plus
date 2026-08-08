import type { Metadata } from "next";
import { CheckRow, GlassCard, SectionHeading, Shell, StatusPill } from "@/components/ui";
import { metrics, operationsCards, sops } from "@/lib/content";

export const metadata: Metadata = {
  title: "Operations System",
  description: "Farz+ SOPs and operating metrics.",
};

export default function OperationsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[#DCE9E5] bg-white py-20 sm:py-28">
        <div className="absolute inset-0 grid-texture opacity-30" />
        <Shell className="relative">
          <SectionHeading eyebrow="Operations System" title="The operating discipline behind the Farz+ trust promise.">
            <p>
              Farz+ wins by turning scattered elder care into one accountable system: SOPs, proof logs, partner scoring, escalation, and monthly reporting.
            </p>
          </SectionHeading>
        </Shell>
      </section>
      <section className="bg-[#F8FBF9] pb-20 pt-14">
        <Shell className="grid gap-10">
          <div className="grid gap-5 lg:grid-cols-3">
            {operationsCards.map((phase) => (
              <GlassCard key={phase.phase} className="p-6">
                <StatusPill>{phase.phase}</StatusPill>
                <h2 className="mt-4 text-xl font-semibold text-[#143A35]">{phase.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#60756F]">{phase.detail}</p>
              </GlassCard>
            ))}
          </div>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold text-[#143A35]">Required SOPs</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {sops.map((sop) => (
                  <CheckRow key={sop}>{sop}</CheckRow>
                ))}
              </ul>
            </GlassCard>
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold text-[#143A35]">Metrics to track</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {metrics.map((metric) => (
                  <div key={metric} className="rounded-md border border-[#D5E4E0] bg-[#F8FBF9] px-4 py-3 text-sm font-semibold text-[#536B66]">
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
