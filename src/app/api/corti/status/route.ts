import { getCortiStatus } from "@/lib/corti";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(getCortiStatus(), {
    headers: { "Cache-Control": "no-store" },
  });
}

