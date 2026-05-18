import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  Ambulance,
  BellRing,
  ClipboardCheck,
  FileHeart,
  Hospital,
  KeyRound,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { EmergencyButton } from "@/components/emergency-button";
import { CountingBar } from "@/components/stitch-motion";
import { DisclaimerBox, GlassCard, PrimaryButton, SectionHeading, Shell, StatusPill } from "@/components/ui";
import { demoElder } from "@/lib/content";
import { realImages } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Emergency Support",
  description: "Farz+ emergency readiness and family call-tree coordination.",
};

const protocolCards = [
  {
    icon: BellRing,
    title: "SOS and call-tree activation",
    detail: "Confirm urgency, notify the approved family contacts, and start the case timeline.",
  },
  {
    icon: Ambulance,
    title: "Ambulance coordination",
    detail: "Coordinate with the preferred ambulance desk or route to the closest available provider.",
  },
  {
    icon: Hospital,
    title: "Hospital routing",
    detail: "Use preferred and nearest hospitals while keeping family decision-makers informed.",
  },
  {
    icon: FileHeart,
    title: "Approved medical profile",
    detail: "Share allergies, medicines, blood group, conditions, and doctor details with approved contacts.",
  },
  {
    icon: UsersRound,
    title: "Family live updates",
    detail: "Care manager keeps Dubai, Karachi, and local contacts aligned until closure.",
  },
  {
    icon: ClipboardCheck,
    title: "Post-case summary",
    detail: "A closure report documents actions, timings, partners, bills, and recommended follow-up.",
  },
] as const;

const emergencyEvents = [
  { time: "00:00", title: "SOS received", detail: "Incident opened from elder screen or care-manager report.", tone: "risk" },
  { time: "00:45", title: "Urgency verified", detail: "Care manager calls parent, neighbor, or local contact.", tone: "watch" },
  { time: "02:10", title: "Family call tree started", detail: "Hamza in Dubai and Sana in Karachi notified by phone and WhatsApp.", tone: "info" },
  { time: "04:30", title: "Ambulance desk contacted", detail: "Nearest verified responder asked for ETA and destination readiness.", tone: "risk" },
  { time: "07:20", title: "Hospital route confirmed", detail: "Preferred hospital checked first; nearest backup held ready.", tone: "stable" },
  { time: "Closure", title: "Report generated", detail: "Care manager logs actions, bills, notes, and next steps.", tone: "neutral" },
] as const;

const accessItems = [
  ["Primary decision-maker", demoElder.emergencyPlan.primaryDecisionMaker],
  ["Secondary contact", demoElder.emergencyPlan.secondaryContact],
  ["Preferred hospital", demoElder.emergencyPlan.preferredHospital],
  ["Nearest hospital", demoElder.emergencyPlan.nearestHospital],
  ["Ambulance provider", demoElder.emergencyPlan.ambulanceProvider],
  ["Doctor contact", demoElder.emergencyPlan.doctorContact],
  ["Blood group", demoElder.emergencyPlan.bloodGroup],
  ["Allergies", demoElder.emergencyPlan.allergies.join(", ")],
  ["Chronic conditions", demoElder.emergencyPlan.chronicConditions.join(", ")],
  ["Home access", demoElder.emergencyPlan.homeAccessInstructions],
] as const;

