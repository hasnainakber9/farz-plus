import type { Metadata } from "next";
import { doctorPersona, PersonaLanding } from "@/components/persona-landing";

export const metadata: Metadata = {
  title: "For Doctors and Clinics",
  description: "Structured clinical escalations, patient summaries, vitals, and attributed professional actions.",
};

export default function DoctorsPage() {
  return <PersonaLanding config={doctorPersona} />;
}
