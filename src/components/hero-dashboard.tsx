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
import { PakistanCoverageMap } from "@/components/pakistan-map";
import { FloatIn } from "@/components/stitch-motion";
import { GlassCard, StatusPill } from "@/components/ui";
import { realImages } from "@/lib/assets";

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
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E6FAF3]">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-3 text-sm font-semibold text-white sm:text-base">{value}</p>
    </div>
  );
}

export function PakistanSignalMap() {
  return <PakistanCoverageMap compact />;
}

export function HeroDashboard() {
  return (
    <FloatIn delay={0.15} className="relative mx-auto w-full max-w-5xl overflow-hidden">
      <div className="absolute -inset-6 rounded-[40px] bg-[#38D6B0]/12 blur-3xl" />
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
              <div className="mt-5 rounded-2xl border border-[#38D6B0]/25 bg-[#38D6B0]/10 p-4">
                <div className="flex items-center gap-3">
                  <HeartPulse className="h-5 w-5 text-[#38D6B0]" aria-hidden="true" />
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
                <MiniMetric icon={MapPin} label="Coverage" value="Pakistan" />
                <div className="rounded-2xl border border-[#80C3DC]/20 bg-[#80C3DC]/10 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9CDFF9]">Care signal</p>
                  <p className="mt-2 text-sm leading-6 text-[#D6E4F7]">
                    City pins show active family care coordination across Pakistan.
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
