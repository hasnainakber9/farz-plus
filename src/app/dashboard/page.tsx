import { redirect } from "next/navigation";
import { requireUser, routeForRole } from "@/lib/auth";

export default async function DashboardPage() {
  const { profile } = await requireUser();
  redirect(routeForRole(profile.role));
}
