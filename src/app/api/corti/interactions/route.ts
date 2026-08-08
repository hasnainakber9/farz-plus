import { createCortiInteraction } from "@/lib/corti";

const caseIdPattern = /^[A-Z0-9-]{6,80}$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { caseId?: unknown } | null;
  const caseId = typeof body?.caseId === "string" ? body.caseId.trim() : "";

  if (!caseIdPattern.test(caseId)) {
    return Response.json({ error: "A valid Farz+ case ID is required." }, { status: 400 });
  }

  try {
    const interaction = await createCortiInteraction(caseId);
    return Response.json(interaction);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Corti request failed.";
    return Response.json({ error: message }, { status: 502 });
  }
}

