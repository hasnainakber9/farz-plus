import type { Metadata } from "next";
import { careTeamPersona, PersonaLanding } from "@/components/persona-landing";

export const metadata: Metadata = {
  title: "For Care Managers",
  description: "Risk triage, human handoffs, medication records, and accountable care operations.",
};

export default function CareTeamsPage() {
  return <PersonaLanding config={careTeamPersona} />;
}
