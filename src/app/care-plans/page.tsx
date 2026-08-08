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
      <section className="relative overflow-hidden border-b border-[#DCE9E5] bg-white py-20 sm:py-28">
        <div className="absolute inset-0 grid-texture opacity-30" />
        <Shell className="relative">
          <SectionHeading eyebrow="Care Plans" title="Trusted care plans for every family journey." align="center">
            <p>
              Intelligent monitoring, compassionate human support, and clear care coordination for families across
              Pakistan.
            </p>
          </SectionHeading>
        </Shell>
      </section>

      <section className="bg-[#F8FBF9] pb-20 pt-14">
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
                      ? "relative border-[#79BDAE] p-6 shadow-[0_18px_50px_rgba(20,58,53,0.1)] ring-1 ring-[#79BDAE] lg:-translate-y-4"
                      : "relative p-6"
                  }
                >
                  <div className={active ? "absolute inset-x-0 top-0 h-1 bg-[#08A98A]" : "absolute inset-x-0 top-0 h-px bg-[#DCE9E5]"} />
                  {plan.badge ? (
                    <span className="absolute right-4 top-4 rounded bg-[#E8F6F2] px-3 py-1 text-[10px] font-bold uppercase text-[#087B69]">
                      {plan.badge}
                    </span>
                  ) : null}
                  <Icon className={active ? "h-6 w-6 text-[#08A98A]" : "h-6 w-6 text-[#527F76]"} />
                  <h2 className={active ? "mt-5 pr-24 text-2xl font-semibold text-[#006E5B]" : "mt-5 pr-20 text-2xl font-semibold text-[#143A35]"}>
                    {plan.name}
                  </h2>
                  <p className="mt-3 min-h-14 text-sm leading-6 text-[#60756F]">{plan.audience}</p>
                  <p className="mt-5 text-3xl font-semibold text-[#143A35]">{plan.price}</p>
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
            <div className="mt-8 overflow-hidden rounded-md border border-[#D5E4E0] bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-[#F1F7F5] text-xs uppercase text-[#536B66]">
                    <tr>
                      {["Feature", "Basic", "Plus", "Premium"].map((heading) => (
                        <th key={heading} className={heading === "Plus" ? "bg-[#E8F6F2] px-5 py-4 text-[#087B69]" : "px-5 py-4"}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E0ECE8] text-[#536B66]">
                    {comparison.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, index) => (
                          <td key={`${row[0]}-${index}`} className={index === 2 ? "bg-[#F2FAF7] px-5 py-4 font-semibold text-[#274A43]" : "px-5 py-4"}>
                            {cell === "Yes" ? <Check className="h-5 w-5 text-[#08A98A]" /> : cell}
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
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-[#B7DED4] bg-[#EAF8F4]">
                  <Globe2 className="h-9 w-9 text-[#087B69]" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-[#143A35]">Built for Pakistani families</h2>
                <p className="mt-4 text-sm leading-7 text-[#60756F]">
                  Plans combine family visibility, consent-aware care coordination, and case-by-case confirmation of any physical service.
                </p>
              </div>
            </GlassCard>
            <div>
              <h2 className="mb-5 text-3xl font-semibold text-[#143A35]">Frequently Asked Questions</h2>
              <FaqAccordion items={faqs.slice(6, 10)} />
            </div>
          </div>

          <div className="mt-12 grid gap-10 border-t border-[#D5E4E0] bg-white p-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <StatusPill>Care advisor call</StatusPill>
              <h2 className="mt-5 text-3xl font-semibold text-[#143A35]">Need help choosing?</h2>
              <p className="mt-4 text-sm leading-7 text-[#60756F]">
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
