import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";

export async function GET(_request: Request, context: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await context.params;
  const { supabase, profile } = await getAuthContext();
  if (!profile) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: document } = await supabase.from("documents").select("id,storage_path,name,mime_type").eq("id", documentId).maybeSingle();
  if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });
  const { data, error } = await supabase.storage.from("care-documents").createSignedUrl(document.storage_path, 300);
  if (error || !data?.signedUrl) return NextResponse.json({ error: "Unable to prepare document access." }, { status: 400 });
  return NextResponse.json({ url: data.signedUrl, name: document.name, mimeType: document.mime_type });
}

export async function DELETE(_request: Request, context: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await context.params;
  const { supabase, profile } = await getAuthContext();
  if (!profile) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: document } = await supabase.from("documents").select("id,storage_path").eq("id", documentId).maybeSingle();
  if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });
  const removed = await supabase.storage.from("care-documents").remove([document.storage_path]);
  if (removed.error) return NextResponse.json({ error: "Unable to remove the document." }, { status: 400 });
  const { error } = await supabase.from("documents").delete().eq("id", documentId);
  if (error) return NextResponse.json({ error: "Unable to remove the document record." }, { status: 400 });
  await supabase.from("audit_events").insert({ actor_id: profile.id, action: "DOCUMENT_DELETED", entity_type: "document", entity_id: documentId, metadata: {} });
  return NextResponse.json({ ok: true });
}
