import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms",
  description: "Farz+ MVP terms and care coordination boundaries.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Farz+ coordinates care, but families and licensed providers remain decision owners."
      intro="These MVP terms are product-ready placeholders and must be reviewed before commercial launch."
      sections={[
        {
          title: "Service role",
          body: "Farz+ is a managed care coordination and family-support platform. It helps coordinate check-ins, reminders, partners, emergency readiness, reports, and family communication.",
        },
        {
          title: "Partner services",
          body: "Doctors, nurses, labs, pharmacies, ambulances, hospitals, companions, and other providers are independent partners or third parties. Farz+ should verify, score, monitor, and escalate quality issues.",
        },
        {
          title: "Pricing",
          body: "Pilot pricing is placeholder until Islamabad partner costs, care-manager workload, and emergency coordination costs are validated. Partner charges should be transparent.",
        },
        {
          title: "Cancellations and refunds",
          body: "Refunds, cancellations, paused plans, partner disputes, and emergency event charges require a written SOP before paid launch.",
        },
      ]}
      disclaimer
    />
  );
}
