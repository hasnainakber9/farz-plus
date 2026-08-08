import { getPlatformSnapshot } from "@/lib/platform-repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = async () => { try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(await getPlatformSnapshot())}\n\n`)); } catch { controller.error(new Error("snapshot_failed")); } };
      await send();
      const timer = setInterval(send, 10000);
      request.signal.addEventListener("abort", () => { clearInterval(timer); try { controller.close(); } catch {} });
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" } });
}
