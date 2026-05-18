import type { Metadata } from "next";
import { AdminDashboardPreview } from "@/components/dashboard-panels";
import { StoryPage } from "@/components/story-page";
import { Shell } from "@/components/ui";
import { secondaryPages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partner Network",
  description: "Verified partner network and operations scoring for Farz+.",
};

export default function PartnerNetworkPage() {
  return (
    <>
      <StoryPage {...secondaryPages.partners} cta={false} />
      <Shell className="pb-20">
        <AdminDashboardPreview />
      </Shell>
    </>
  );
}
