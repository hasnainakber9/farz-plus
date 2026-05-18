import type { Metadata } from "next";
import { StoryPage } from "@/components/story-page";
import { secondaryPages } from "@/lib/content";

export const metadata: Metadata = {
  title: "For Overseas Pakistanis",
  description: "Parent-care coordination for overseas Pakistanis with elders in Pakistan.",
};

export default function OverseasPage() {
  return <StoryPage {...secondaryPages.overseas} />;
}
