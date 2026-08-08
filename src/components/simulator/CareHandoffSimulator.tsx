"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Bell, Check, ClipboardCheck, MessageCircle, ShieldCheck } from "lucide-react";

const sampleMessages = [
  {
    id: "1",
    title: "Medication question",
    text: "I think Ammi may have taken her evening blood pressure tablet twice. What should I do?",
  },
  {
    id: "2",
    title: "Dizziness after standing",
    text: "Abu says he feels dizzy after standing. Can someone check whether he should meet a doctor?",
  },
  {
    id: "3",
    title: "Lab coordination",
    text: "Can someone confirm whether today's lab report arrived?",
  },
  {
    id: "4",
    title: "Appointment support",
    text: "Can you help coordinate tomorrow's cardiology appointment?",
  },
];

export function CareHandoffSimulator() {
  const [message, setMessage] = useState(sampleMessages[0].text);
  const [selectedPreset, setSelectedPreset] = useState(sampleMessages[0].id);
  const [status, setStatus] = useState("Awaiting care manager review");
  const [conversation, setConversation] = useState<string[]>([
    "Zainab: I think Ammi may have taken her evening blood pressure tablet twice. What should I do?",
  ]);

  const requestRisk = useMemo(() => {
    if (/tablet|medicine|medication|dose/i.test(message)) {
      return "Medication-related concern detected. Route to human review.";
    }

    if (/dizzy|fall|symptom|feels|standing|weak/i.test(message)) {
      return "Symptom-related concern detected. Human review required.";
    }

    return "Routine coordination request. Family-visible workflow.";
  }, [message]);

  function handlePreset(id: string) {
    const next = sampleMessages.find((sample) => sample.id === id);
    if (!next) {
      return;
    }

    setSelectedPreset(id);
    setMessage(next.text);
    setConversation([`Zainab: ${next.text}`]);
  }

  function releaseResponse() {
    setConversation((current) => [...current, "Care manager: Family update prepared and approved by review team."]);
    setStatus("Approved family response released");
  }

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[#071922]/80 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.86fr_1fr]">
        <div className="rounded-[24px] border border-white/10 bg-[#10242b] p-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8C0C8]">Family message</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Zainab — London</h3>
            </div>
            <span className="rounded-full border border-[#38D6B0]/30 px-3 py-1 text-xs font-bold text-[#E6FAF3]">WhatsApp</span>
          </div>

          <div className="mt-5 grid gap-2">
            {sampleMessages.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handlePreset(sample.id)}
                className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
                  selectedPreset === sample.id
                    ? "border-[#38D6B0] bg-[#38D6B0]/12 text-white"
                    : "border-white/10 bg-white/[0.04] text-[#B8C0C8] hover:bg-white/[0.08]"
                }`}
              >
                {sample.title}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-[20px] border border-white/10 bg-[#07111F] p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#38D6B0]/12 text-[#7FF2DD]">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B8C0C8]">Incoming request</p>
                <p className="mt-1 text-sm font-semibold text-white">Zainab Malik</p>
              </div>
            </div>
            <textarea
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setSelectedPreset("");
              }}
              className="mt-4 min-h-[118px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-[#8896A1] focus:border-[#38D6B0]"
              aria-label="Custom family care request"
            />
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button type="button" className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/[0.06]">
              Send to Farz+
            </button>
            <button type="button" onClick={releaseResponse} className="rounded-full bg-[#E6FAF3] px-4 py-2 text-xs font-bold text-[#07111F]">
              Release approved note
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#38D6B0]/30 bg-[#07111F] p-5">
          <div className="flex items-center justify-between gap-5 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8C0C8]">Care operations inbox</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Farz+ Intake</h3>
            </div>
            <span className="rounded-full border border-[#FFB36B]/30 px-3 py-1 text-xs font-bold text-[#FFC891]">{status}</span>
          </div>

          <div className="mt-5 grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7F8A96]">Incoming request</p>
                  <p className="mt-2 text-base font-semibold text-white">Bilquis Begum · Lahore</p>
                </div>
                <ShieldCheck className="h-6 w-6 text-[#38D6B0]" />
              </div>
              <div className="mt-4 grid gap-2 text-sm text-[#B8C0C8]">
                <p><span className="text-[#E6FAF3]">Parent:</span> Bilquis Begum, age 68</p>
                <p><span className="text-[#E6FAF3]">Assigned care manager:</span> Hamza Khan</p>
                <p><span className="text-[#E6FAF3]">Current records:</span> Amlodipine 5mg; allergies: none noted</p>
              </div>
            </div>

            <div className="rounded-3xl border border-[#FFB36B]/30 bg-[#FFB36B]/8 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-[#FFC857]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FFC857]">Operational safety flag</p>
                  <p className="mt-2 text-sm font-semibold leading-7 text-white">{requestRisk}</p>
                  <p className="mt-1 text-xs text-[#B8C0C8]">Reason for review: human review required for medication or symptom context.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-[#7F8A96]">Medications</p>
                <p className="mt-2 text-sm font-semibold text-white">Amlodipine 5mg — PM</p>
                <p className="mt-1 text-xs text-[#B8C0C8]">Recorded from current prescription</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-[#7F8A96]">Care plan context</p>
                <p className="mt-2 text-sm font-semibold text-white">Cardiology check-in</p>
                <p className="mt-1 text-xs text-[#B8C0C8]">Tomorrow 10:30 AM</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Care manager actions</p>
                <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-[11px] uppercase text-[#E6FAF3]">human-led</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/[0.08]">Acknowledge</button>
                <button type="button" className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/[0.08]">Ask clarification</button>
                <button type="button" className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/[0.08]">Escalate</button>
                <button type="button" className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/[0.08]">Add internal note</button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b2530] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Family-visible response</p>
                <span className="rounded-full bg-[#38D6B0]/12 px-2 py-1 text-[11px] font-bold text-[#E6FAF3]">Review complete</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={conversation[conversation.length - 1]}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-3 text-sm leading-7 text-[#B8C0C8]"
                >
                  {conversation[conversation.length - 1]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
