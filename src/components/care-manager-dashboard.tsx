"use client";

import {
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  MessageCircle,
  Pill,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useCareOperations } from "@/hooks/use-care-operations";
import type { CaseStatus, MedicationStatus, Patient, RiskLevel } from "@/lib/platform-types";
import { cn } from "@/lib/utils";

const riskStyles: Record<RiskLevel, string> = {
  STABLE: "border-[#AFCFC7] bg-[#EAF8F4] text-[#08705F]",
  ATTENTION: "border-[#E6D09A] bg-[#FFF8E7] text-[#876618]",
  CRITICAL: "border-[#F3B4AC] bg-[#FFF0EE] text-[#A63E33]",
};

const caseStatusLabel: Record<CaseStatus, string> = {
  PENDING_APPROVAL: "Awaiting human",
  APPROVED: "Approved",
  ESCALATED_TO_DOCTOR: "Doctor review",
  DOCTOR_REVIEWED: "Doctor reviewed",
};

function PatientQueueItem({
  patient,
  active,
  openCases,
  onSelect,
}: {
  patient: Patient;
  active: boolean;
  openCases: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full border-b border-[#E3ECE9] p-4 text-left transition last:border-b-0",
        active ? "bg-[#F0F8F5]" : "bg-white hover:bg-[#F8FBF9]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#143A35]">{patient.name}</p>
          <p className="mt-1 text-xs text-[#70847E]">{patient.age} Â· {patient.city}</p>
        </div>
        <ChevronRight className={cn("h-4 w-4 flex-none", active ? "text-[#087B69]" : "text-[#9AADAA]")} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className={cn("rounded border px-2 py-1 text-[10px] font-bold", riskStyles[patient.riskLevel])}>
          {patient.riskLevel}
        </span>
        <span className="text-[10px] font-semibold text-[#80948F]">{openCases} open handoff{openCases === 1 ? "" : "s"}</span>
      </div>
    </button>
  );
}

export function CareManagerDashboard({ name }: { name: string }) {
  const { snapshot, connected, error, updateCase, updateMedication } = useCareOperations();
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [draftOverride, setDraftOverride] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");

  const activePatientId = snapshot?.patients.some((item) => item.id === selectedPatientId)
    ? selectedPatientId
    : snapshot?.patients[0]?.id ?? "";
  const patient = snapshot?.patients.find((item) => item.id === activePatientId);
  const activeCase = snapshot?.cases.find((item) => item.patientId === activePatientId);
  const sourceMessage = snapshot?.messages.find((item) => item.id === activeCase?.sourceMessageId);
  const patientMedications = snapshot?.medications.filter((item) => item.patientId === activePatientId) ?? [];
  const patientFeed = snapshot?.feed.filter((item) => item.patientId === activePatientId).slice(0, 5) ?? [];
  const draft = draftOverride ?? activeCase?.draftedResponse ?? "";

  const queueStats = useMemo(() => {
    const patients = snapshot?.patients ?? [];
    return {
      total: patients.length,
      urgent: patients.filter((item) => item.riskLevel === "CRITICAL").length,
      pending: snapshot?.cases.filter((item) => item.status === "PENDING_APPROVAL").length ?? 0,
    };
  }, [snapshot]);

  async function decide(action: "APPROVE" | "ESCALATE") {
    if (!activeCase) return;
    setBusy(action);
    try {
      await updateCase(activeCase.id, { action, draftedResponse: draft, note });
      setNotice(action === "APPROVE" ? "Response approved and added to the family delivery queue." : "Case escalated to the clinician queue.");
    } catch (decisionError) {
      setNotice(decisionError instanceof Error ? decisionError.message : "Unable to update case.");
    } finally {
      setBusy("");
    }
  }

  async function markMedication(id: string, status: MedicationStatus) {
    setBusy(id);
    try {
      await updateMedication(id, status);
      setNotice(`MAR updated: ${status.toLowerCase()}.`);
    } finally {
      setBusy("");
    }
  }

  return (
    <DashboardShell
      role="CARE_MANAGER"
      name={name}
      title="Care operations"
      subtitle="Live patient queue Â· assigned records only"
      connected={connected}
    >
      <main className="mx-auto max-w-[1680px] p-4 sm:p-5">
        {notice ? (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-md border border-[#AFCFC7] bg-[#EAF8F4] px-4 py-3 text-sm font-semibold text-[#08705F]">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} className="text-xs font-bold">Dismiss</button>
          </div>
        ) : null}
        {error ? <p className="mb-4 rounded-md border border-[#FFC1BA] bg-[#FFF0EE] p-3 text-sm text-[#A93931]">{error}</p> : null}

        <section className="grid gap-px overflow-hidden rounded-md border border-[#D5E4E0] bg-[#DCE9E5] sm:grid-cols-3">
          {[
            { label: "Assigned elders", value: queueStats.total, icon: Users, detail: "Records assigned to your queue" },
            { label: "Urgent now", value: queueStats.urgent, icon: ShieldAlert, detail: "Named human response required" },
            { label: "Pending approvals", value: queueStats.pending, icon: UserRoundCheck, detail: "Consequential replies held" },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="flex min-h-28 items-center gap-4 bg-white p-5">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-md bg-[#EAF8F4] text-[#087B69]">
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

        <section id="handoff" className="mt-4 grid gap-4 xl:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-md border border-[#D5E4E0] bg-white">
            <div className="border-b border-[#DCE9E5] bg-[#F8FBF9] px-4 py-3">
              <h2 className="text-sm font-bold text-[#143A35]">Active patient queue</h2>
              <p className="mt-1 text-xs text-[#70847E]">Sorted by current risk</p>
            </div>
            <div>
              {(snapshot?.patients ?? []).map((queuePatient) => (
                <PatientQueueItem
                  key={queuePatient.id}
                  patient={queuePatient}
                  active={queuePatient.id === activePatientId}
                  openCases={snapshot?.cases.filter((item) => item.patientId === queuePatient.id && item.status !== "APPROVED").length ?? 0}
                  onSelect={() => {
                    setSelectedPatientId(queuePatient.id);
                    setDraftOverride(null);
                    setNote("");
                  }}
                />
              ))}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="rounded-md border border-[#D5E4E0] bg-white">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#DCE9E5] bg-[#F8FBF9] px-5 py-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold uppercase text-[#087B69]">{activeCase?.id ?? "No open handoff"}</p>
                    {activeCase ? (
                      <span className={cn("rounded border px-2 py-1 text-[10px] font-bold", riskStyles[activeCase.riskLevel])}>
                        {activeCase.riskLevel}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-2 text-xl font-extrabold text-[#143A35]">{patient?.name ?? "Select a patient"}</h2>
                  <p className="mt-1 text-xs text-[#70847E]">{patient?.city} Â· Assigned to {name}</p>
                </div>
                {activeCase ? (
                  <span className="inline-flex items-center gap-2 rounded-md border border-[#D5E4E0] bg-white px-3 py-2 text-xs font-bold text-[#536B66]">
                    <Clock3 className="h-3.5 w-3.5" />
                    {caseStatusLabel[activeCase.status]}
                  </span>
                ) : null}
              </div>

              {activeCase ? (
                <div className="grid xl:grid-cols-2">
                  <section className="border-b border-[#DCE9E5] p-5 xl:border-b-0 xl:border-r">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#70847E]">
                      <MessageCircle className="h-4 w-4 text-[#08A98A]" />
                      Original WhatsApp message
                    </div>
                    <div className="mt-3 rounded-md border border-[#C9E5DE] bg-[#EAF8F4] p-4">
                      <p className="text-sm leading-6 text-[#244B44]">{sourceMessage?.text ?? "No source message attached."}</p>
                      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#60756F]">
                        <span>{sourceMessage?.sender ?? "Family"}</span>
                        <span>{sourceMessage?.timestamp ?? activeCase.updatedAt}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase text-[#70847E]">
                      <Bot className="h-4 w-4 text-[#2F6F9F]" />
                      AI risk analysis and context
                    </div>
                    <div className="mt-3 overflow-hidden rounded-md border border-[#D5E4E0]">
                      <div className="border-b border-[#E3ECE9] bg-[#FFF8E7] p-4">
                        <p className="flex items-start gap-2 text-sm font-bold text-[#876618]">
                          <ShieldAlert className="mt-0.5 h-4 w-4 flex-none" />
                          {activeCase.riskReason}
                        </p>
                      </div>
                      <div className="p-4">
                        <p className="text-sm leading-6 text-[#536B66]">{activeCase.contextSummary}</p>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {[
                            "Sources attributable",
                            "No diagnosis generated",
                            "Policy boundary active",
                            "Human approval required",
                          ].map((item) => (
                            <p key={item} className="flex items-center gap-2 text-xs font-semibold text-[#60756F]">
                              <Check className="h-3.5 w-3.5 text-[#08A98A]" />
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#70847E]">
                        <Sparkles className="h-4 w-4 text-[#08A98A]" />
                        Drafted family response
                      </div>
                      <span className="text-[10px] font-bold text-[#80948F]">Editable</span>
                    </div>
                    <textarea
                      value={draft}
                      onChange={(event) => setDraftOverride(event.target.value)}
                      rows={8}
                      className="mt-3 w-full resize-none rounded-md border border-[#CFE0DB] p-4 text-sm leading-6 text-[#38534D] outline-none transition focus:border-[#08A98A] focus:ring-2 focus:ring-[#08A98A]/15"
                    />
                    <label className="mt-4 grid gap-1.5 text-xs font-bold text-[#536B66]">
                      Internal handoff note
                      <input
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Optional reason or clinician question"
                        className="h-11 rounded-md border border-[#CFE0DB] px-3 text-sm outline-none focus:border-[#08A98A]"
                      />
                    </label>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        disabled={busy !== "" || activeCase.status === "APPROVED"}
                        onClick={() => decide("APPROVE")}
                        className="flex h-12 items-center justify-center gap-2 rounded-md bg-[#006E5B] px-4 text-sm font-bold text-white transition hover:bg-[#005B4C] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {busy === "APPROVE" ? <Circle className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
                        Approve & send
                      </button>
                      <button
                        type="button"
                        disabled={busy !== ""}
                        onClick={() => decide("ESCALATE")}
                        className="flex h-12 items-center justify-center gap-2 rounded-md border border-[#AFC5D5] bg-white px-4 text-sm font-bold text-[#2F6F9F] transition hover:bg-[#F0F6FA] disabled:opacity-50"
                      >
                        <Stethoscope className="h-4 w-4" />
                        Escalate to doctor
                      </button>
                    </div>
                    <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#70847E]">
                      <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#087B69]" />
                      Farz+ coordinates care. Dosing changes and clinical decisions remain with licensed professionals.
                    </p>
                  </section>
                </div>
              ) : (
                <div className="grid min-h-80 place-items-center p-8 text-center">
                  <div>
                    <CheckCircle2 className="mx-auto h-8 w-8 text-[#08A98A]" />
                    <h3 className="mt-4 text-lg font-bold text-[#143A35]">No handoff waiting</h3>
                    <p className="mt-2 text-sm text-[#70847E]">This patient has no active family inquiry.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
              <section className="overflow-hidden rounded-md border border-[#D5E4E0] bg-white">
                <div className="border-b border-[#DCE9E5] px-5 py-4">
                  <h2 className="text-sm font-bold text-[#143A35]">Daily MAR</h2>
                  <p className="mt-1 text-xs text-[#70847E]">Medication administration record Â· {patient?.name ?? "No parent selected"}</p>
                </div>
                {patientMedications.length ? (
                  <div className="divide-y divide-[#E3ECE9]">
                    {patientMedications.map((medication) => (
                      <div key={medication.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-md bg-[#EAF8F4] text-[#087B69]">
                            <Pill className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-[#143A35]">{medication.name}</p>
                            <p className="mt-1 text-xs text-[#70847E]">{medication.dosage} Â· {medication.time}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busy === medication.id}
                            onClick={() => markMedication(medication.id, "TAKEN")}
                            className={cn(
                              "grid h-9 w-9 place-items-center rounded-md border",
                              medication.status === "TAKEN"
                                ? "border-[#08A98A] bg-[#08A98A] text-white"
                                : "border-[#AFCFC7] text-[#08705F] hover:bg-[#EAF8F4]",
                            )}
                            aria-label={`Mark ${medication.name} taken`}
                            title="Taken"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            disabled={busy === medication.id}
                            onClick={() => markMedication(medication.id, "MISSED")}
                            className={cn(
                              "grid h-9 w-9 place-items-center rounded-md border",
                              medication.status === "MISSED"
                                ? "border-[#B4493C] bg-[#B4493C] text-white"
                                : "border-[#E8C8C3] text-[#A63E33] hover:bg-[#FFF0EE]",
                            )}
                            aria-label={`Mark ${medication.name} missed`}
                            title="Missed"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-5 text-sm text-[#70847E]">No medications have been recorded for this parent.</p>
                )}
              </section>

              <aside className="overflow-hidden rounded-md border border-[#D5E4E0] bg-white">
                <div className="border-b border-[#DCE9E5] px-5 py-4">
                  <h2 className="text-sm font-bold text-[#143A35]">Recent care log</h2>
                </div>
                <div className="divide-y divide-[#E3ECE9]">
                  {patientFeed.map((item) => (
                    <div key={item.id} className="px-5 py-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-bold text-[#38534D]">{item.title}</p>
                        <span className="text-[10px] font-semibold text-[#80948F]">{item.timestamp}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-[#70847E]">{item.actor}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}
