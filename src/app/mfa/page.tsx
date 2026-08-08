import type { Metadata } from "next";
import { MfaGate } from "@/components/mfa-gate";

export const metadata: Metadata = { title: "Verify access" };
export const dynamic = "force-dynamic";

export default function MfaPage() {
  return <MfaGate />;
}
