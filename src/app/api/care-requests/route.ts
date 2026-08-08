import { NextResponse } from "next/server";
import { getCareRequestRepository } from "@/lib/repositories";
import type { CaseCareRequest } from "@/types/farz";

export async function GET() {
  const repository = getCareRequestRepository();
  const records = await repository.list();

  return NextResponse.json({ ok: true, requests: records });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as Partial<CaseCareRequest> | null;

  if (!payload || !payload.elderId || !payload.householdId || !payload.createdBy || !payload.category || !payload.description) {
    return NextResponse.json({ ok: false, error: "Incomplete care request payload" }, { status: 400 });
  }

  const repository = getCareRequestRepository();
  const now = new Date().toISOString();

  const caseRequest: CaseCareRequest = {
    id: crypto.randomUUID(),
    elderId: payload.elderId,
    householdId: payload.householdId,
    createdBy: payload.createdBy,
    category: payload.category,
    description: payload.description,
    operationalPriority: payload.operationalPriority || "ROUTINE",
    status: payload.status || "OPEN",
    assignedCareManager: payload.assignedCareManager,
    escalationStatus: payload.escalationStatus || "NONE",
    createdAt: now,
    updatedAt: now,
  };

  const saved = await repository.create(caseRequest);

  return NextResponse.json({ ok: true, request: saved });
}
