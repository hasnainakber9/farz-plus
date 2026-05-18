import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { GlassCard, SectionHeading, Shell, StatusPill } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a free Farz+ care call for your parent.",
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 grid-texture opacity-40" />
      <Shell className="relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading eyebrow="Contact" title="Book a Free Care Call.">
            <p>
              Share your parent&apos;s city, care context, and urgency. Farz+ will respond through the pilot lead flow and WhatsApp-ready contact path.
            </p>
          </SectionHeading>
          <div className="mt-8 grid gap-4">
            <GlassCard className="p-5">
              <StatusPill>Islamabad pilot</StatusPill>
              <p className="mt-4 text-sm leading-7 text-[#B8C0C8]">
                Rawalpindi is treated as operational adjacency for family needs, hospitals, and partner coordination.
              </p>
            </GlassCard>
            <GlassCard className="p-5">
              <StatusPill tone="info">Trust rule</StatusPill>
              <p className="mt-4 text-sm leading-7 text-[#B8C0C8]">
                Farz+ coordinates care. It does not replace doctors, hospitals, emergency services, ambulances, or family consent.
              </p>
            </GlassCard>
          </div>
        </div>
        <GlassCard className="p-5 sm:p-7">
          <LeadForm />
        </GlassCard>
      </Shell>
    </section>
  );
}
