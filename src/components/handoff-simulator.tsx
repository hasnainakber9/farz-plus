"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  MessageCircle,
  Send,
  ShieldAlert,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import type { CareCase, HandoffLifecycleStage } from "@/lib/platform-types";
import { cn } from "@/lib/utils";

const stageIcons = [MessageCircle, ShieldAlert, Sparkles, UserRoundCheck];

export function HandoffSimulator() {
  const reduceMotion = useReducedMotion();
  const [message, setMessage] = useState("Did Abbu take his evening blood-pressure medicine twice?");
  const [stages, setStages] = useState<HandoffLifecycleStage[]>([]);
  const [visibleStages, setVisibleStages] = useState(0);
  const [careCase, setCareCase] = useState<CareCase | null>(null);
  const [busy, setBusy] = useState(false);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState("");
  const runId = useRef(0);

  async function simulate(event: React.FormEvent) {
    event.preventDefault();
    if (message.trim().length < 3) return;
    const thisRun = ++runId.current;
    setBusy(true);
    setApproved(false);
    setCareCase(null);
    setStages([]);
    setVisibleStages(0);
    setError("");

    try {
      const response = await fetch("/api/platform/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Simulation failed.");
      setStages(payload.lifecycle);
      setCareCase(payload.careCase);
      for (let index = 1; index <= payload.lifecycle.length; index += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, reduceMotion ? 0 : 620));
        if (runId.current !== thisRun) return;
        setVisibleStages(index);
      }
    } catch (simulationError) {
      setError(simulationError instanceof Error ? simulationError.message : "Simulation failed.");
    } finally {
      if (runId.current === thisRun) setBusy(false);
    }
  }

  async function approve() {
    if (!careCase) return;
    setBusy(true);
    await new Promise((resolve) => window.setTimeout(resolve, reduceMotion ? 0 : 350));
    setApproved(true);
    setBusy(false);
  }

  return (
    <section id="handoff-simulator" className="site-surface site-border scroll-mt-20 border-b py-18 sm:py-22">
      <div className="mx-auto max-w-[1540px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)] xl:gap-12">
          <div>
            <p className="text-xs font-bold uppercase text-[#08A98A]">Try the care engine</p>
            <h2 className="site-text mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              Send one message. Watch responsibility move.
            </h2>
            <p className="site-muted mt-4 text-base leading-7">
              This educational simulator shows how Farz+ identifies risk and prepares a human handoff. Signed-in
              family requests are stored in the real care workspace; this sample does not create a production case.
            </p>

            <form onSubmit={simulate} className="mt-7">
              <label className="grid gap-2 text-xs font-bold text-[var(--site-text)]">
                Family WhatsApp message
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  className="site-surface site-border resize-none rounded-md border p-4 text-sm font-normal leading-6 text-[var(--site-text)] outline-none transition focus:border-[#08A98A] focus:ring-2 focus:ring-[#08A98A]/15"
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#006E5B] px-5 text-sm font-bold text-white transition hover:bg-[#005B4C] disabled:opacity-60"
              >
                {busy && visibleStages < 4 ? <Circle className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
                {busy && visibleStages < 4 ? "Processing sample..." : "Run sample handoff"}
              </button>
            </form>
            {error ? <p role="alert" className="mt-3 text-sm font-semibold text-[#D65748]">{error}</p> : null}
            <p className="site-muted mt-3 text-xs leading-5">
              Demonstration only. It does not diagnose, prescribe, or contact emergency services.
            </p>
          </div>

          <div className="overflow-hidden rounded-md border site-border bg-[var(--site-surface-soft)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b site-border bg-[var(--site-surface)] px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase text-[#08A98A]">Handoff room</p>
                <p className="site-text mt-1 text-sm font-bold">Synthetic family scenario · medication safety</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-md border site-border px-3 py-2 text-xs font-bold text-[var(--site-muted)]">
                <span className="h-2 w-2 rounded-full bg-[#08A98A]" />
                Educational simulator
              </span>
            </div>

            <div className="grid gap-px bg-[var(--site-line)] md:grid-cols-4">
              {(stages.length ? stages : [
                { id: "received", title: "Message received", detail: "Verified family channel", status: "complete" },
                { id: "risk", title: "Safety screening", detail: "Rules and classifier", status: "complete" },
                { id: "context", title: "Corti context", detail: "Attributable sources", status: "complete" },
                { id: "human", title: "Human decision", detail: "Approval or escalation", status: "held" },
              ] as HandoffLifecycleStage[]).map((stage, index) => {
                const Icon = stageIcons[index];
                const visible = index < visibleStages;
                return (
                  <div key={stage.id} className="site-surface min-h-[158px] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-md border",
                          visible
                            ? stage.status === "held"
                              ? "border-[#E2C675] bg-[#FFF8E7] text-[#876618]"
                              : "border-[#AFCFC7] bg-[#EAF8F4] text-[#08705F]"
                            : "site-border bg-[var(--site-surface-soft)] text-[var(--site-muted)]",
                        )}
                      >
                        {visible && stage.status === "complete" ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--site-muted)]">0{index + 1}</span>
                    </div>
                    <p className="site-text mt-4 text-sm font-bold">{stage.title}</p>
                    <p className="site-muted mt-1.5 text-xs leading-5">{stage.detail}</p>
                  </div>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {visibleStages === 4 && careCase ? (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid gap-5 border-t site-border bg-[var(--site-surface)] p-5 lg:grid-cols-[minmax(0,1fr)_250px]"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#08A98A]">
                      <Bot className="h-4 w-4" />
                      Reviewed response draft
                    </div>
                    <p className="site-muted mt-3 text-sm leading-6">{careCase.draftedResponse}</p>
                  </div>
                  <div className="flex flex-col justify-between gap-3">
                    <div className="rounded-md border border-[#E6D09A] bg-[#FFF8E7] p-3">
                      <p className="flex items-center gap-2 text-xs font-bold text-[#876618]">
                        <Clock3 className="h-3.5 w-3.5" />
                        {approved ? "Human approval simulated" : "Held for human review"}
                      </p>
                    </div>
                    {approved ? (
                      <div className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#EAF8F4] text-sm font-bold text-[#08705F]">
                        <CheckCircle2 className="h-4 w-4" />
                        Safe update released
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={approve}
                        disabled={busy}
                        className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#006E5B] text-sm font-bold text-white transition hover:bg-[#005B4C] disabled:opacity-60"
                      >
                        <UserRoundCheck className="h-4 w-4" />
                        Approve as care manager
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={false}
                  className="grid min-h-36 place-items-center border-t site-border bg-[var(--site-surface)] p-5 text-center"
                >
                  <div>
                    <p className="site-text text-sm font-bold">The care trail will appear here.</p>
                    <p className="site-muted mt-1 text-xs">Run the sample message or write your own non-sensitive scenario.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t site-border px-5 py-3">
              <p className="site-muted text-xs">Every consequential action remains attributable.</p>
              <Link href="/login?role=care-manager" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08A98A]">
                Open full care workspace <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
