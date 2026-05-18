import type { Metadata } from "next";
import { StoryPage } from "@/components/story-page";
import { secondaryPages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: "Farz+ care coordination services for Pakistani parents aging at home.",
};

export default function ServicesPage() {
  return <StoryPage {...secondaryPages.services} />;
}
