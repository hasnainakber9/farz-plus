"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  LockKeyhole,
  LogOut,
  MessageCircle,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { CarePulseWorkspace } from "@/components/care-pulse-workspace";
import { EmergencyButton } from "@/components/emergency-button";
import { Shell } from "@/components/ui";

type Role = "family" | "admin";

const credentials: Record<Role, { username: string; password: string; label: string }> = {
  family: {
    username: "family@farzplus.pk",
    password: "FarzFamily123",
    label: "Family Portal",
  },
  admin: {
    username: "admin@farzplus.pk",
    password: "FarzAdmin123",
    label: "Care Team",
  },
};

const handoffPreview = [
  { time: "09:18", label: "Family message received", status: "Received", icon: MessageCircle },
  { time: "09:19", label: "Medication risk detected", status: "High risk", icon: ShieldCheck },
  { time: "09:21", label: "Corti context assembled", status: "Grounded", icon: HeartHandshake },
  { time: "09:22", label: "Human review assigned", status: "In progress", icon: UserRoundCheck },
];

export function DashboardAccess({ initialRole = null }: { initialRole?: Role | null }) {
  const [role, setRole] = useState<Role | null>(initialRole);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const activeLabel = role ? credentials[role].label : "";

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const matchedRole = (Object.entries(credentials) as [Role, (typeof credentials)[Role]][]).find(
      ([, value]) => value.username === username.trim() && value.password === password,
    )?.[0];

    if (!matchedRole) {
      setError("Those credentials do not match a Farz+ portal account.");
      return;
    }

    setRole(matchedRole);
    setError("");
  }

  function fillDemo(roleToUse: Role) {
    setUsername(credentials[roleToUse].username);
    setPassword(credentials[roleToUse].password);
    setError("");
  }

  function signOut() {
    setRole(null);
    setPassword("");
    window.history.replaceState({}, "", "/dashboard");
  }

  if (role === "admin") return <CarePulseWorkspace onSignOut={signOut} />;
  if (role === "family") return <FamilyPortal activeLabel={activeLabel} onSignOut={signOut} />;

  return (
    <div className="min-h-screen bg-[#F3F7F5] text-[#143A35]">
      <header className="border-b border-[#DCE9E5] bg-white">
        <Shell className="flex h-16 items-center justify-between">
          <BrandMark />
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#D5E4E0] px-3 text-xs font-bold text-[#536B66] transition hover:bg-[#F3F8F6]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Farz+
          </Link>
        </Shell>
      </header>

      <main className="border-b border-[#DCE9E5] bg-white">
        <Shell className="grid min-h-[calc(100vh-65px)] gap-10 py-10 lg:grid-cols-[minmax(0,1.05fr)_440px] lg:items-center lg:py-14">
          <section>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#087B69]">
              <span className="h-2 w-2 rounded-full bg-[#08A98A]" />
              Secure care operations
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold text-[#143A35] sm:text-5xl">
              One view of every care handoff.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#536B66]">
              Families follow care. Care teams review risk, assemble Corti context, and record every human decision.
            </p>

            <div className="mt-8 overflow-hidden rounded-md border border-[#CFE0DB] bg-white shadow-[0_18px_50px_rgba(20,58,53,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE9E5] bg-[#F8FBF9] px-4 py-3">
                <div>
                  <p className="text-xs font-bold uppercase text-[#70847E]">Live handoff preview</p>
                  <p className="mt-1 text-sm font-bold text-[#143A35]">Medication safety · Lahore</p>
                </div>
                <span className="rounded border border-[#E8D29A] bg-[#FFF8E7] px-2 py-1 text-xs font-bold text-[#8B6718]">
                  Human review
                </span>
              </div>
              <div className="divide-y divide-[#E0ECE8]">
                {handoffPreview.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="grid grid-cols-[54px_32px_minmax(0,1fr)] items-center gap-3 px-4 py-3">
                      <span className="text-xs font-semibold text-[#70847E]">{item.time}</span>
                      <span className="grid h-8 w-8 place-items-center rounded-full border border-[#B7DED4] bg-[#EAF8F4] text-[#087B69]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold text-[#274A43]">{item.label}</p>
                        <span className="text-xs font-semibold text-[#6F827D]">{item.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 border-t border-[#DCE9E5] bg-[#F5FAF8] px-4 py-3 text-xs leading-5 text-[#60756F]">
                <LockKeyhole className="h-4 w-4 flex-none text-[#087B69]" />
                Human approval stays required for consequential family messages.
              </div>
            </div>
          </section>

          <section className="rounded-md border border-[#CFE0DB] bg-white p-5 shadow-[0_22px_60px_rgba(20,58,53,0.1)] sm:p-7">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-md bg-[#E8F6F2] text-[#087B69]">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-[#143A35]">Access Farz+</h2>
                <p className="mt-1 text-sm leading-6 text-[#60756F]">Choose a demo role or sign in with your portal account.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <button
                type="button"
                onClick={() => fillDemo("family")}
                className="flex min-h-20 items-center gap-3 rounded-md border border-[#D5E4E0] bg-[#F8FBF9] p-3 text-left transition hover:border-[#9FCFC4] hover:bg-[#F1F8F5]"
              >
                <span className="grid h-9 w-9 flex-none place-items-center rounded-md bg-white text-[#087B69] shadow-sm">
                  <UsersRound className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-[#143A35]">Family view</span>
                  <span className="mt-1 block text-xs text-[#70847E]">Parent status and proof</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="flex min-h-20 items-center gap-3 rounded-md border border-[#D5E4E0] bg-[#F8FBF9] p-3 text-left transition hover:border-[#9FCFC4] hover:bg-[#F1F8F5]"
              >
                <span className="grid h-9 w-9 flex-none place-items-center rounded-md bg-white text-[#087B69] shadow-sm">
                  <HeartHandshake className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-[#143A35]">Care team</span>
                  <span className="mt-1 block text-xs text-[#70847E]">Handoff and approval tools</span>
                </span>
              </button>
            </div>

            <div className="my-5 flex items-center gap-3 text-xs font-semibold text-[#8AA09A]">
              <span className="h-px flex-1 bg-[#DCE9E5]" />
              Portal credentials
              <span className="h-px flex-1 bg-[#DCE9E5]" />
            </div>

            <form onSubmit={onSubmit} className="grid gap-4">
              <label className="grid gap-1.5 text-xs font-bold text-[#38534D]">
                Email
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="h-12 rounded-md border border-[#CFE0DB] bg-white px-4 text-sm font-medium text-[#143A35] outline-none transition placeholder:text-[#94A6A1] focus:border-[#08A98A] focus:ring-2 focus:ring-[#08A98A]/15"
                  placeholder="you@company.com"
                  type="email"
                  autoComplete="username"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-bold text-[#38534D]">
                Password
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 rounded-md border border-[#CFE0DB] bg-white px-4 text-sm font-medium text-[#143A35] outline-none transition placeholder:text-[#94A6A1] focus:border-[#08A98A] focus:ring-2 focus:ring-[#08A98A]/15"
                  placeholder="Enter password"
                  type="password"
                  autoComplete="current-password"
                />
              </label>
              {error ? (
                <p role="alert" className="rounded-md border border-[#FFC1BA] bg-[#FFF0EE] px-3 py-2 text-sm font-semibold text-[#A93931]">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#006E5B] px-6 text-sm font-bold text-white transition hover:bg-[#005B4C]"
              >
                Enter portal
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#70847E]">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#087B69]" />
              Demo access uses realistic sample data. It does not expose a real family record.
            </p>
          </section>
        </Shell>
      </main>
    </div>
  );
}

function FamilyPortal({ activeLabel, onSignOut }: { activeLabel: string; onSignOut: () => void }) {
  const careEvents = [
    { time: "08:10", title: "Morning check-in completed", detail: "Ammi confirmed she slept well and had breakfast." },
    { time: "08:35", title: "Medication confirmed", detail: "Lisinopril recorded as taken by the care manager." },
    { time: "10:20", title: "Care call scheduled", detail: "Ayesha will call after the next blood-pressure reading." },
  ];

  return (
    <div className="min-h-screen bg-[#F3F7F5] text-[#143A35]">
      <header className="border-b border-[#DCE9E5] bg-white">
        <Shell className="flex h-16 items-center justify-between">
          <BrandMark />
          <div className="flex items-center gap-2">
            <EmergencyButton />
            <button
              type="button"
              onClick={onSignOut}
              className="grid h-10 w-10 place-items-center rounded-md border border-[#D5E4E0] text-[#536B66] hover:bg-[#F3F8F6]"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </Shell>
      </header>

      <main>
        <section className="border-b border-[#DCE9E5] bg-white py-8">
          <Shell>
            <p className="text-xs font-bold uppercase text-[#087B69]">{activeLabel}</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-[#143A35]">Ammi · Lahore</h1>
                <p className="mt-2 text-sm text-[#60756F]">Last care-manager update at 10:20 AM PKT.</p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-md border border-[#AFCFC7] bg-[#EAF8F4] px-3 py-2 text-sm font-bold text-[#08705F]">
                <CheckCircle2 className="h-4 w-4" />
                All clear today
              </span>
            </div>
          </Shell>
        </section>

        <Shell className="grid gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="overflow-hidden rounded-md border border-[#D5E4E0] bg-white">
            <div className="border-b border-[#DCE9E5] px-5 py-4">
              <h2 className="text-lg font-bold">Care timeline</h2>
              <p className="mt-1 text-xs text-[#70847E]">Updates recorded by the Farz+ care team.</p>
            </div>
            <div className="divide-y divide-[#E0ECE8]">
              {careEvents.map((event) => (
                <article key={event.title} className="grid grid-cols-[52px_minmax(0,1fr)] gap-3 px-5 py-5">
                  <span className="text-xs font-bold text-[#70847E]">{event.time}</span>
                  <div>
                    <h3 className="text-sm font-bold text-[#143A35]">{event.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#60756F]">{event.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="grid content-start gap-4">
            <section className="rounded-md border border-[#D5E4E0] bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold">Today</h2>
                <Clock3 className="h-4 w-4 text-[#70847E]" />
              </div>
              <dl className="mt-4 grid gap-4">
                <div>
                  <dt className="text-xs font-bold uppercase text-[#80948F]">Medication</dt>
                  <dd className="mt-1 text-sm font-bold text-[#08705F]">Taken · 08:35 AM</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase text-[#80948F]">Next check-in</dt>
                  <dd className="mt-1 text-sm font-bold text-[#143A35]">01:00 PM PKT</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase text-[#80948F]">Care manager</dt>
                  <dd className="mt-1 text-sm font-bold text-[#143A35]">Ayesha Khan</dd>
                </div>
              </dl>
            </section>
            <Link
              href="/dashboard?demo=care-team"
              className="flex min-h-12 items-center justify-between rounded-md border border-[#D5E4E0] bg-white px-4 text-sm font-bold text-[#087B69] hover:bg-[#F3F8F6]"
            >
              View care-team handoff
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </Shell>
      </main>
    </div>
  );
}
