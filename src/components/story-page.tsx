import { AnimatedSection } from "@/components/animated-section";
import { LeadForm } from "@/components/lead-form";
import { CheckRow, GlassCard, PrimaryButton, SecondaryButton, SectionHeading, Shell } from "@/components/ui";

export function StoryPage({
  eyebrow,
  title,
  intro,
  bullets,
  cta = true,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  bullets: string[];
  cta?: boolean;
}) {
  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 grid-texture opacity-40" />
        <Shell className="relative">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#E6FAF3]">{eyebrow}</p>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#B8C0C8]">{intro}</p>
            {cta ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href="/contact">Book a Free Care Call</PrimaryButton>
                <SecondaryButton href="/care-plans">View Care Plans</SecondaryButton>
              </div>
            ) : null}
          </div>
        </Shell>
      </section>
      <AnimatedSection className="py-10 sm:py-16">
        <Shell>
          <SectionHeading eyebrow="What this includes" title="Built as a managed care layer, not a marketplace.">
            <p>
              Farz+ handles planning, coordination, proof, escalation, and family communication so relatives are not left to
              chase scattered providers.
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bullets.map((item) => (
              <GlassCard key={item} className="p-5">
                <ul>
                  <CheckRow>{item}</CheckRow>
                </ul>
              </GlassCard>
            ))}
          </div>
        </Shell>
      </AnimatedSection>
      {cta ? (
        <AnimatedSection className="py-12 sm:py-20">
          <Shell>
            <div className="grid gap-8 rounded-[32px] border border-white/10 bg-white/[0.055] p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#E6FAF3]">Start safely</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">Begin with one parent profile and one care call.</h2>
                <p className="mt-4 text-sm leading-7 text-[#B8C0C8]">
                  Farz+ captures family context, parent city, urgency, and consent before any care plan is proposed.
                </p>
              </div>
              <LeadForm compact />
            </div>
          </Shell>
        </AnimatedSection>
      ) : null}
    </>
  );
}
