"use client";

import { ArrowRight, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function FamilyActions({ elderId }: { elderId: string | null }) {
  const [request, setRequest] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(path: string, body: Record<string, string>, success: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to complete the request.");
      setNotice(success);
      return true;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to complete the request.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  if (!elderId) {
    return (
      <section className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-md border border-[#B8DCD2] bg-[#EAF8F4] px-5 py-4">
        <div><p className="text-sm font-bold text-[#143A35]">Set up your parent record</p><p className="mt-1 text-sm text-[#536B66]">Add the basics first. Health details and documents stay behind a separate consent step.</p></div>
        <Link href="/onboarding" className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#006E5B] px-4 text-sm font-bold text-white">Continue setup <ArrowRight className="h-4 w-4" /></Link>
      </section>
    );
  }

  return (
    <section className="mb-4 grid gap-4 lg:grid-cols-2">
      <form onSubmit={async (event) => { event.preventDefault(); const ok = await submit("/api/care-requests", { elderId, type: "GENERAL_CONCERN", title: "Family care request", description: request }, "Care request sent to the Farz+ team."); if (ok) setRequest(""); }} className="rounded-md border border-[#D5E4E0] bg-white p-5">
        <div className="flex items-start gap-3"><span className="grid h-9 w-9 place-items-center rounded-md bg-[#EAF8F4] text-[#087B69]"><Send className="h-4 w-4" /></span><div><h2 className="text-sm font-bold text-[#143A35]">Request care coordination</h2><p className="mt-1 text-xs leading-5 text-[#70847E]">A human team member will review and confirm the next step.</p></div></div>
        <textarea required minLength={3} value={request} onChange={(event) => setRequest(event.target.value)} placeholder="What would you like the team to coordinate?" className="mt-4 min-h-24 w-full resize-y rounded-md border border-[#CFE0DB] p-3 text-sm outline-none focus:border-[#08A98A]" />
        <button disabled={busy} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-md bg-[#006E5B] px-4 text-sm font-bold text-white disabled:opacity-60">Send request <ArrowRight className="h-4 w-4" /></button>
      </form>
      <form onSubmit={async (event) => { event.preventDefault(); const ok = await submit("/api/messages", { elderId, body: message }, "Message sent to your in-app care conversation."); if (ok) setMessage(""); }} className="rounded-md border border-[#D5E4E0] bg-white p-5">
        <div className="flex items-start gap-3"><span className="grid h-9 w-9 place-items-center rounded-md bg-[#F1F5FA] text-[#3A628B]"><MessageCircle className="h-4 w-4" /></span><div><h2 className="text-sm font-bold text-[#143A35]">Message your care team</h2><p className="mt-1 text-xs leading-5 text-[#70847E]">In-app messaging is the production channel in this release.</p></div></div>
        <textarea required minLength={1} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a question or update" className="mt-4 min-h-24 w-full resize-y rounded-md border border-[#CFE0DB] p-3 text-sm outline-none focus:border-[#08A98A]" />
        <button disabled={busy} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#AFCFC7] px-4 text-sm font-bold text-[#08705F] disabled:opacity-60">Send message <MessageCircle className="h-4 w-4" /></button>
      </form>
      {notice ? <p role="status" className="lg:col-span-2 rounded-md border border-[#AFCFC7] bg-[#EAF8F4] px-4 py-3 text-sm font-semibold text-[#08705F]">{notice}</p> : null}
      {error ? <p role="alert" className="lg:col-span-2 rounded-md border border-[#FFC1BA] bg-[#FFF0EE] px-4 py-3 text-sm font-semibold text-[#A93931]">{error}</p> : null}
    </section>
  );
}
