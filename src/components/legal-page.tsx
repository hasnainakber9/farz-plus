import { DisclaimerBox, GlassCard, SectionHeading, Shell } from "@/components/ui";

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
  disclaimer,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { title: string; body: string }[];
  disclaimer?: boolean;
}) {
  return (
    <section className="py-20 sm:py-28">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow={eyebrow} title={title}>
            <p>{intro}</p>
          </SectionHeading>
          <div className="grid gap-5">
            {sections.map((section) => (
              <GlassCard key={section.title} className="p-6">
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#B8C0C8]">{section.body}</p>
              </GlassCard>
            ))}
            {disclaimer ? <DisclaimerBox /> : null}
          </div>
        </div>
      </Shell>
    </section>
  );
}
