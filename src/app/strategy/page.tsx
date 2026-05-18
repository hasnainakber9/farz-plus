import type { Metadata } from "next";
import { GlassCard, SectionHeading, Shell, StatusPill } from "@/components/ui";

export const metadata: Metadata = {
  title: "Product Strategy",
  description: "Farz+ pitch-ready positioning and strategic wedge.",
};

const advantages = [
  "Pakistan-first localization",
  "Managed care, not marketplace",
  "Human care manager plus AI copilot",
  "Farz+ Care Score",
  "Emergency Response Protocol",
  "Proof-based Family Care Timeline",
  "Farz+ Saathi companionship",
  "Family dashboard",
  "Care-manager app",
  "Partner Network OS",
  "Corporate parent-care benefit",
  "Trust, privacy, and ethics",
];

const segments = [
  ["Overseas Pakistanis", "You may be abroad, but your parents are not alone."],
  ["Busy professionals in Pakistan", "When life gets busy, Farz+ keeps care consistent."],
  ["Senior citizens", "Stay independent at home, with support when you need it."],
  ["Corporate HR", "A benefit for the people your employees worry about most."],
];

export default function StrategyPage() {
  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 grid-texture opacity-40" />
        <Shell className="relative">
          <SectionHeading eyebrow="Pitch Strategy" title="Pakistan's AI-assisted parent-care operating system.">
            <p>
              Pakistan has doctors, labs, nurses, pharmacies, and hospitals, but families still struggle to coordinate care for aging parents.
              Farz+ connects fragmented services into one managed care layer.
            </p>
          </SectionHeading>
        </Shell>
      </section>
      <section className="pb-20">
        <Shell className="grid gap-10">
          <GlassCard className="p-6">
            <StatusPill>Positioning</StatusPill>
            <h2 className="mt-4 text-3xl font-semibold text-white">A managed care layer for Pakistani parents aging at home.</h2>
            <p className="mt-4 text-sm leading-7 text-[#B8C0C8]">
              Farz+ is not a nursing agency, doctor-booking app, caregiver marketplace, old-age home, telemedicine app, hospital, or charity.
              It is the coordination layer families need when trust, visibility, and accountability matter.
            </p>
          </GlassCard>
          <div className="grid gap-5 lg:grid-cols-4">
            {segments.map(([segment, message]) => (
              <GlassCard key={segment} className="p-5">
                <h2 className="text-lg font-semibold text-white">{segment}</h2>
                <p className="mt-3 text-sm leading-7 text-[#B8C0C8]">{message}</p>
              </GlassCard>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((advantage, index) => (
              <GlassCard key={advantage} className="p-5">
                <p className="font-mono text-sm text-[#A0E7B4]">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 text-lg font-semibold text-white">{advantage}</h2>
              </GlassCard>
            ))}
          </div>
        </Shell>
      </section>
    </>
  );
}
