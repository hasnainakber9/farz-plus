import type { Metadata } from "next";
import { StoryPage } from "@/components/story-page";
import { secondaryPages } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Farz+ brand, mission, and Pakistan-first parent-care positioning.",
};

export default function AboutPage() {
  return <StoryPage {...secondaryPages.about} />;
}
