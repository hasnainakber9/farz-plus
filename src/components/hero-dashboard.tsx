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
import Image from "next/image";
import { CareScoreRing } from "@/components/care-score-ring";
import { FloatIn, SignalPulse } from "@/components/stitch-motion";
import { GlassCard, StatusPill } from "@/components/ui";
import { realImages } from "@/lib/assets";

const nodes = [
  { city: "Islamabad", x: "67%", y: "20%", tone: "bg-[#80C3DC]" },
  { city: "Rawalpindi", x: "62%", y: "28%", tone: "bg-[#80C3DC]" },
  { city: "Lahore", x: "58%", y: "47%", tone: "bg-[#4CD364]" },
  { city: "Karachi", x: "24%", y: "79%", tone: "bg-[#4CD364]" },
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A0E7B4]">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-3 text-sm font-semibold text-white sm:text-base">{value}</p>
    </div>
  );
}

export function PakistanSignalMap() {
  return (
    <div className="relative min-h-72 overflow-hidden rounded-3xl border border-white/10 bg-[#061422]/80 p-5">
      <div className="absolute inset-0 grid-texture opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_30%,rgba(128,195,220,0.18),transparent_35%),radial-gradient(circle_at_34%_76%,rgba(76,211,100,0.16),transparent_25%)]" />
      <div className="absolute left-[30%] top-[12%] h-[72%] w-[42%] rounded-[48%_52%_45%_55%] border border-[#80C3DC]/20 bg-[#0E4B82]/10 blur-[1px]" />
      <svg className="absolute inset-x-6 top-16 h-36 w-[calc(100%-3rem)] text-[#4CD364]" viewBox="0 0 420 150" aria-hidden="true">
        <path
          className="heartbeat"
          d="M5 90 L65 90 L82 60 L98 116 L116 78 L147 78 L166 90 L221 90 L242 48 L263 112 L284 72 L318 72 L338 90 L415 90"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          opacity="0.62"
        />
      </svg>
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#A0E7B4]">Pakistan care signal</p>
          <h3 className="mt-2 max-w-56 text-xl font-semibold text-white">Islamabad pilot, national roadmap</h3>
        </div>
        <StatusPill tone="info">Live nodes</StatusPill>
      </div>
      {nodes.map((node) => (
        <div key={node.city} className="absolute z-10" style={{ left: node.x, top: node.y }}>
          <SignalPulse className={`block h-4 w-4 rounded-full ${node.tone} shadow-[0_0_28px_rgba(76,211,100,0.6)]`} />
          <span className="mt-2 block rounded-full border border-white/10 bg-[#050410]/82 px-2 py-1 text-[10px] font-semibold text-white">
            {node.city}
          </span>
        </div>
      ))}
    </div>
  );
}

export function HeroDashboard() {
  return (
    <FloatIn delay={0.15} className="relative mx-auto w-full max-w-5xl overflow-hidden">
      <div className="absolute -inset-6 rounded-[40px] bg-[#4CD364]/12 blur-3xl" />
      <div className="absolute -right-10 top-16 h-40 w-40 rounded-full bg-[#80C3DC]/20 blur-3xl" />
      <GlassCard className="float-3d relative overflow-hidden rounded-[32px] p-3 sm:p-5">
        <div className="absolute inset-0 grid-texture opacity-35" />
        <div className="absolute inset-x-0 top-0 h-px scan-line" />
        <div className="relative grid gap-4 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#020F1C]/80">
            <div className="relative h-72 sm:h-full">
              <Image
                alt={realImages.elderPortrait.alt}
                src={realImages.elderPortrait.src}
                fill
                priority
                sizes="(min-width: 1024px) 360px, 100vw"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020F1C] via-[#020F1C]/45 to-transparent" />
              <div className="absolute inset-0 bg-[#061422]/20 mix-blend-multiply" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#80C3DC]">Ammi - Lahore</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Dignity at home, visible to family.</h2>
                <p className="mt-2 text-xs text-[#B8C0C8]">
                  Check-ins, medicines, appointments, and family updates coordinated by one care manager.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[26px] border border-white/10 bg-[#061422]/78 p-5">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <StatusPill>Stable</StatusPill>
                  <h2 className="mt-4 text-2xl font-semibold text-white">Ammi - Lahore</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#B8C0C8]">
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
              <div className="mt-5 rounded-2xl border border-[#4CD364]/25 bg-[#4CD364]/10 p-4">
                <div className="flex items-center gap-3">
                  <HeartPulse className="h-5 w-5 text-[#4CD364]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-white">AI care signal</p>
                    <p className="text-sm text-[#B8C0C8]">No missed critical tasks detected this morning.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_0.72fr]">
              <PakistanSignalMap />
              <div className="grid gap-3">
                <MiniMetric icon={MessageCircle} label="WhatsApp" value="Dubai + Karachi" />
                <MiniMetric icon={MapPin} label="MVP market" value="Islamabad + Rawalpindi" />
                <div className="rounded-2xl border border-[#80C3DC]/20 bg-[#80C3DC]/10 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9CDFF9]">Care signal</p>
                  <p className="mt-2 text-sm leading-6 text-[#D6E4F7]">
                    Islamabad pilot coverage with Rawalpindi hospital coordination when needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </FloatIn>
  );
}
