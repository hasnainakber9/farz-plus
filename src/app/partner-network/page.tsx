import type { Metadata } from "next";
import { StoryPage } from "@/components/story-page";
import { secondaryPages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partner Network",
  description: "Case-by-case external service coordination for Farz+ families.",
};

export default function PartnerNetworkPage() {
  return (
    <>
      <StoryPage {...secondaryPages.partners} cta={false} />
      <section className="border-t border-[#DCE9E5] bg-[#F8FBF9] py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#087B69]">Availability boundary</p>
          <h2 className="mt-4 text-3xl font-semibold text-[#143A35]">Digital access is nationwide. Physical coordination is confirmed case by case.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#60756F]">
            Farz+ does not publish an invented provider directory or promise dispatch. When a family requests an external service, the care team confirms the responsible provider, availability, scope, and next step before proceeding.
          </p>
        </div>
      </section>
    </>
  );
}
