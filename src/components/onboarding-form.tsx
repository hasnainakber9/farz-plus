"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormState = {
  country: string;
  city: string;
  parentName: string;
  approximateAge: string;
  relationship: string;
  preferredLanguage: string;
  livingArrangement: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  consentAttested: boolean;
  healthConsent: boolean;
};

export function OnboardingForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ country: "Pakistan", city: "", parentName: "", approximateAge: "", relationship: "Son or daughter", preferredLanguage: "English", livingArrangement: "", emergencyName: "", emergencyPhone: "", emergencyRelationship: "", consentAttested: false, healthConsent: false });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const payload = await response.json();
    if (!response.ok) setError(payload.error ?? "Unable to save onboarding.");
    else { router.push(payload.route); router.refresh(); }
    setBusy(false);
  }

  function field(label: string, key: Exclude<keyof FormState, "consentAttested" | "healthConsent">, props: React.InputHTMLAttributes<HTMLInputElement> = {}) {
    return <label className="grid gap-1.5 text-xs font-bold text-[#38534D]">{label}<input {...props} required value={String(form[key])} onChange={(event) => update(key, event.target.value)} className="h-12 rounded-md border border-[#CFE0DB] px-4 text-sm outline-none focus:border-[#08A98A]" /></label>;
  }

  return (
    <main className="min-h-screen bg-[#F4F8F6] px-5 py-10 text-[#143A35] sm:px-7 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase text-[#087B69]">Farz+ onboarding</p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">Start with the person you are caring for.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#60756F]">Save basic information now. You can add recorded conditions, medications, documents, and additional family members later.</p>
        <form onSubmit={submit} className="mt-10 grid gap-6 rounded-md border border-[#CFE0DB] bg-white p-5 shadow-xl sm:p-8">
          <section><h2 className="text-lg font-bold">Your location</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{field("Country", "country")}{field("Parent's city", "city")}</div></section>
          <section><h2 className="text-lg font-bold">Parent profile</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{field("Parent's name", "parentName")}{field("Approximate age", "approximateAge", { type: "number", min: 18, max: 120 })}{field("Relationship", "relationship")}{field("Preferred language", "preferredLanguage")}{field("Living arrangement", "livingArrangement", { className: "sm:col-span-2" })}</div></section>
          <section><h2 className="text-lg font-bold">Emergency contact</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{field("Name", "emergencyName")}{field("Phone", "emergencyPhone", { type: "tel" })}{field("Relationship", "emergencyRelationship")}</div></section>
          <div className="grid gap-3">
            <label className="flex items-start gap-3 rounded-md border border-[#DCE9E5] bg-[#F8FBF9] p-4 text-sm leading-6 text-[#536B66]"><input required type="checkbox" checked={form.consentAttested} onChange={(event) => update("consentAttested", event.target.checked)} className="mt-1 h-4 w-4 accent-[#087B69]" /><span><strong className="text-[#143A35]">I have permission to enter this basic information.</strong><br />This records a basic family attestation for the household profile.</span></label>
            <label className="flex items-start gap-3 rounded-md border border-[#DCE9E5] bg-white p-4 text-sm leading-6 text-[#536B66]"><input type="checkbox" checked={form.healthConsent} onChange={(event) => update("healthConsent", event.target.checked)} className="mt-1 h-4 w-4 accent-[#087B69]" /><span><strong className="text-[#143A35]">I am the elder or an authorized representative for health records.</strong><br />This records consent for health records, private documents, and clinician handoffs. Corti live PHI remains disabled until separate approval.</span></label>
          </div>
          {error ? <p role="alert" className="rounded-md border border-[#FFC1BA] bg-[#FFF0EE] px-3 py-2 text-sm font-semibold text-[#A93931]">{error}</p> : null}
          <button disabled={busy} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#006E5B] text-sm font-bold text-white disabled:opacity-60">{busy ? "Saving care profile..." : "Save and open family dashboard"}<ArrowRight className="h-4 w-4" /></button>
          <p className="flex items-start gap-2 text-xs leading-5 text-[#70847E]"><ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#087B69]" />Recorded information is not a Farz+ diagnosis or prescription.</p>
        </form>
      </div>
    </main>
  );
}
