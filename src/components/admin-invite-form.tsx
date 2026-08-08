"use client";

import { MailPlus } from "lucide-react";
import { useState } from "react";

export function AdminInviteForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("CARE_MANAGER");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice(""); setError("");
    const response = await fetch("/api/admin/invitations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, role }) });
    const payload = await response.json();
    if (!response.ok) setError(payload.error ?? "Unable to send invitation.");
    else { setNotice(`Invitation sent to ${email}.`); setEmail(""); }
    setBusy(false);
  }

  return <form onSubmit={submit} className="rounded-md border border-[#D5E4E0] bg-white p-5"><div className="flex items-center gap-2"><MailPlus className="h-5 w-5 text-[#087B69]" /><h2 className="font-bold">Invite restricted staff</h2></div><p className="mt-2 text-xs leading-5 text-[#70847E]">Invited accounts receive the selected role and must complete MFA before protected access.</p><div className="mt-4 grid gap-3"><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="staff@example.com" className="h-11 rounded-md border border-[#CFE0DB] px-3 text-sm outline-none focus:border-[#08A98A]" /><select value={role} onChange={(event) => setRole(event.target.value)} className="h-11 rounded-md border border-[#CFE0DB] bg-white px-3 text-sm outline-none focus:border-[#08A98A]"><option value="CARE_MANAGER">Care manager</option><option value="CLINICIAN">Clinician</option><option value="PARTNER">Partner</option><option value="EMPLOYER">Employer</option></select><button disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#006E5B] px-4 text-sm font-bold text-white disabled:opacity-60">Send invitation <MailPlus className="h-4 w-4" /></button></div>{notice ? <p role="status" className="mt-3 text-sm font-semibold text-[#08705F]">{notice}</p> : null}{error ? <p role="alert" className="mt-3 text-sm font-semibold text-[#A63E33]">{error}</p> : null}</form>;
}
