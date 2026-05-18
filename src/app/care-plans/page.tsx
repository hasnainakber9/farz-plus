import type { Metadata } from "next";
import { Building2, Check, Globe2, HeartHandshake, ShieldCheck, UsersRound } from "lucide-react";
import { FaqAccordion } from "@/components/faq-accordion";
import { LeadForm } from "@/components/lead-form";
import { CheckRow, GlassCard, PrimaryButton, SectionHeading, Shell, StatusPill } from "@/components/ui";
import { faqs, plans } from "@/lib/content";

export const metadata: Metadata = {
  title: "Care Plans",
  description: "Farz Basic, Farz Plus, Farz Premium, and Farz Corporate parent-care plans.",
};

const planIcons = [ShieldCheck, HeartHandshake, UsersRound, Building2];

const comparison = [
  ["Dedicated Care Manager", "-", "Yes", "Yes"],
  ["Check-in Frequency", "Weekly auto", "Bi-weekly call", "Weekly call"],
  ["Dynamic Care Score", "-", "Yes", "Yes"],
  ["Doctor / Lab Coordination", "-", "Yes", "Yes"],
  ["Emergency Response Protocol", "-", "Standard", "Priority routing"],
  ["Saathi Companionship Visits", "-", "-", "2x / month"],
];

export default function CarePlansPage() {
  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 grid-texture opacity-40" />
        <div className="absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-[#38D6B0]/10 blur-3xl" />
        <Shell className="relative">
          <SectionHeading eyebrow="Care Plans" title="Trusted care plans for every family journey." align="center">
            <p>
              Intelligent monitoring, compassionate human support, and clear care coordination for families across
              Pakistan.
            </p>
          </SectionHeading>
        </Shell>
      </section>

      <section className="pb-20">
        <Shell>
          <div className="grid gap-5 lg:grid-cols-4">
            {plans.map((plan, index) => {
              const Icon = planIcons[index];
              const active = plan.tier === "plus";
              return (
                <GlassCard
                  key={plan.name}
                  className={
                    active
                      ? "relative p-6 shadow-[0_0_42px_rgba(56,214,176,0.16)] ring-1 ring-[#38D6B0]/55 lg:-translate-y-4"
                      : "relative p-6"
                  }
                >
                  <div className={active ? "absolute inset-x-0 top-0 h-1 rounded-t-[24px] bg-gradient-to-r from-[#38D6B0] to-[#80C3DC]" : "absolute inset-x-0 top-0 h-1 rounded-t-[24px] bg-white/10"} />
                  {plan.badge ? (
                    <span className="absolute right-4 top-4 rounded-full bg-[#38D6B0] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#07111F]">
                      {plan.badge}
                    </span>
                  ) : null}
                  <Icon className={active ? "h-6 w-6 text-[#38D6B0]" : "h-6 w-6 text-[#80C3DC]"} />
                  <h2 className={active ? "mt-5 pr-24 text-2xl font-semibold text-[#38D6B0]" : "mt-5 pr-20 text-2xl font-semibold text-white"}>
                    {plan.name}
                  </h2>
                  <p className="mt-3 min-h-14 text-sm leading-6 text-[#B8C0C8]">{plan.audience}</p>
                  <p className="mt-5 text-3xl font-semibold tracking-tight text-white">{plan.price}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.slice(0, 6).map((feature) => (
                      <CheckRow key={feature}>{feature}</CheckRow>
                    ))}
                  </ul>
                  <PrimaryButton href="/contact" className="mt-7 w-full">{plan.cta}</PrimaryButton>
                </GlassCard>
              );
            })}
          </div>

          <div className="mt-14">
            <SectionHeading eyebrow="Compare plan features" title="Choose by responsibility level, not just feature count." align="center" />
            <div className="mt-8 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-white/[0.06] font-mono text-xs uppercase tracking-[0.18em] text-[#E6FAF3]">
                    <tr>
                      {["Feature", "Basic", "Plus", "Premium"].map((heading) => (
                        <th key={heading} className={heading === "Plus" ? "bg-[#38D6B0]/10 px-5 py-4" : "px-5 py-4"}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-[#D7DEE6]">
                    {comparison.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, index) => (
                          <td key={`${row[0]}-${index}`} className={index === 2 ? "bg-[#38D6B0]/[0.08] px-5 py-4 text-[#E6FAF3]" : "px-5 py-4"}>
                            {cell === "Yes" ? <Check className="h-5 w-5 text-[#38D6B0]" /> : cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[0.74fr_1.26fr]">
            <GlassCard className="grid min-h-80 place-items-center p-8 text-center">
              <div>
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-[#38D6B0]/25 bg-[#38D6B0]/10 shadow-[0_0_42px_rgba(56,214,176,0.18)]">
                  <Globe2 className="h-9 w-9 text-[#38D6B0]" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-white">Built for Pakistani families</h2>
                <p className="mt-4 text-sm leading-7 text-[#B8C0C8]">
                  Plans combine local healthcare logistics, cultural nuance, WhatsApp-first support, and overseas family visibility.
                </p>
              </div>
            </GlassCard>
            <div>
              <h2 className="mb-5 text-3xl font-semibold text-white">Frequently Asked Questions</h2>
              <FaqAccordion items={faqs.slice(6, 10)} />
            </div>
          </div>

          <div className="mt-12 grid gap-8 rounded-[28px] border border-white/10 bg-white/[0.055] p-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <StatusPill>Care advisor call</StatusPill>
              <h2 className="mt-5 text-3xl font-semibold text-white">Need help choosing?</h2>
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
