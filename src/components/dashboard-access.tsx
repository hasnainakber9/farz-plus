"use client";

import { LockKeyhole, LogOut, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import {
  AdminDashboardPreview,
  CareManagerDashboardPreview,
  ElderMobilePreview,
  FamilyDashboardPreview,
  MonthlyReportCard,
} from "@/components/dashboard-panels";
import { EmergencyButton } from "@/components/emergency-button";
import { GlassCard, Shell, StatusPill } from "@/components/ui";

type Role = "family" | "care-manager" | "clinician" | "admin";

const credentials: Record<Role, { username: string; password: string; label: string }> = {
  family: {
    username: "family@farzplus.pk",
    password: "FarzFamily123",
    label: "Family Portal",
  },
  "care-manager": {
    username: "hamza@farzplus.pk",
    password: "FarzSaathi123",
    label: "Care Manager / Saathi",
  },
  clinician: {
    username: "dr.farooq@farzplus.pk",
    password: "FarzClinical123",
    label: "Clinical Reviewer",
  },
  admin: {
    username: "admin@farzplus.pk",
    password: "FarzAdmin123",
    label: "Admin Console",
  },
};

export function DashboardAccess() {
  const [role, setRole] = useState<Role | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const activeLabel = useMemo(() => (role ? credentials[role].label : ""), [role]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const matchedRole = (Object.entries(credentials) as [Role, typeof credentials[Role]][]).find(
      ([, value]) => value.username === username.trim() && value.password === password,
    )?.[0];

    if (!matchedRole) {
      setError("Credentials do not match a Farz+ portal account.");
      return;
    }

    setRole(matchedRole);
    setError("");
  }

  if (!role) {
    return (
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 grid-texture opacity-40" />
        <Shell className="relative grid gap-10 lg:grid-cols-[0.9fr_0.74fr] lg:items-center">
          <div className="max-w-3xl">
            <StatusPill tone="info">Secure portal</StatusPill>
            <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              Sign in to Farz+ care operations.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#D9E3E8]">
              Family members see parent care status. Care managers coordinate operations. Clinicians review escalations. Admin teams manage partners, tasks, risks, and service quality.
            </p>
          </div>
          <GlassCard className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#38D6B0]/12 text-[#38D6B0]">
                <LockKeyhole className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">Portal login</h2>
                <p className="mt-1 text-sm text-[#D9E3E8]">Use a role account.</p>
              </div>
            </div>
            <form onSubmit={onSubmit} className="grid gap-4">
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-[#7F8A96] focus:border-[#38D6B0] focus:ring-2 focus:ring-[#38D6B0]/20"
                placeholder="Email"
                type="email"
                autoComplete="username"
              />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-[#7F8A96] focus:border-[#38D6B0] focus:ring-2 focus:ring-[#38D6B0]/20"
                placeholder="Password"
                type="password"
                autoComplete="current-password"
              />
              {error ? <p className="text-sm font-semibold text-[#FFB4AB]">{error}</p> : null}
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#38D6B0] px-6 py-3 text-sm font-extrabold text-[#07111F] shadow-[0_0_30px_rgba(56,214,176,0.34)] transition hover:bg-[#E6FAF3]"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Sign in
              </button>
            </form>
          </GlassCard>
        </Shell>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 grid-texture opacity-35" />
      <Shell className="relative grid gap-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <StatusPill>{activeLabel}</StatusPill>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {role === "family" && "Parent care dashboard"}
              {role === "care-manager" && "Care manager queue"}
              {role === "clinician" && "Clinical review workspace"}
              {role === "admin" && "Admin operations console"}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setRole(null);
              setPassword("");
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-sm font-extrabold text-white transition hover:border-[#38D6B0]/40 hover:bg-[#38D6B0]/10"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>

        {role === "family" ? <FamilyPortal /> : null}
        {role === "care-manager" ? <CareManagerPortal /> : null}
        {role === "clinician" ? <ClinicianPortal /> : null}
        {role === "admin" ? <AdminPortal /> : null}
      </Shell>
    </section>
  );
}

function FamilyPortal() {
  return (
    <div className="grid gap-12">
      <GlassCard className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <StatusPill>Family app</StatusPill>
            <h2 className="mt-4 text-2xl font-extrabold text-white">Parent care and proof timeline</h2>
          </div>
          <EmergencyButton />
        </div>
        <div className="mt-6">
          <FamilyDashboardPreview />
        </div>
      </GlassCard>
      <div className="grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <ElderMobilePreview />
        <MonthlyReportCard />
      </div>
    </div>
  );
}

function CareManagerPortal() {
  return (
    <div className="grid gap-12">
      <div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <StatusPill tone="info">Care manager app</StatusPill>
          <h2 className="text-2xl font-extrabold text-white">Tasks, scripts, risk flags, and supervisor review</h2>
        </div>
        <CareManagerDashboardPreview />
      </div>
    </div>
  );
}

function ClinicianPortal() {
  return (
    <div className="grid gap-12">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8">
        <StatusPill tone="info">Clinical review</StatusPill>
        <h2 className="mt-5 text-2xl font-extrabold text-white">Escalations and case context</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#B8C0C8]">Escalation</p>
            <p className="mt-2 text-lg font-bold text-white">FARZ-2429 / Bilquis Begum</p>
            <p className="mt-4 text-sm leading-7 text-[#B8C0C8]">Medication-related concern detected. Route to human review.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#B8C0C8]">Clinical note</p>
            <p className="mt-2 text-sm leading-7 text-[#B8C0C8]">Review medication story and medication record. Request clarification if needed and return guidance through the care manager.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminPortal() {
  return (
    <div className="grid gap-12">
      <div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <StatusPill tone="info">Admin OS</StatusPill>
          <h2 className="text-2xl font-extrabold text-white">Operations, partners, quality, and corporate accounts</h2>
        </div>
        <AdminDashboardPreview />
      </div>
    </div>
  );
}
