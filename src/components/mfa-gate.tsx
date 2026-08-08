"use client";

import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function MfaGate() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [factorId, setFactorId] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.mfa.listFactors();
      const verified = data?.totp?.find((factor: { status: string; id: string }) => factor.status === "verified");
      if (verified) setFactorId(verified.id);
    })();
  }, [supabase]);

  async function setup() {
    setBusy(true); setError("");
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Farz+ authenticator" });
    if (enrollError || !data?.id) setError(enrollError?.message ?? "Unable to start authenticator setup.");
    else { setFactorId(data.id); setQrCode(data.totp.qr_code); setSecret(data.totp.secret); }
    setBusy(false);
  }

  async function challenge() {
    if (!factorId) return;
    setBusy(true); setError("");
    const { data, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError || !data?.id) setError(challengeError?.message ?? "Unable to start verification.");
    else setChallengeId(data.id);
    setBusy(false);
  }

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!factorId || !challengeId) return;
    setBusy(true); setError("");
    const { error: verifyError } = await supabase.auth.mfa.verify({ factorId, challengeId, code });
    if (verifyError) setError(verifyError.message);
    else { router.push("/dashboard"); router.refresh(); }
    setBusy(false);
  }

  return (
    <main className="min-h-screen bg-[#F4F8F6] px-5 py-12 text-[#143A35] sm:px-7 sm:py-20">
      <section className="mx-auto max-w-xl rounded-md border border-[#CFE0DB] bg-white p-6 shadow-xl sm:p-8">
        <span className="grid h-11 w-11 place-items-center rounded-md bg-[#EAF8F4] text-[#087B69]"><ShieldCheck className="h-5 w-5" /></span>
        <p className="mt-6 text-xs font-bold uppercase text-[#087B69]">Privileged access</p>
        <h1 className="mt-3 text-3xl font-extrabold">Verify your authenticator.</h1>
        <p className="mt-3 text-sm leading-6 text-[#60756F]">Care managers, clinicians, and administrators must use multi-factor authentication before opening protected records.</p>
        {!factorId ? <button type="button" onClick={setup} disabled={busy} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#006E5B] px-4 text-sm font-bold text-white disabled:opacity-60"><KeyRound className="h-4 w-4" /> Set up authenticator</button> : null}
        {qrCode ? <div className="mt-6 grid gap-3 rounded-md border border-[#DCE9E5] bg-[#F8FBF9] p-4"><p className="text-sm font-bold">Scan this code in your authenticator app.</p><Image src={qrCode} alt="Authenticator setup QR code" width={192} height={192} unoptimized className="h-48 w-48 rounded-md border border-[#DCE9E5] bg-white p-2" /><p className="break-all font-mono text-xs text-[#536B66]">Manual key: {secret}</p></div> : null}
        {factorId && !challengeId ? <button type="button" onClick={challenge} disabled={busy} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md border border-[#AFCFC7] px-4 text-sm font-bold text-[#08705F] disabled:opacity-60">Send verification challenge <ArrowRight className="h-4 w-4" /></button> : null}
        {challengeId ? <form onSubmit={verify} className="mt-6 grid gap-3"><label className="grid gap-1.5 text-xs font-bold text-[#38534D]">6-digit authenticator code<input required inputMode="numeric" pattern="[0-9]{6}" value={code} onChange={(event) => setCode(event.target.value)} className="h-12 rounded-md border border-[#CFE0DB] px-4 font-mono text-lg tracking-[0.2em] outline-none focus:border-[#08A98A]" /></label><button disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#006E5B] px-4 text-sm font-bold text-white disabled:opacity-60">Verify and continue <ArrowRight className="h-4 w-4" /></button></form> : null}
        {error ? <p role="alert" className="mt-4 rounded-md border border-[#FFC1BA] bg-[#FFF0EE] px-3 py-2 text-sm font-semibold text-[#A93931]">{error}</p> : null}
      </section>
    </main>
  );
}
