import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload.email !== "string" || typeof payload.password !== "string") {
    return NextResponse.json({ ok: false, error: "Missing credentials" }, { status: 400 });
  }

  const email = payload.email.toLowerCase();
  const password = payload.password;

  const demoCredentials = new Map([
    ["family@farzplus.pk", "FarzFamily123"],
    ["hamza@farzplus.pk", "FarzSaathi123"],
    ["dr.farooq@farzplus.pk", "FarzClinical123"],
    ["admin@farzplus.pk", "FarzAdmin123"],
  ]);

  if (demoCredentials.get(email) !== password) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, user: { email, role: email.includes("hamza") ? "CARE_MANAGER" : email.includes("farooq") ? "CLINICIAN" : email.includes("admin") ? "ADMIN" : "FAMILY" } });
}
