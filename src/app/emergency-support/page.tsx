import type { Metadata } from "next";
import { EmergencyButton } from "@/components/emergency-button";
import { StoryPage } from "@/components/story-page";
import { DisclaimerBox, Shell } from "@/components/ui";
import { secondaryPages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Emergency Support",
  description: "Farz+ emergency readiness and family call-tree coordination.",
};

export default function EmergencySupportPage() {
  return (
    <>
      <StoryPage {...secondaryPages.emergency} cta={false} />
      <Shell className="pb-20">
        <div className="grid gap-5 rounded-[32px] border border-white/10 bg-white/[0.055] p-6 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <h2 className="text-3xl font-semibold text-white">Emergency confirmation flow</h2>
            <p className="mt-4 text-sm leading-7 text-[#B8C0C8]">
              The SOS button uses confirmation to reduce accidental triggers. The protocol coordinates approved family and partner support,
              while immediate medical danger still belongs with local emergency services.
            </p>
            <div className="mt-6">
              <EmergencyButton />
            </div>
          </div>
          <DisclaimerBox />
        </div>
      </Shell>
    </>
  );
}
