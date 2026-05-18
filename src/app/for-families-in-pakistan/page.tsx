import type { Metadata } from "next";
import { StoryPage } from "@/components/story-page";
import { secondaryPages } from "@/lib/content";

export const metadata: Metadata = {
  title: "For Families in Pakistan",
  description: "Care coordination support for busy families and out-of-city siblings in Pakistan.",
};

export default function LocalFamiliesPage() {
  return <StoryPage {...secondaryPages.localFamilies} />;
}
