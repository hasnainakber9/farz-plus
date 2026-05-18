import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Farz+ privacy principles for consent-based parent-care records.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Consent-based records and limited access by default."
      intro="This MVP privacy page explains the intended Farz+ trust model before production legal review."
      sections={[
        {
          title: "Data we collect",
          body: "Family contact details, elder profile information, care preferences, emergency readiness details, service requests, partner invoices, care-manager notes, and proof-based timeline events.",
        },
        {
          title: "How access works",
          body: "Family access is role-based. Staff access should be limited to care operations, supervision, support, billing, and safety needs. Parents are not required to use the app.",
        },
        {
          title: "AI boundaries",
          body: "AI may draft summaries, reminders, risk flags, and reports, but it must not diagnose, override doctors, bypass consent, or make emergency guarantees.",
        },
        {
          title: "Production requirement",
          body: "Before launch, Farz+ should finalize encryption, retention, audit logs, consent withdrawal, staff access controls, partner agreements, and legal review.",
        },
      ]}
    />
  );
}
