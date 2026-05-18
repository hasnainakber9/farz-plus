import type { Metadata } from "next";
import { StoryPage } from "@/components/story-page";
import { secondaryPages } from "@/lib/content";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How Farz+ turns parent care into one managed family care system.",
};

export default function HowItWorksPage() {
  return <StoryPage {...secondaryPages.howItWorks} />;
}
