import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Medical Disclaimer",
  description: "Farz+ does not replace hospitals, doctors, ambulances, or emergency services.",
};

export default function MedicalDisclaimerPage() {
  return (
    <LegalPage
      eyebrow="Medical Disclaimer"
      title="Farz+ is care coordination, not medical diagnosis."
      intro="This boundary must stay visible across the website, app, dashboards, emergency flows, and AI-assisted summaries."
      sections={[
        {
          title: "No medical replacement",
          body: "Farz+ does not replace licensed physicians, hospitals, ambulances, emergency services, nurses, therapists, or professional medical advice.",
        },
        {
          title: "No emergency guarantee",
          body: "Emergency protocols help organize family contacts, approved profile sharing, partner coordination, and live updates. They cannot guarantee ambulance availability, hospital acceptance, clinical outcomes, or response times.",
        },
        {
          title: "No AI diagnosis",
          body: "AI-generated reminders, summaries, risk alerts, and Care Score inputs are family visibility tools. They are not clinical assessments or diagnoses.",
        },
        {
          title: "When urgent",
          body: "For immediate danger, families and elders should call local emergency services, ambulance providers, hospitals, or doctors directly while notifying Farz+ where appropriate.",
        },
      ]}
      disclaimer
    />
  );
}
