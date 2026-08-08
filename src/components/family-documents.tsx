"use client";

import { Download, FileText, LoaderCircle, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

type DocumentRow = { id: string; name: string; mime_type: string; size_bytes: number; consent_state: string; created_at: string };

export function FamilyDocuments({ elderId }: { elderId: string | null }) {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    if (!elderId) return;
    const response = await fetch(`/api/documents?elderId=${encodeURIComponent(elderId)}`, { cache: "no-store" });
    const payload = await response.json();
    if (response.ok) setDocuments(payload.documents ?? []);
  }

  useEffect(() => {
    if (!elderId) return;
    let active = true;
    fetch(`/api/documents?elderId=${encodeURIComponent(elderId)}`, { cache: "no-store" })
      .then((response) => response.json().then((payload) => ({ response, payload })))
      .then(({ response, payload }) => {
        if (active && response.ok) setDocuments(payload.documents ?? []);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [elderId]);

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement;
    if (!elderId || !input.files?.[0]) return;
    setBusy(true); setError(""); setNotice("");
    const data = new FormData(); data.set("elderId", elderId); data.set("file", input.files[0]);
    const response = await fetch("/api/documents", { method: "POST", body: data });
    const payload = await response.json();
    if (!response.ok) setError(payload.error ?? "Unable to upload document.");
    else { setNotice("Document added to the private care record."); form.reset(); await load(); }
    setBusy(false);
  }

  async function openDocument(id: string) {
    const response = await fetch(`/api/documents/${id}`);
    const payload = await response.json();
    if (response.ok && payload.url) window.open(payload.url, "_blank", "noopener,noreferrer");
    else setError(payload.error ?? "Unable to open document.");
  }

  async function removeDocument(id: string) {
    const response = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    const payload = await response.json();
    if (!response.ok) setError(payload.error ?? "Unable to remove document.");
    else { setNotice("Document removed."); await load(); }
  }

  if (!elderId) return null;
  return (
    <section className="mt-4 overflow-hidden rounded-md border border-[#D5E4E0] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE9E5] px-5 py-4"><div><h2 className="text-base font-bold text-[#143A35]">Private documents</h2><p className="mt-1 text-xs text-[#70847E]">PDF, JPG, and PNG files up to 10 MB. Access is permission-controlled.</p></div><FileText className="h-5 w-5 text-[#087B69]" /></div>
      <form onSubmit={upload} className="flex flex-wrap items-end gap-3 border-b border-[#E3ECE9] bg-[#F8FBF9] px-5 py-4"><label className="grid flex-1 gap-1.5 text-xs font-bold text-[#536B66]">Add a record<input required name="file" type="file" accept="application/pdf,image/jpeg,image/png" className="block min-h-10 rounded-md border border-[#CFE0DB] bg-white px-3 py-2 text-xs font-semibold" /></label><button disabled={busy} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#006E5B] px-4 text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload</button></form>
      {notice ? <p role="status" className="border-b border-[#DCE9E5] bg-[#EAF8F4] px-5 py-3 text-sm font-semibold text-[#08705F]">{notice}</p> : null}
      {error ? <p role="alert" className="border-b border-[#F3C7C2] bg-[#FFF0EE] px-5 py-3 text-sm font-semibold text-[#A63E33]">{error}</p> : null}
      <div className="divide-y divide-[#E3ECE9]">{documents.map((document) => <div key={document.id} className="flex items-center justify-between gap-3 px-5 py-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-[#143A35]">{document.name}</p><p className="mt-1 text-xs text-[#80948F]">{Math.max(1, Math.round(document.size_bytes / 1024))} KB Â· {document.consent_state === "VERIFIED" ? "Consent verified" : "Consent review pending"}</p></div><div className="flex items-center gap-1"><button type="button" onClick={() => openDocument(document.id)} className="grid h-9 w-9 place-items-center rounded-md text-[#087B69] hover:bg-[#EAF8F4]" title="Open document"><Download className="h-4 w-4" /></button><button type="button" onClick={() => removeDocument(document.id)} className="grid h-9 w-9 place-items-center rounded-md text-[#A63E33] hover:bg-[#FFF0EE]" title="Remove document"><X className="h-4 w-4" /></button></div></div>)}{!documents.length ? <p className="px-5 py-5 text-sm text-[#70847E]">No documents have been added.</p> : null}</div>
    </section>
  );
}
