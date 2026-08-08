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
import { DisclaimerBox, GlassCard, PrimaryButton, SectionHeading, Shell, StatusPill } from "@/components/ui";
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
  { time: "Step 01", title: "Urgent request received", detail: "The family or care team opens an urgent Farz+ case.", tone: "risk" },
  { time: "Step 02", title: "Automated notice shown", detail: "The person is directed to local emergency services and the recorded emergency contact.", tone: "watch" },
  { time: "Step 03", title: "Human owner assigned", detail: "A care manager reviews the original message and available consent-scoped context.", tone: "info" },
  { time: "Step 04", title: "Contact route confirmed", detail: "The team confirms which family contact or local service can act in this case.", tone: "risk" },
  { time: "Step 05", title: "Updates recorded", detail: "Actions, decisions, and family updates stay in the case timeline.", tone: "stable" },
  { time: "Step 06", title: "Closure recorded", detail: "The final outcome and any follow-up request are documented.", tone: "neutral" },
] as const;

const accessItems = [
  ["Primary contact", "Added to your private household"],
  ["Secondary contact", "Optional family member"],
  ["Preferred hospital", "Added only when your family records it"],
  ["Local emergency number", "Use the number for your location"],
  ["Ambulance availability", "Confirmed case by case"],
  ["Clinical information", "Visible only after recorded consent"],
  ["Home access", "Added by the family when relevant"],
  ["Document sharing", "Private and consent-scoped"],
] as const;

export default function EmergencySupportPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[#DCE9E5] bg-white pb-16 pt-16 sm:pb-24 sm:pt-24">
        <div className="absolute inset-0 grid-texture opacity-35" />
        <div className="absolute inset-x-0 top-0 h-px emergency-sweep" />
        <Shell className="relative">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <StatusPill tone="risk">Emergency readiness</StatusPill>
              <h1 className="mt-6 max-w-[22rem] text-balance text-4xl font-semibold leading-tight text-[#143A35] sm:max-w-none sm:text-6xl">
                When something happens, everyone knows what to do.
              </h1>
              <p className="mt-6 max-w-[22rem] text-base leading-8 text-[#536B66] sm:max-w-none sm:text-lg">
                Farz+ prepares a consent-based emergency profile before it is needed, then helps coordinate the family call tree,
                hospital routing, ambulance desk communication, and post-case reporting.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <EmergencyButton className="w-full max-w-[22rem] sm:w-auto" />
                <PrimaryButton href="/contact" className="w-full max-w-[22rem] sm:w-auto">Book Emergency Setup</PrimaryButton>
              </div>
              <p className="mt-5 max-w-[22rem] text-sm leading-7 text-[#8E4039] sm:max-w-xl">
                For immediate medical danger, families should contact local emergency services directly. Farz+ coordinates approved support around them.
              </p>
            </div>
            <EmergencyCommandCenter />
          </div>
        </Shell>
      </section>

      <section className="bg-[#F8FBF9] pb-20 pt-16">
        <Shell>
          <SectionHeading eyebrow="Emergency protocol" title="A managed response flow with proof at every step." align="center">
            <p>
              The protocol is built for Pakistani family realities: overseas decision-makers, neighbor backup, preferred hospitals,
              local service availability, and care-manager updates through the Farz+ in-app channel.
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
                  <h2 className="mt-4 text-2xl font-semibold text-[#143A35]">Approved contacts and access details</h2>
                </div>
                <ShieldCheck className="h-7 w-7 text-[#38D6B0]" aria-hidden="true" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {accessItems.map(([label, value]) => (
                  <div key={label} className="rounded-md border border-[#D5E4E0] bg-[#F8FBF9] p-4">
                    <p className="text-[11px] font-bold uppercase text-[#70847E]">{label}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[#274A43]">{value}</p>
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
                    <h2 className="text-2xl font-semibold text-[#143A35]">Accidental SOS protection</h2>
                    <p className="mt-1 text-sm text-[#60756F]">Confirmation is required before escalation starts.</p>
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
      <div className="relative overflow-hidden rounded-lg border border-[#274C47] bg-[#143A35] p-3 shadow-[0_28px_80px_rgba(20,58,53,0.18)] sm:p-5">
        <div className="absolute inset-x-0 top-0 h-px emergency-sweep" />
        <div className="relative grid gap-4 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="overflow-hidden rounded-md border border-white/15 bg-[#2A1719]">
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
                <StatusPill tone="info">Illustrative flow</StatusPill>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#FFB4AB]">Synthetic family scenario</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Emergency profile ready</h2>
              </div>
            </div>
            <div className="grid gap-3 p-5">
              <EmergencyMetric icon={Hospital} label="Route" value="Confirmed per household" />
              <EmergencyMetric icon={MapPin} label="Availability" value="Checked case by case" />
              <EmergencyMetric icon={KeyRound} label="Home access" value="Recorded by the family" />
            </div>
          </div>
          <div className="rounded-md border border-white/15 bg-[#0E2E2A] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4D5A] opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-[#FF4D5A]" />
                  </span>
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#FFB4AB]">Illustrative timeline</p>
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-white">A human-owned response flow</h3>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {emergencyEvents.map((event, index) => (
                <div key={event.title} className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-md border border-white/10 bg-white/[0.045] p-3">
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
            <p className="mt-5 rounded-md border border-white/10 bg-white/[0.045] p-4 text-xs leading-5 text-[#B8C0C8]">Illustrative only. Farz+ does not guarantee dispatch, arrival times, hospital acceptance, or clinical outcomes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtocolCard({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return (
    <GlassCard className="p-5">
      <Icon className="h-6 w-6 text-[#FF9BA3]" aria-hidden="true" />
      <h3 className="mt-5 text-xl font-semibold text-[#143A35]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#60756F]">{detail}</p>
    </GlassCard>
  );
}

function EmergencyMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.05] p-4">
      <Icon className="h-5 w-5 flex-none text-[#FF9BA3]" aria-hidden="true" />
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#FFB4AB]">{label}</p>
        <p className="mt-1 text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
