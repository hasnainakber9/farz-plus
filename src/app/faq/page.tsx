import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq-accordion";
import { SectionHeading, Shell } from "@/components/ui";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Farz+ parent care.",
};

export default function FaqPage() {
  return (
    <section className="py-20 sm:py-28">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeading eyebrow="FAQ" title="Questions families ask before trusting a care system." />
          <FaqAccordion items={faqs} />
        </div>
      </Shell>
    </section>
  );
}
