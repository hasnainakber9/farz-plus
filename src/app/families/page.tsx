import type { Metadata } from "next";
import { familyPersona, PersonaLanding } from "@/components/persona-landing";

export const metadata: Metadata = {
  title: "For Overseas Families",
  description: "Consent-aware parent-care visibility for overseas Pakistani families.",
};

export default function FamiliesPage() {
  return <PersonaLanding config={familyPersona} />;
}
