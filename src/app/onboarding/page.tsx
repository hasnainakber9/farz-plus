import { OnboardingForm } from "@/components/onboarding-form";
import { requireRole } from "@/lib/auth";

export default async function OnboardingPage() {
  await requireRole(["FAMILY", "ELDER"]);
  return <OnboardingForm />;
}
