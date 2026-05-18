import type { Metadata } from "next";
import { StoryPage } from "@/components/story-page";
import { secondaryPages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Farz+ Saathi",
  description: "Supervised companionship and practical support for elders aging at home.",
};

export default function SaathiPage() {
  return <StoryPage {...secondaryPages.saathi} />;
}
