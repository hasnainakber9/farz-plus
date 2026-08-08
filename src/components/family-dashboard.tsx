"use client";

import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  Circle,
  HeartPulse,
  MessageCircle,
  Moon,
  Pill,
  ShieldAlert,
  ShieldCheck,
  Smile,
  UserRoundCheck,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { FamilyActions } from "@/components/family-actions";
import { FamilyDocuments } from "@/components/family-documents";
import { useCareOperations } from "@/hooks/use-care-operations";
import type { CareFeedItem, MedicationStatus } from "@/lib/platform-types";
import { cn } from "@/lib/utils";

const feedIcons: Record<CareFeedItem["kind"], typeof Activity> = {
  MESSAGE: MessageCircle,
  RISK: ShieldAlert,
  CORTI: ShieldCheck,
  HUMAN: UserRoundCheck,
  MEDICATION: Pill,
  VITAL: HeartPulse,
  EMERGENCY: AlertTriangle,
};

const statusStyle = {
  STABLE: "border-[#AAD5CB] bg-[#EAF8F4] text-[#08705F]",
  ATTENTION: "border-[#E6D09A] bg-[#FFF8E7] text-[#876618]",
  CRITICAL: "border-[#F3B4AC] bg-[#FFF0EE] text-[#A63E33]",
} as const;

