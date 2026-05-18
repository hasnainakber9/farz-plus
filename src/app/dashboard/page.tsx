import type { Metadata } from "next";
import { DashboardAccess } from "@/components/dashboard-access";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Farz+ family and admin care operations dashboard.",
};

export default function DashboardPage() {
  return <DashboardAccess />;
}
