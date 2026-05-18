import { NextResponse } from "next/server";
import { createLeadRecord, leadSchema } from "@/lib/lead-contract";
import { getLeadRepository } from "@/lib/repositories";
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

  const lead = createLeadRecord(parsed.data);
  const repository = getLeadRepository();
  const saved = await repository.create(lead);

  return NextResponse.json({
    ok: true,
    lead: saved,
    whatsappUrl: whatsappLink(`Farz+ care call request for ${saved.parentCity} from ${saved.familyLocation}. Lead ${saved.id}.`),
  });
}