export default function EmergencySupportPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-16 sm:pb-24 sm:pt-24">
        <div className="absolute inset-0 grid-texture opacity-35" />
        <div className="absolute inset-x-0 top-0 h-px emergency-sweep" />
        <div className="absolute left-1/2 top-8 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[#FF4D5A]/12 blur-3xl" />
        <Shell className="relative">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <StatusPill tone="risk">Emergency readiness</StatusPill>
              <h1 className="mt-6 max-w-[22rem] text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:max-w-none sm:text-6xl">
                When something happens, everyone knows what to do.
              </h1>
              <p className="mt-6 max-w-[22rem] text-base leading-8 text-[#D7DEE6] sm:max-w-none sm:text-lg">
                Farz+ prepares a consent-based emergency profile before it is needed, then helps coordinate the family call tree,
                hospital routing, ambulance desk communication, and post-case reporting.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <EmergencyButton className="w-full max-w-[22rem] sm:w-auto" />
                <PrimaryButton href="/contact" className="w-full max-w-[22rem] sm:w-auto">Book Emergency Setup</PrimaryButton>
              </div>
              <p className="mt-5 max-w-[22rem] text-sm leading-7 text-[#FFCDD2] sm:max-w-xl">
                For immediate medical danger, families should contact local emergency services directly. Farz+ coordinates approved support around them.
              </p>
            </div>
            <EmergencyCommandCenter />
          </div>
        </Shell>
      </section>

      <section className="pb-20">
        <Shell>
          <SectionHeading eyebrow="Emergency protocol" title="A managed response flow with proof at every step." align="center">
            <p>
              The protocol is built for Pakistani family realities: overseas decision-makers, neighbor backup, preferred hospitals,
              local ambulance desks, and care-manager updates over phone and WhatsApp.
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {protocolCards.map((card) => (
              <ProtocolCard key={card.title} {...card} />
            ))}
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <GlassCard className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <StatusPill tone="info">Family call tree</StatusPill>
                  <h2 className="mt-4 text-2xl font-semibold text-white">Approved contacts and access details</h2>
                </div>
                <ShieldCheck className="h-7 w-7 text-[#4CD364]" aria-hidden="true" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {accessItems.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7F8A96]">{label}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white">{value}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
            <div className="grid gap-5">
              <GlassCard className="p-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full border border-[#FF4D5A]/25 bg-[#FF4D5A]/12">
                    <ShieldAlert className="h-6 w-6 text-[#FF9BA3]" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Accidental SOS protection</h2>
                    <p className="mt-1 text-sm text-[#B8C0C8]">Confirmation is required before escalation starts.</p>
                  </div>
                </div>
                <div className="mt-6">
                  <EmergencyButton className="w-full sm:w-auto" />
                </div>
              </GlassCard>
              <DisclaimerBox />
            </div>
          </div>
        </Shell>
      </section>
    </>
  );
}

function EmergencyCommandCenter() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[36px] bg-[#FF4D5A]/10 blur-3xl" />
      <GlassCard className="relative overflow-hidden rounded-[32px] p-3 sm:p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,77,90,0.2),transparent_30%),radial-gradient(circle_at_18%_82%,rgba(128,195,220,0.12),transparent_32%)]" />
        <div className="absolute inset-x-0 top-0 h-px emergency-sweep" />
        <div className="relative grid gap-4 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#16090E]/84">
            <div className="relative h-64">
              <Image
                alt={realImages.elderPortrait.alt}
                src={realImages.elderPortrait.src}
                fill
                sizes="(min-width: 1280px) 320px, (min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16090E] via-[#16090E]/45 to-transparent" />
              <div className="absolute left-4 top-4">
                <StatusPill tone="risk">Protocol Active</StatusPill>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#FFB4AB]">Ammi - Lahore</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Emergency file ready</h2>
              </div>
            </div>
            <div className="grid gap-3 p-5">
              <EmergencyMetric icon={Hospital} label="Route" value="Shifa preferred" />
              <EmergencyMetric icon={MapPin} label="Fallback" value="Ali Medical Centre" />
              <EmergencyMetric icon={KeyRound} label="Home access" value="Neighbor backup verified" />
            </div>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-[#061422]/82 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4D5A] opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-[#FF4D5A]" />
                  </span>
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#FFB4AB]">Emergency timeline</p>
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-white">Live coordination console</h3>
              </div>
              <div className="rounded-2xl border border-[#FF4D5A]/25 bg-[#FF4D5A]/12 px-4 py-3 text-right">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#FFB4AB]">Elapsed</p>
                <p className="mt-1 font-mono text-xl font-semibold text-white">07:20</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {emergencyEvents.map((event, index) => (
                <div key={event.title} className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                  <div>
                    <p className="font-mono text-xs text-[#FFB4AB]">{event.time}</p>
                    <div className="mt-2 h-full w-px bg-gradient-to-b from-[#FF4D5A] to-transparent" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-white">{index + 1}. {event.title}</p>
                      <StatusPill tone={event.tone}>{event.tone === "risk" ? "Urgent" : event.tone === "watch" ? "Verify" : "Logged"}</StatusPill>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#B8C0C8]">{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-[#FF4D5A]/25 bg-[#FF4D5A]/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#FFB4AB]">Responder ETA confidence</span>
                <span className="font-mono text-sm text-white">74%</span>
              </div>
              <div className="mt-3">
                <CountingBar width="74%" />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function ProtocolCard({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return (
    <GlassCard className="p-5">
      <Icon className="h-6 w-6 text-[#FF9BA3]" aria-hidden="true" />
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#B8C0C8]">{detail}</p>
    </GlassCard>
  );
}

function EmergencyMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <Icon className="h-5 w-5 flex-none text-[#FF9BA3]" aria-hidden="true" />
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#FFB4AB]">{label}</p>
        <p className="mt-1 text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
