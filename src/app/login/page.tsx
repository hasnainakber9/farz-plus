import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPanel } from "@/components/login-panel";

export const metadata: Metadata = {
  title: "Access Dashboard",
  description: "Open a role-based Farz+ family, care-manager, or doctor workspace.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPanel />
    </Suspense>
  );
}
