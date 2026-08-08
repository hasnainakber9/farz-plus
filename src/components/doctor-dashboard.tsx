"use client";

import {
  Activity,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileHeart,
  HeartPulse,
  MessageSquareText,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserRoundCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useCareOperations } from "@/hooks/use-care-operations";
import type { CareCase, Patient } from "@/lib/platform-types";
import { cn } from "@/lib/utils";

function VitalChart({ patient }: { patient: Patient }) {
  const max = 180;
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#143A35]">Blood-pressure trend</h3>
          <p className="mt-1 text-xs text-[#70847E]">Five most recent documented readings</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-bold text-[#70847E]">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[#2F6F9F]" /> Systolic</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[#08A98A]" /> Diastolic</span>
        </div>
      </div>
      <div className="mt-5 grid h-52 grid-cols-5 items-end gap-3 border-b border-l border-[#DCE9E5] px-3 pt-3">
        {patient.vitals.map((vital) => (
          <div key={vital.label} className="flex h-full items-end justify-center gap-1.5">
            <div className="flex h-full flex-col justify-end">
              <span className="mb-1 text-center text-[9px] font-bold text-[#536B66]">{vital.systolic}</span>
              <div
                className="w-4 rounded-t-sm bg-[#2F6F9F]"
                style={{ height: `${Math.max(24, (vital.systolic / max) * 150)}px` }}
              />
              <span className="mt-2 text-center text-[10px] font-bold text-[#70847E]">{vital.label}</span>
            </div>
            <div className="flex h-full flex-col justify-end">
              <span className="mb-1 text-center text-[9px] font-bold text-[#536B66]">{vital.diastolic}</span>
              <div
                className="w-4 rounded-t-sm bg-[#08A98A]"
                style={{ height: `${Math.max(24, (vital.diastolic / max) * 150)}px` }}
              />
              <span className="mt-2 text-center text-[10px] text-transparent">.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InboxItem({
  careCase,
  patient,
  active,
  onSelect,
}: {
  careCase: CareCase;
  patient?: Patient;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full border-b border-[#E3ECE9] p-4 text-left transition last:border-b-0",
        active ? "bg-[#F0F6FA]" : "bg-white hover:bg-[#F8FBF9]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#143A35]">{patient?.name ?? "Patient"}</p>
          <p className="mt-1 text-xs text-[#70847E]">{patient?.city} · {careCase.updatedAt}</p>
        </div>
        <ChevronRight className={cn("h-4 w-4 flex-none", active ? "text-[#2F6F9F]" : "text-[#9AADAA]")} />
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#536B66]">{careCase.riskReason}</p>
      <span className="mt-3 inline-flex rounded border border-[#F3B4AC] bg-[#FFF0EE] px-2 py-1 text-[10px] font-bold text-[#A63E33]">
        Priority clinical review
      </span>
    </button>
  );
}

export function DoctorDashboard({ name }: { name: string }) {
  const { snapshot, connected, error, updateCase } = useCareOperations();
  const doctorCases = useMemo(
    () =>
      (snapshot?.cases ?? []).filter((item) => Boolean(item.assignedDoctorId) || item.status === "ESCALATED_TO_DOCTOR" || item.status === "DOCTOR_REVIEWED"),
    [snapshot],
  );
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [observation, setObservation] = useState(
    "Review repeated BP after 15 minutes of rest. If breathlessness persists or worsens, the family should use local emergency services.",
  );
  const [consultScheduled, setConsultScheduled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const careCase = doctorCases.find((item) => item.id === selectedCaseId) ?? doctorCases[0];
  const patient = snapshot?.patients.find((item) => item.id === careCase?.patientId);
  const sourceMessage = snapshot?.messages.find((item) => item.id === careCase?.sourceMessageId);
  const medications = snapshot?.medications.filter((item) => item.patientId === patient?.id) ?? [];
  const patientFeed = snapshot?.feed.filter((item) => item.patientId === patient?.id).slice(0, 5) ?? [];

  async function recordReview(detail = observation) {
    if (!careCase) return;
    setBusy(true);
    try {
      await updateCase(careCase.id, { action: "DOCTOR_REVIEW", note: detail });
      setNotice("Clinical observation recorded and returned to the care manager.");
    } finally {
      setBusy(false);
    }
  }

  async function scheduleConsult() {
    setConsultScheduled(true);
    await recordReview("Tele-consult scheduled for today at 04:30 PM PKT. Care manager and family notified.");
  }

  return (
    <DashboardShell
      role="DOCTOR"
      name={name}
      title="Clinical escalation portal"
      subtitle="Licensed professional workspace · consent-scoped cases"
      connected={connected}
    >
      <main className="mx-auto max-w-[1680px] p-4 sm:p-5">
        {notice ? (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-md border border-[#B9D1E1] bg-[#F0F6FA] px-4 py-3 text-sm font-semibold text-[#2F6F9F]">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} className="text-xs font-bold">Dismiss</button>
          </div>
        ) : null}
        {error ? <p className="mb-4 rounded-md border border-[#FFC1BA] bg-[#FFF0EE] p-3 text-sm text-[#A93931]">{error}</p> : null}

        <section className="grid gap-px overflow-hidden rounded-md border border-[#D5E4E0] bg-[#DCE9E5] sm:grid-cols-3">
          {[
            { label: "Escalations", value: doctorCases.filter((item) => item.status === "ESCALATED_TO_DOCTOR").length, icon: AlertTriangle, detail: "Awaiting clinical review" },
            { label: "Reviewed today", value: doctorCases.filter((item) => item.status === "DOCTOR_REVIEWED").length, icon: ClipboardCheck, detail: "Returned to care operations" },
            { label: "Clinical boundary", value: "Active", icon: ShieldCheck, detail: "Every action is attributed" },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="flex min-h-28 items-center gap-4 bg-white p-5">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-md bg-[#F0F6FA] text-[#2F6F9F]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-2xl font-extrabold text-[#143A35]">{metric.value}</p>
                  <p className="text-xs font-bold text-[#38534D]">{metric.label}</p>
                  <p className="mt-1 text-[10px] text-[#80948F]">{metric.detail}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[285px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-md border border-[#D5E4E0] bg-white">
            <div className="border-b border-[#DCE9E5] bg-[#F8FBF9] px-4 py-3">
              <h2 className="text-sm font-bold text-[#143A35]">Escalation inbox</h2>
              <p className="mt-1 text-xs text-[#70847E]">High-priority cases only</p>
            </div>
            {doctorCases.length ? (
              doctorCases.map((item) => (
                <InboxItem
                  key={item.id}
                  careCase={item}
                  patient={snapshot?.patients.find((candidate) => candidate.id === item.patientId)}
                  active={careCase?.id === item.id}
                  onSelect={() => setSelectedCaseId(item.id)}
                />
              ))
            ) : (
              <div className="p-5 text-sm text-[#70847E]">No cases are currently assigned.</div>
            )}
          </aside>

          {careCase && patient ? (
            <div className="min-w-0">
              <section className="overflow-hidden rounded-md border border-[#D5E4E0] bg-white">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#DCE9E5] bg-[#F8FBF9] px-5 py-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold uppercase text-[#2F6F9F]">{careCase.id}</p>
                      <span className="rounded border border-[#F3B4AC] bg-[#FFF0EE] px-2 py-1 text-[10px] font-bold text-[#A63E33]">
                        {careCase.riskLevel}
                      </span>
                    </div>
                    <h2 className="mt-2 text-xl font-extrabold text-[#143A35]">{patient.name}</h2>
                    <p className="mt-1 text-xs text-[#70847E]">{patient.age} · {patient.city} · Escalated by an authorized care manager</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-md border border-[#B9D1E1] bg-[#F0F6FA] px-3 py-2 text-xs font-bold text-[#2F6F9F]">
                    <Stethoscope className="h-3.5 w-3.5" />
                    {careCase.status === "DOCTOR_REVIEWED" ? "Reviewed" : "Awaiting review"}
                  </span>
                </div>

                <div className="grid xl:grid-cols-[minmax(0,1.15fr)_390px]">
                  <div className="border-b border-[#DCE9E5] p-5 xl:border-b-0 xl:border-r">
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        { icon: HeartPulse, label: "Latest BP", value: `${patient.vitals.at(-1)?.systolic}/${patient.vitals.at(-1)?.diastolic}` },
                        { icon: Activity, label: "Heart rate", value: `${patient.vitals.at(-1)?.heartRate} bpm` },
                        { icon: FileHeart, label: "Blood glucose", value: `${patient.vitals.at(-1)?.glucose} mg/dL` },
                      ].map((metric) => {
                        const Icon = metric.icon;
                        return (
                          <div key={metric.label} className="rounded-md border border-[#DCE9E5] bg-[#F8FBF9] p-4">
                            <Icon className="h-4 w-4 text-[#2F6F9F]" />
                            <p className="mt-3 text-[10px] font-bold uppercase text-[#80948F]">{metric.label}</p>
                            <p className="mt-1 text-sm font-bold text-[#143A35]">{metric.value}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-6">
                      <VitalChart patient={patient} />
                    </div>
                  </div>

                  <aside className="p-5">
                    <h3 className="text-sm font-bold text-[#143A35]">Clinical summary sheet</h3>
                    <dl className="mt-4 grid gap-4">
                      <div>
                        <dt className="text-[10px] font-bold uppercase text-[#80948F]">Escalation reason</dt>
                        <dd className="mt-1 text-sm leading-6 text-[#536B66]">{careCase.riskReason}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase text-[#80948F]">Care-manager note</dt>
                        <dd className="mt-1 text-sm leading-6 text-[#536B66]">{sourceMessage?.text ?? careCase.contextSummary}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase text-[#80948F]">Conditions</dt>
                        <dd className="mt-1 text-sm font-semibold text-[#38534D]">{patient.conditions.join(" · ")}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase text-[#80948F]">Allergies</dt>
                        <dd className="mt-1 text-sm font-semibold text-[#A63E33]">{patient.allergies.join(" · ")}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase text-[#80948F]">Active medications</dt>
                        <dd className="mt-2 grid gap-2">
                          {medications.length ? medications.map((medication) => (
                            <span key={medication.id} className="flex items-center gap-2 text-xs text-[#536B66]">
                              <Pill className="h-3.5 w-3.5 text-[#2F6F9F]" />
                              {medication.name} · {medication.dosage}
                            </span>
                          )) : <span className="text-xs text-[#70847E]">See verified medication record</span>}
                        </dd>
                      </div>
                    </dl>
                  </aside>
                </div>
              </section>

              <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
                <div className="rounded-md border border-[#D5E4E0] bg-white p-5">
                  <div className="flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4 text-[#2F6F9F]" />
                    <h2 className="text-sm font-bold text-[#143A35]">Clinical action panel</h2>
                  </div>
                  <label className="mt-4 grid gap-1.5 text-xs font-bold text-[#536B66]">
                    Observation or clinician-authored plan
                    <textarea
                      value={observation}
                      onChange={(event) => setObservation(event.target.value)}
                      rows={5}
                      className="resize-none rounded-md border border-[#CFE0DB] p-4 text-sm font-normal leading-6 outline-none focus:border-[#2F6F9F] focus:ring-2 focus:ring-[#2F6F9F]/10"
                    />
                  </label>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => recordReview()}
                      className="flex h-12 items-center justify-center gap-2 rounded-md bg-[#2F6F9F] text-sm font-bold text-white transition hover:bg-[#275D85] disabled:opacity-50"
                    >
                      <ClipboardCheck className="h-4 w-4" />
                      Record clinical plan
                    </button>
                    <button
                      type="button"
                      disabled={busy || consultScheduled}
                      onClick={scheduleConsult}
                      className="flex h-12 items-center justify-center gap-2 rounded-md border border-[#B9D1E1] text-sm font-bold text-[#2F6F9F] transition hover:bg-[#F0F6FA] disabled:opacity-50"
                    >
                      {consultScheduled ? <CheckCircle2 className="h-4 w-4" /> : <CalendarClock className="h-4 w-4" />}
                      {consultScheduled ? "Consult scheduled" : "Schedule tele-consult"}
                    </button>
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#70847E]">
                    <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#2F6F9F]" />
                    Only the authenticated clinician can author clinical observations. Farz+ records and routes them.
                  </p>
                </div>

                <aside className="overflow-hidden rounded-md border border-[#D5E4E0] bg-white">
                  <div className="border-b border-[#DCE9E5] px-5 py-4">
                    <h2 className="text-sm font-bold text-[#143A35]">Recent patient activity</h2>
                  </div>
                  <div className="divide-y divide-[#E3ECE9]">
                    {patientFeed.map((item) => (
                      <div key={item.id} className="px-5 py-3.5">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-bold text-[#38534D]">{item.title}</p>
                          <span className="text-[10px] font-semibold text-[#80948F]">{item.timestamp}</span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-[#70847E]">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#DCE9E5] bg-[#F8FBF9] p-4">
                    <p className="flex items-start gap-2 text-xs leading-5 text-[#60756F]">
                      <UserRoundCheck className="mt-0.5 h-4 w-4 flex-none text-[#2F6F9F]" />
                      The assigned care manager remains accountable for family communication and follow-through.
                    </p>
                  </div>
                </aside>
              </section>
            </div>
          ) : (
            <div className="grid min-h-96 place-items-center rounded-md border border-[#D5E4E0] bg-white p-8 text-center">
              <div>
                <CheckCircle2 className="mx-auto h-9 w-9 text-[#08A98A]" />
                <h2 className="mt-4 text-lg font-bold text-[#143A35]">No clinical escalations</h2>
                <p className="mt-2 text-sm text-[#70847E]">The doctor inbox is clear.</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </DashboardShell>
  );
}
