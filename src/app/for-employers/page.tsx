import type { Metadata } from "next";
import { StoryPage } from "@/components/story-page";
import { secondaryPages } from "@/lib/content";

export const metadata: Metadata = {
  title: "For Employers",
  description: "Farz+ Parent Care Benefit for employers and HR teams.",
};

export default function EmployersPage() {
  return <StoryPage {...secondaryPages.employers} />;
}
