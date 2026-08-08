import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";

const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const elderId = searchParams.get("elderId");
  if (!elderId) return NextResponse.json({ error: "Parent record is required." }, { status: 400 });
  const { supabase, profile } = await getAuthContext();
  if (!profile) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data, error } = await supabase.from("documents").select("id,name,category,mime_type,size_bytes,consent_state,created_at").eq("elder_id", elderId).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Unable to load documents." }, { status: 400 });
  return NextResponse.json({ documents: data ?? [] });
}

function hasSignature(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "application/pdf") return new TextDecoder().decode(bytes.slice(0, 4)) === "%PDF";
  if (mimeType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value);
}

export async function POST(request: Request) {
  const { supabase, profile } = await getAuthContext();
  if (!profile) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const formData = await request.formData().catch(() => null);
  const elderId = String(formData?.get("elderId") ?? "");
  const file = formData?.get("file");
  if (!elderId || !(file instanceof File)) return NextResponse.json({ error: "Choose a file and a parent record." }, { status: 400 });
  if (!allowedMimeTypes.has(file.type)) return NextResponse.json({ error: "Use a PDF, JPG, or PNG file." }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Files must be 10 MB or smaller." }, { status: 400 });

  const { data: elder } = await supabase.from("elders").select("id,household_id,consent_state").eq("id", elderId).maybeSingle();
  if (!elder) return NextResponse.json({ error: "Parent record not found." }, { status: 404 });
  if (elder.consent_state !== "VERIFIED") return NextResponse.json({ error: "Record health consent before adding private documents." }, { status: 403 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasSignature(bytes, file.type)) return NextResponse.json({ error: "The file signature does not match its type." }, { status: 400 });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120) || "document";
  const storagePath = `${elder.household_id}/${elder.id}/${crypto.randomUUID()}-${safeName}`;
  const upload = await supabase.storage.from("care-documents").upload(storagePath, bytes, { contentType: file.type, upsert: false });
  if (upload.error) return NextResponse.json({ error: "Unable to store the document." }, { status: 400 });
  const { data: document, error } = await supabase.from("documents").insert({ elder_id: elder.id, uploaded_by: profile.id, name: file.name.slice(0, 160), storage_path: storagePath, mime_type: file.type, size_bytes: file.size, consent_state: "VERIFIED" }).select("id,name,category,mime_type,size_bytes,consent_state,created_at").single();
  if (error || !document) {
    await supabase.storage.from("care-documents").remove([storagePath]);
    return NextResponse.json({ error: "Unable to register the document." }, { status: 400 });
  }
  await supabase.from("audit_events").insert({ actor_id: profile.id, action: "DOCUMENT_UPLOADED", entity_type: "document", entity_id: document.id, metadata: { mime_type: file.type, size_bytes: file.size } });
  return NextResponse.json({ ok: true, document });
}
