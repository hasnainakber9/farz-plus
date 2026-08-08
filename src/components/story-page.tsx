import { AnimatedSection } from "@/components/animated-section";
import { LeadForm } from "@/components/lead-form";
import { CheckRow, PrimaryButton, SecondaryButton, SectionHeading, Shell } from "@/components/ui";

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
      <section className="relative overflow-hidden border-b border-[#DCE9E5] bg-white py-20 sm:py-28">
        <div className="absolute inset-0 grid-texture opacity-35" />
        <Shell className="relative">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#087B69]">{eyebrow}</p>
            <h1 className="mt-5 text-balance text-4xl font-semibold text-[#143A35] sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#536B66]">{intro}</p>
            {cta ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href="/contact">Book a Free Care Call</PrimaryButton>
                <SecondaryButton href="/care-plans">View Care Plans</SecondaryButton>
              </div>
            ) : null}
          </div>
        </Shell>
      </section>
      <AnimatedSection className="bg-[#F8FBF9] py-10 sm:py-16">
        <Shell>
          <SectionHeading eyebrow="What this includes" title="Built as a managed care layer, not a marketplace.">
            <p>
              Farz+ handles planning, coordination, proof, escalation, and family communication so relatives are not left to
              chase scattered providers.
            </p>
          </SectionHeading>
          <div className="mt-10 grid border-y border-[#D9E7E3] sm:grid-cols-2 lg:grid-cols-3">
            {bullets.map((item) => (
              <div key={item} className="border-b border-[#D9E7E3] p-5 sm:border-r lg:min-h-28">
                <ul>
                  <CheckRow>{item}</CheckRow>
                </ul>
              </div>
            ))}
          </div>
        </Shell>
      </AnimatedSection>
      {cta ? (
        <AnimatedSection className="border-y border-[#DCE9E5] bg-white py-12 sm:py-20">
          <Shell>
            <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#087B69]">Start safely</p>
                <h2 className="mt-4 text-3xl font-semibold text-[#143A35]">Begin with one parent profile and one care call.</h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-[#536B66]">
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
