import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-contract";
import { createAdminClient } from "@/lib/supabase/admin";
import { whatsappLink } from "@/lib/utils";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json({ ok: false, error: "Care inquiries are temporarily unavailable." }, { status: 503 });
  }

  const { data: saved, error } = await admin.from("leads").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    source: "website",
    message: JSON.stringify({ parentCity: parsed.data.parentCity, familyLocation: parsed.data.familyLocation, urgency: parsed.data.urgency, needs: parsed.data.needs }),
  }).select("id,name,email,phone,source,status,created_at").single();

  if (error || !saved) return NextResponse.json({ ok: false, error: "Unable to save your inquiry." }, { status: 400 });

  return NextResponse.json({
    ok: true,
    lead: saved,
    whatsappUrl: whatsappLink(`Farz+ care call request from ${parsed.data.familyLocation} for a parent in ${parsed.data.parentCity}. Inquiry ${saved.id}.`),
  });
}