export function FamilyDashboard({ name }: { name: string }) {
  const { snapshot, connected, error, updateMedication, triggerEmergency } = useCareOperations();
  const [notice, setNotice] = useState("");
  const [busyMedication, setBusyMedication] = useState("");
  const patient = snapshot?.patients[0];
  const medications = snapshot?.medications.filter((item) => item.patientId === patient?.id) ?? [];
  const feed = snapshot?.feed.filter((item) => item.patientId === patient?.id).slice(0, 8) ?? [];

  async function setMedicationStatus(id: string, status: MedicationStatus) {
    setBusyMedication(id);
    try {
      await updateMedication(id, status);
      setNotice(`Medication status updated to ${status.toLowerCase()}.`);
    } finally {
      setBusyMedication("");
    }
  }

  async function requestEmergency() {
    const result = await triggerEmergency();
    setNotice(result.message);
  }

  return (
    <DashboardShell
      role="FAMILY"
      name={name}
      title="Hussain Ali · Lahore"
      subtitle="Family view · updates in Pakistan Standard Time"
      connected={connected}
    >
      <main className="mx-auto max-w-[1540px] p-4 sm:p-6">
        {notice ? (
          <div className="mb-4 flex items-start justify-between gap-3 rounded-md border border-[#AFCFC7] bg-[#EAF8F4] px-4 py-3 text-sm font-semibold text-[#08705F]">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} className="text-xs font-bold">Dismiss</button>
          </div>
        ) : null}
        {error ? <p className="mb-4 rounded-md border border-[#FFC1BA] bg-[#FFF0EE] p-3 text-sm text-[#A93931]">{error}</p> : null}
        <FamilyActions elderId={patient?.id ?? null} />

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_360px]">
          <div className="overflow-hidden rounded-md border border-[#D5E4E0] bg-white">
            <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
              <div className="relative min-h-64 border-b border-[#DCE9E5] lg:border-b-0 lg:border-r">
                <Image
                  src="/images/care-pulse-elder.png"
                  alt="Recorded parent profile"
                  fill
                  priority
                  sizes="(min-width: 1024px) 260px, 100vw"
                  className="object-cover object-[48%_22%]"
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-[#087B69]">Parent overview</p>
                    <h2 className="mt-2 text-2xl font-extrabold text-[#143A35]">{patient?.name ?? "Loading parent..."}</h2>
                    <p className="mt-1 text-sm text-[#60756F]">{patient?.age ?? "--"} years · {patient?.city ?? "Lahore"}</p>
                  </div>
                  {patient ? (
                    <span className={cn("inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-bold", statusStyle[patient.riskLevel])}>
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {patient.riskLevel === "STABLE" ? "Stable" : patient.riskLevel === "ATTENTION" ? "Attention needed" : "Urgent review"}
                    </span>
                  ) : null}
                </div>
                <div className="mt-6 grid gap-px overflow-hidden rounded-md border border-[#DCE9E5] bg-[#DCE9E5] sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { icon: HeartPulse, label: "Blood pressure", value: patient ? `${patient.vitals.at(-1)?.systolic}/${patient.vitals.at(-1)?.diastolic}` : "--" },
                    { icon: Smile, label: "Mood", value: patient?.mood ?? "--" },
                    { icon: Activity, label: "Activity", value: patient?.activity ?? "--" },
                    { icon: Moon, label: "Next check-in", value: "01:00 PM" },
                  ].map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div key={metric.label} className="min-h-28 bg-[#F8FBF9] p-4">
                        <Icon className="h-4 w-4 text-[#08A98A]" />
                        <p className="mt-3 text-[10px] font-bold uppercase text-[#80948F]">{metric.label}</p>
                        <p className="mt-1 text-sm font-bold text-[#143A35]">{metric.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-md border border-[#E8C8C3] bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-md bg-[#FFF0EE] text-[#B4493C]">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-[#143A35]">Request urgent help</h2>
                <p className="mt-1 text-xs leading-5 text-[#70847E]">
                  Alerts the Farz+ care manager and family call tree. It does not replace local emergency services.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={requestEmergency}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B4493C] text-sm font-bold text-white transition hover:bg-[#993A30]"
            >
              <AlertTriangle className="h-4 w-4" />
              Trigger emergency workflow
            </button>
            <div className="mt-4 border-t border-[#EEE2DF] pt-4">
              <p className="text-xs font-bold uppercase text-[#80948F]">Named care manager</p>
              <p className="mt-1 text-sm font-bold text-[#143A35]">Assigned after your first care request</p>
              <p className="mt-1 text-xs text-[#70847E]">Farz+ will show the named team member here when assigned.</p>
            </div>
          </aside>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div id="feed" className="overflow-hidden rounded-md border border-[#D5E4E0] bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-[#DCE9E5] px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-[#143A35]">Family care feed</h2>
                <p className="mt-1 text-xs text-[#70847E]">In-app family, care-team, medication, and safety updates.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#087B69]">
                <span className="h-2 w-2 rounded-full bg-[#08A98A]" />
                Live
              </span>
            </div>
            <div className="divide-y divide-[#E3ECE9]">
              {feed.map((item) => {
                const Icon = feedIcons[item.kind];
                return (
                  <article key={item.id} className="grid grid-cols-[40px_minmax(0,1fr)_66px] gap-3 px-5 py-4">
                    <span className={cn(
                      "grid h-9 w-9 place-items-center rounded-md",
                      item.kind === "RISK" || item.kind === "EMERGENCY"
                        ? "bg-[#FFF0EE] text-[#B4493C]"
                        : "bg-[#EAF8F4] text-[#087B69]",
                    )}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#143A35]">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#60756F]">{item.detail}</p>
                      <p className="mt-1.5 text-xs font-semibold text-[#80948F]">{item.actor}</p>
                    </div>
                    <time className="text-right text-xs font-semibold text-[#80948F]">{item.timestamp}</time>
                  </article>
                );
              })}
              {!feed.length ? <p className="px-5 py-8 text-sm text-[#70847E]">No care updates have been recorded yet.</p> : null}
            </div>
          </div>

          <aside className="overflow-hidden rounded-md border border-[#D5E4E0] bg-white">
            <div className="border-b border-[#DCE9E5] px-5 py-4">
              <h2 className="text-base font-bold text-[#143A35]">Today&apos;s medication</h2>
              <p className="mt-1 text-xs text-[#70847E]">Status changes are visible to the care team.</p>
            </div>
            <div className="divide-y divide-[#E3ECE9]">
              {medications.map((medication) => (
                <div key={medication.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#143A35]">{medication.name}</p>
                      <p className="mt-1 text-xs text-[#70847E]">{medication.dosage} · {medication.time}</p>
                    </div>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-bold",
                      medication.status === "TAKEN"
                        ? "bg-[#EAF8F4] text-[#08705F]"
                        : medication.status === "MISSED"
                          ? "bg-[#FFF0EE] text-[#A63E33]"
                          : "bg-[#FFF8E7] text-[#876618]",
                    )}>
                      {medication.status === "TAKEN" ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                      {medication.status}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={busyMedication === medication.id}
                      onClick={() => setMedicationStatus(medication.id, "TAKEN")}
                      className="flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-[#AFCFC7] text-xs font-bold text-[#08705F] hover:bg-[#EAF8F4]"
                    >
                      <Check className="h-3.5 w-3.5" /> Taken
                    </button>
                    <button
                      type="button"
                      disabled={busyMedication === medication.id}
                      onClick={() => setMedicationStatus(medication.id, "MISSED")}
                      className="flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-[#E8C8C3] text-xs font-bold text-[#A63E33] hover:bg-[#FFF0EE]"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" /> Missed
                    </button>
                  </div>
                </div>
              ))}
              {!medications.length ? <p className="px-4 py-5 text-sm text-[#70847E]">No medications have been recorded.</p> : null}
            </div>
            <div className="border-t border-[#DCE9E5] bg-[#F8FBF9] p-4">
              <p className="flex items-start gap-2 text-xs leading-5 text-[#60756F]">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#087B69]" />
                Medication records coordinate care. They do not provide dosing advice.
              </p>
            </div>
          </aside>
        </section>
        <FamilyDocuments elderId={patient?.id ?? null} />
      </main>
    </DashboardShell>
  );
}
