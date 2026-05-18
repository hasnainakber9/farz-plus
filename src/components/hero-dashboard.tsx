import {
  Activity,
  CalendarClock,
  HeartPulse,
  MapPin,
  MessageCircle,
  Pill,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { CareScoreRing } from "@/components/care-score-ring";
import { GlassCard, StatusPill } from "@/components/ui";
import { demoElder } from "@/lib/content";

const nodes = [
  { city: "Karachi", x: "24%", y: "78%" },
  { city: "Lahore", x: "62%", y: "37%" },
  { city: "Islamabad", x: "66%", y: "22%" },
  { city: "Rawalpindi", x: "61%", y: "27%" },
];

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#A0E7B4]">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-3 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

export function PakistanSignalMap() {
  return (
    <div className="relative min-h-72 overflow-hidden rounded-[28px] border border-white/10 bg-[#06102C]/70 p-5">
      <div className="absolute inset-0 grid-texture opacity-70" />
      <div className="absolute left-[28%] top-[12%] h-[72%] w-[44%] rounded-[48%_52%_45%_55%] border border-[#43B0C1]/20 bg-[#0E4B82]/10 blur-[1px]" />
      <svg className="absolute inset-x-6 top-16 h-36 w-[calc(100%-3rem)] text-[#4CD364]" viewBox="0 0 420 150" aria-hidden="true">
        <path
          className="heartbeat"
          d="M5 90 L65 90 L82 60 L98 116 L116 78 L147 78 L166 90 L221 90 L242 48 L263 112 L284 72 L318 72 L338 90 L415 90"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          opacity="0.55"
        />
      </svg>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#A0E7B4]">Pakistan care signal</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Islamabad pilot, national roadmap</h3>
        </div>
        <StatusPill tone="info">Live nodes</StatusPill>
      </div>
      {nodes.map((node) => (
        <div
          key={node.city}
          className="absolute z-10"
          style={{ left: node.x, top: node.y }}
        >
          <span className="pulse-care block h-3.5 w-3.5 rounded-full bg-[#4CD364]" />
          <span className="mt-2 block rounded-full border border-white/10 bg-[#050410]/80 px-2 py-1 text-[10px] font-semibold text-white">
            {node.city}
          </span>
        </div>
      ))}
    </div>
  );
}

export function HeroDashboard() {
  return (
    <div className="relative max-w-full overflow-hidden">
      <div className="absolute -inset-8 rounded-full bg-[#4CD364]/15 blur-3xl" />
      <div className="absolute -right-10 top-10 h-36 w-36 rounded-full bg-[#43B0C1]/20 blur-3xl" />
      <GlassCard className="relative overflow-hidden rounded-[32px] p-4 sm:p-5">
        <div className="absolute inset-0 grid-texture opacity-40" />
        <div className="relative grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[26px] border border-white/10 bg-[#050410]/55 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <StatusPill>Stable</StatusPill>
                <h2 className="mt-4 text-2xl font-semibold text-white">{demoElder.name} - {demoElder.city}</h2>
                <p className="mt-2 text-sm leading-6 text-[#B8C0C8]">
                  Last check-in today at 9:30 AM. Family update sent to Dubai + Karachi.
                </p>
              </div>
              <CareScoreRing score={88} size="sm" label="Stable" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MiniMetric icon={Pill} label="Medicine" value="Completed" />
              <MiniMetric icon={CalendarClock} label="Next appointment" value="Thursday" />
              <MiniMetric icon={ShieldCheck} label="Emergency plan" value="Active" />
              <MiniMetric icon={UserRoundCheck} label="Care manager" value="Ayesha" />
            </div>
            <div className="mt-5 rounded-3xl border border-[#4CD364]/25 bg-[#4CD364]/10 p-4">
              <div className="flex items-center gap-3">
                <HeartPulse className="h-5 w-5 text-[#4CD364]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-white">AI care signal</p>
                  <p className="text-sm text-[#B8C0C8]">No missed critical tasks detected this morning.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <PakistanSignalMap />
            <div className="grid gap-3 sm:grid-cols-2">
              <MiniMetric icon={MessageCircle} label="WhatsApp" value="Dubai + Karachi" />
              <MiniMetric icon={MapPin} label="MVP market" value="Islamabad + Rawalpindi" />
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
