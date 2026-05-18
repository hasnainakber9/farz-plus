import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { CheckRow, GlassCard, PrimaryButton, SectionHeading, Shell } from "@/components/ui";
import { plans } from "@/lib/content";

export const metadata: Metadata = {
  title: "Care Plans",
  description: "Farz Basic, Farz Plus, Farz Premium, and Farz Corporate parent-care plans.",
};

export default function CarePlansPage() {
  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 grid-texture opacity-40" />
        <Shell className="relative">
          <SectionHeading eyebrow="Care Plans" title="Choose the right Farz+ layer for your family.">
            <p>
              Pricing is intentionally placeholder during the Islamabad pilot until partner rates, care-manager workload, and emergency coordination costs are validated.
            </p>
          </SectionHeading>
        </Shell>
      </section>
      <section className="pb-20">
        <Shell>
          <div className="grid gap-5 lg:grid-cols-4">
            {plans.map((plan) => (
              <GlassCard key={plan.name} className={plan.badge ? "relative p-5 ring-1 ring-[#4CD364]/50" : "p-5"}>
                {plan.badge ? (
                  <span className="absolute right-5 top-5 rounded-full bg-[#4CD364] px-3 py-1 text-xs font-bold text-[#050410]">
                    {plan.badge}
                  </span>
                ) : null}
                <h2 className="pr-20 text-xl font-semibold text-white">{plan.name}</h2>
                <p className="mt-3 text-sm leading-6 text-[#B8C0C8]">{plan.audience}</p>
                <p className="mt-5 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-[#A0E7B4]">{plan.price}</p>
                <ul className="mt-5 space-y-3">
                  {plan.features.map((feature) => (
                    <CheckRow key={feature}>{feature}</CheckRow>
                  ))}
                </ul>
                <PrimaryButton href="/contact" className="mt-6 w-full">{plan.cta}</PrimaryButton>
              </GlassCard>
            ))}
          </div>
          <div className="mt-10 grid gap-8 rounded-[32px] border border-white/10 bg-white/[0.055] p-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-3xl font-semibold text-white">Need help choosing?</h2>
              <p className="mt-4 text-sm leading-7 text-[#B8C0C8]">
                A care advisor can map the parent profile, emergency readiness, family decision-makers, and first month support needs before recommending a plan.
              </p>
            </div>
            <LeadForm compact />
          </div>
        </Shell>
      </section>
    </>
  );
}
