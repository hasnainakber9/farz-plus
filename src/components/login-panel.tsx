"use client";

import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";

export function LoginPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(searchParams.get("error") ? "That authentication link is no longer valid." : "");
  const [notice, setNotice] = useState(searchParams.get("confirmed") === "check-email" ? "Check your email to confirm your account before signing in." : "");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Sign in failed.");
      router.push(searchParams.get("next") || payload.route || "/dashboard");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F8F6] text-[#143A35]">
      <header className="border-b border-[#DCE8E4] bg-white">
        <div className="mx-auto flex h-17 max-w-[1280px] items-center justify-between px-5 sm:px-7">
          <BrandMark />
          <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-md border border-[#D5E4E0] px-3 text-xs font-bold text-[#536B66] transition hover:bg-[#F3F8F6]"><ArrowLeft className="h-4 w-4" />Public site</Link>
        </div>
      </header>
      <main className="mx-auto grid min-h-[calc(100vh-68px)] max-w-[1280px] gap-10 px-5 py-10 sm:px-7 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:py-14">
        <section>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-[#087B69]"><span className="h-2 w-2 rounded-full bg-[#08A98A]" />Care operations online</div>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] text-[#143A35] sm:text-5xl">One care record. Accountable views for every person who helps.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#60756F]">Sign in to your real Farz+ account. Families, care managers, clinicians, and administrators see only the records their role and consent allow.</p>
          <div className="mt-8 grid gap-3 text-sm text-[#536B66] sm:grid-cols-3">
            {["Persistent family records", "Consent-scoped access", "Human approval on consequential care"].map((item) => <p key={item} className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#08A98A]" />{item}</p>)}
          </div>
        </section>
        <section className="rounded-md border border-[#CFE0DB] bg-white p-5 shadow-[0_22px_60px_rgba(20,58,53,0.1)] sm:p-7">
          <div className="flex items-start gap-3"><span className="grid h-11 w-11 flex-none place-items-center rounded-md bg-[#E8F6F2] text-[#087B69]"><LockKeyhole className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase text-[#087B69]">Secure account access</p><h2 className="mt-1 text-xl font-bold text-[#143A35]">Sign in to Farz+</h2><p className="mt-1 text-sm leading-6 text-[#60756F]">Use the email you registered with.</p></div></div>
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="grid gap-1.5 text-xs font-bold text-[#38534D]">Email<input required value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-md border border-[#CFE0DB] px-4 text-sm font-medium outline-none transition focus:border-[#08A98A] focus:ring-2 focus:ring-[#08A98A]/15" type="email" autoComplete="username" /></label>
            <label className="grid gap-1.5 text-xs font-bold text-[#38534D]">Password<input required value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-md border border-[#CFE0DB] px-4 text-sm font-medium outline-none transition focus:border-[#08A98A] focus:ring-2 focus:ring-[#08A98A]/15" type="password" autoComplete="current-password" /></label>
            {notice ? <p role="status" className="rounded-md border border-[#AFCFC7] bg-[#EAF8F4] px-3 py-2 text-sm font-semibold text-[#08705F]">{notice}</p> : null}
            {error ? <p role="alert" className="rounded-md border border-[#FFC1BA] bg-[#FFF0EE] px-3 py-2 text-sm font-semibold text-[#A93931]">{error}</p> : null}
            <button type="submit" disabled={submitting} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#006E5B] px-6 text-sm font-bold text-white transition hover:bg-[#005B4C] disabled:opacity-60">{submitting ? "Opening workspace..." : "Sign in"}<ArrowRight className="h-4 w-4" /></button>
          </form>
          <div className="mt-5 flex items-center justify-between gap-3 text-xs font-semibold"><Link href="/forgot-password" className="text-[#087B69] hover:underline">Forgot password?</Link><Link href="/signup" className="text-[#087B69] hover:underline">Create a family account</Link></div>
          <p className="mt-5 text-xs leading-5 text-[#70847E]">Farz+ coordinates care. It does not replace local emergency services, licensed clinicians, or medical advice.</p>
        </section>
      </main>
    </div>
  );
}
