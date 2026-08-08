"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  CircleUserRound,
  FileCheck2,
  LockKeyhole,
  MessageCircle,
  Pause,
  Play,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { handoffCase } from "@/lib/handoff-data";
import { cn, whatsappLink } from "@/lib/utils";

type PulseTone = "family" | "risk" | "context" | "human" | "safe";

const pulseStages = [
  {
    id: "family",
    title: "Family message",
    actor: "Amina reached out on WhatsApp",
    time: "09:18 AM",
    detail: "A possible duplicate medication dose is reported from Dubai.",
    meta: "Received",
    tone: "family" as PulseTone,
    icon: MessageCircle,
  },
  {
    id: "risk",
    title: "Risk detected",
    actor: "Farz+ safety layer",
    time: "09:19 AM",
    detail: "Duplicate-dose language matches a medication safety rule.",
    meta: "High risk",
    tone: "risk" as PulseTone,
    icon: ShieldAlert,
  },
  {
    id: "context",
    title: "Corti context",
    actor: "Source-grounded review",
    time: "09:19 AM",
    detail: "Medicines, allergies, care plan, and contacts are assembled.",
    meta: "Sources verified",
    tone: "context" as PulseTone,
    icon: BookOpenCheck,
  },
  {
    id: "human",
    title: "Human review",
    actor: "Ayesha Khan, Care Manager",
    time: "09:20 AM",
    detail: "A named care manager checks the sources and safe-response boundary.",
    meta: "In progress",
    tone: "human" as PulseTone,
    icon: UserRoundCheck,
  },
  {
    id: "safe",
    title: "Safe family update",
    actor: "Prepared for WhatsApp",
    time: "Pending",
    detail: "The reviewed update is released only after human approval.",
    meta: "Awaiting approval",
    tone: "safe" as PulseTone,
    icon: CheckCircle2,
  },
] as const;

const stageTone: Record<
  PulseTone,
  { border: string; bg: string; text: string; tag: string }
> = {
  family: {
    border: "border-[#68BFAE]",
    bg: "bg-[#E6F7F2]",
    text: "text-[#067360]",
    tag: "bg-[#D9F4ED] text-[#0A6C5A]",
  },
  risk: {
    border: "border-[#F08A78]",
    bg: "bg-[#FFF0ED]",
    text: "text-[#C94C3B]",
    tag: "bg-[#FFE0DA] text-[#A83B2D]",
  },
  context: {
    border: "border-[#58B9A5]",
    bg: "bg-[#E6F7F2]",
    text: "text-[#067360]",
    tag: "bg-[#D9F4ED] text-[#0A6C5A]",
  },
  human: {
    border: "border-[#C3A654]",
    bg: "bg-[#FFF8E5]",
    text: "text-[#88651D]",
    tag: "bg-[#FFF0C5] text-[#785713]",
  },
  safe: {
    border: "border-[#B7C6C2]",
    bg: "bg-[#F2F5F4]",
    text: "text-[#667B76]",
    tag: "bg-[#E8ECEB] text-[#61706C]",
  },
};

const audienceModes = [
  {
    id: "families",
    label: "For families",
    icon: UsersRound,
    title: "Stay close without becoming the operations desk.",
    body: "See what happened, who handled it, what is next, and when your parent was updated.",
    bullets: ["One named care manager", "WhatsApp-first updates", "Consent-based family access"],
    href: "/for-overseas-pakistanis",
    link: "Explore family care",
  },
  {
    id: "teams",
    label: "For care teams",
    icon: CircleUserRound,
    title: "One calm place for every consequential handoff.",
    body: "Review family context, policy boundaries, source evidence, escalation, and delivery status.",
    bullets: ["Prioritized case queue", "Corti context assembly", "Human approval and audit trail"],
    href: "/dashboard?demo=care-team",
    link: "Open care operations",
  },
  {
    id: "employers",
    label: "For employers",
    icon: BriefcaseBusiness,
    title: "A parent-care benefit employees can actually use.",
    body: "Give teams a trusted route into parent care without asking HR to coordinate providers.",
    bullets: ["Care-call access", "Family plan pathways", "Privacy-preserving support"],
    href: "/for-employers",
    link: "Explore employer care",
  },
] as const;

export function CarePulseHome() {
  return (
    <div className="bg-[#F8FBF9] text-[#143A35]">
      <CarePulseHero />
      <AudienceSection />
      <OperatingLayer />
      <TrustSection />
      <FinalCareCall />
    </div>
  );
}

function CarePulseHero() {
  const reduceMotion = useReducedMotion();
  const [activeStage, setActiveStage] = useState(3);
  const [playing, setPlaying] = useState(!reduceMotion);

  useEffect(() => {
    if (!playing || reduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveStage((current) => (current + 1) % pulseStages.length);
    }, 2100);
    return () => window.clearInterval(timer);
  }, [playing, reduceMotion]);

  function replay() {
    setActiveStage(0);
    setPlaying(!reduceMotion);
  }

  return (
    <section className="overflow-hidden border-b border-[#DCE8E4] bg-white">
      <div className="mx-auto max-w-[1440px] px-5 pb-0 pt-9 sm:px-7 sm:pt-12 lg:px-10">
        <div className="grid min-h-[390px] items-stretch gap-8 lg:grid-cols-[430px_minmax(0,1fr)] lg:gap-2">
          <motion.div
            initial={false}
            className="flex flex-col justify-center pb-2"
          >
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#087B69]">
              <span className="h-2 w-2 rounded-full bg-[#08A98A]" aria-hidden="true" />
              Live care operations
            </p>
            <h1 className="mt-4 max-w-[620px] text-[40px] font-semibold leading-[1.04] tracking-[0] text-[#143A35] sm:text-[48px]">
              <span className="sm:hidden">
                <span className="block">Care that stays</span>
                <span className="block">present, even</span>
                <span className="block">when you can&apos;t.</span>
              </span>
              <span className="hidden sm:block">
                <span className="block">Care that stays</span>
                <span className="block">present, even when</span>
                <span className="block">you can&apos;t.</span>
              </span>
            </h1>
            <p className="mt-4 max-w-[26rem] text-[15px] leading-6 text-[#55706B]">
              Farz+ connects families, care managers, and source-grounded Corti context so important
              messages reach the right human early.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={replay}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#006E5B] px-5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,110,91,0.18)] transition hover:-translate-y-0.5 hover:bg-[#005B4C] focus:outline-none focus:ring-2 focus:ring-[#0AB392] focus:ring-offset-2"
              >
                <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />
                Watch a live handoff
              </button>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#73AFA3] bg-white px-5 text-sm font-semibold text-[#0D5E51] transition hover:-translate-y-0.5 hover:border-[#006E5B] hover:bg-[#F0F8F5]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Book a care call
              </Link>
            </div>
            <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#617570]">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#006E5B]" aria-hidden="true" />
              <p>
                Built for Pakistani families. Consequential actions stay behind a named human approval.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={false}
            className="relative min-h-[380px] overflow-hidden"
          >
            <div className="absolute left-0 top-1 z-20">
              <p className="text-xl font-semibold text-[#143A35]">Lahore â†” Dubai</p>
              <p className="mt-1 text-sm text-[#4E6963]">Medication safety handoff</p>
              <p className="mt-1 text-xs text-[#82928E]">29 Jul 2026 Â· 09:18 AM PKT</p>
            </div>
            <Image
              src="/images/care-pulse-elder.png"
              alt="An elderly Pakistani father wearing a Sindhi cap and pale blue kurta."
              fill
              priority
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-cover object-[48%_22%]"
            />
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : activeStage === 0
                    ? { y: [0, -5, 0], boxShadow: ["0 12px 34px rgba(20,58,53,0.08)", "0 18px 44px rgba(8,169,138,0.16)", "0 12px 34px rgba(20,58,53,0.08)"] }
                    : { y: 0 }
              }
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute bottom-8 right-2 z-20 w-[250px] rounded-lg border border-[#D6E4E0] bg-white p-4 shadow-[0_16px_44px_rgba(20,58,53,0.12)] sm:right-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#143A35]">Amina (Daughter)</p>
                  <p className="mt-0.5 text-[11px] text-[#71847F]">Dubai Â· via WhatsApp</p>
                </div>
                <MessageCircle className="h-4 w-4 text-[#08A98A]" aria-hidden="true" />
              </div>
              <p className="mt-3 text-[11px] text-[#82928E]">09:18 AM</p>
              <div className="mt-2 rounded-md bg-[#DDF6EF] p-3">
                <p className="text-xs leading-5 text-[#244B44]">
                  My father accidentally took his medicine twice.
                </p>
                <Check className="ml-auto mt-1 h-3.5 w-3.5 text-[#08A98A]" aria-hidden="true" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div id="live-handoff" className="scroll-mt-24">
          <div className="flex items-center justify-between gap-4 border-b border-[#DCE8E4] py-2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#087B69]">Medication safety handoff</p>
              <p className="text-xs text-[#71847F]">Follow the case from family message to human-approved update.</p>
            </div>
            <button
              type="button"
              onClick={() => setPlaying((current) => !current)}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-[#CBDDD8] px-3 text-xs font-semibold text-[#385851] transition hover:bg-[#F0F7F5]"
              aria-label={playing ? "Pause handoff animation" : "Play handoff animation"}
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{playing ? "Pause" : "Play"}</span>
            </button>
          </div>

          <div className="relative hidden grid-cols-5 gap-5 pb-5 pt-5 md:grid">
            <div className="absolute left-[2.5%] right-[2.5%] top-[47px] h-px bg-[#CBDDD8]" />
            <motion.div
              className="absolute left-[2.5%] top-[45px] h-[3px] origin-left bg-[#08A98A]"
              animate={{ width: `${Math.max(activeStage / (pulseStages.length - 1), 0.02) * 95}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
            {!reduceMotion && playing ? (
              <motion.span
                key={`pulse-${activeStage}`}
                className="care-pulse-track absolute left-[2.5%] top-[41px] h-2.5 w-24 bg-[linear-gradient(90deg,transparent,#50D4B9,transparent)]"
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: 960, opacity: [0, 1, 0] }}
                transition={{ duration: 1.7, ease: "linear" }}
                aria-hidden="true"
              />
            ) : null}

            {pulseStages.map((stage, index) => {
              const Icon = stage.icon;
              const active = index === activeStage;
              const complete = index < activeStage;
              const tone = stageTone[stage.tone];
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    setActiveStage(index);
                    setPlaying(false);
                  }}
                  aria-pressed={active}
                  className="relative z-10 min-w-0 text-left focus:outline-none"
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-full border transition duration-300",
                      active
                        ? cn(tone.border, tone.bg, tone.text, "scale-110 shadow-[0_0_0_6px_rgba(8,169,138,0.08)]")
                        : complete
                          ? "border-[#08A98A] bg-[#08A98A] text-white"
                          : "border-[#C8D8D4] bg-white text-[#71847F]",
                    )}
                  >
                    {complete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </span>
                  <p className="mt-4 text-[11px] text-[#71847F]">{stage.time}</p>
                  <h2 className={cn("mt-1 text-sm font-semibold", active ? "text-[#143A35]" : "text-[#385851]")}>
                    {stage.title}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-[#617570]">{stage.actor}</p>
                  <AnimatePresence mode="wait">
                    {active ? (
                      <motion.div
                        key={stage.id}
                        initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-2"
                      >
                        <p className="text-xs leading-5 text-[#385851]">{stage.detail}</p>
                        <span className={cn("mt-2 inline-flex rounded px-2 py-1 text-[10px] font-bold", tone.tag)}>
                          {stage.meta}
                        </span>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          <div className="py-5 md:hidden">
            <div className="grid grid-cols-5 gap-1.5">
              {pulseStages.map((stage, index) => {
                const Icon = stage.icon;
                const active = index === activeStage;
                const complete = index < activeStage;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => {
                      setActiveStage(index);
                      setPlaying(false);
                    }}
                    aria-label={`${index + 1}. ${stage.title}`}
                    aria-pressed={active}
                    className={cn(
                      "grid h-11 place-items-center rounded-md border",
                      active
                        ? "border-[#08A98A] bg-[#E6F7F2] text-[#08715F]"
                        : complete
                          ? "border-[#08A98A] bg-[#08A98A] text-white"
                          : "border-[#D6E4E0] bg-white text-[#71847F]",
                    )}
                  >
                    {complete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={pulseStages[activeStage].id}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-4 border-l-2 border-[#08A98A] pl-4"
              >
                <p className="text-xs text-[#71847F]">{pulseStages[activeStage].time}</p>
                <h2 className="mt-1 text-lg font-semibold text-[#143A35]">{pulseStages[activeStage].title}</h2>
                <p className="mt-1 text-sm text-[#4E6963]">{pulseStages[activeStage].actor}</p>
                <p className="mt-2 text-sm leading-6 text-[#617570]">{pulseStages[activeStage].detail}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <SafetyStrip />
      </div>
    </section>
  );
}

function SafetyStrip() {
  const items = [
    { icon: Sparkles, title: "Corti-powered context", body: "Source-grounded case assembly" },
    { icon: UserRoundCheck, title: "Human-led decisions", body: "Named reviewer for high-risk cases" },
    { icon: FileCheck2, title: "Policy boundary", body: "No diagnosis or prescribing" },
    { icon: LockKeyhole, title: "Consent-based access", body: "Family roles and auditable actions" },
  ];

  return (
    <div className="grid border-x border-t border-[#D9E5E1] bg-[#FCFEFD] lg:grid-cols-[1.25fr_repeat(4,1fr)]">
      <div className="flex items-center gap-4 border-b border-[#D9E5E1] p-4 lg:border-b-0 lg:border-r">
        <span className="grid h-12 w-12 flex-none place-items-center rounded-full border border-[#8ECABD] text-[#006E5B]">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold text-[#143A35]">Safety first. Always.</p>
          <Link href="/medical-disclaimer" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#087B69]">
            See the operating boundary <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="flex gap-3 border-b border-[#D9E5E1] p-4 last:border-b-0 sm:items-center lg:border-b-0 lg:border-r lg:last:border-r-0">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#EEF7F4] text-[#087B69]">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-[#244B44]">{item.title}</p>
              <p className="mt-1 text-[11px] leading-4 text-[#71847F]">{item.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AudienceSection() {
  const [activeMode, setActiveMode] = useState<(typeof audienceModes)[number]["id"]>("families");
  const active = useMemo(
    () => audienceModes.find((mode) => mode.id === activeMode) ?? audienceModes[0],
    [activeMode],
  );
  const reduceMotion = useReducedMotion();

  return (
    <AnimatedSection className="border-b border-[#DCE8E4] bg-[#F3F9F6] py-20 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-7 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#087B69]">One connected care layer</p>
            <h2 className="mt-4 max-w-[560px] text-4xl font-semibold leading-[1.08] tracking-[0] text-[#143A35] sm:text-5xl">
              Always-on care, human-led.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-[#55706B]">
              One platform. Every caregiver. A clear record of what happened and what comes next.
            </p>
          </div>

          <div>
            <div className="grid border-b border-[#BFD3CE] sm:grid-cols-3">
              {audienceModes.map((mode) => {
                const Icon = mode.icon;
                const selected = mode.id === activeMode;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setActiveMode(mode.id)}
                    aria-pressed={selected}
                    className={cn(
                      "flex min-h-14 items-center gap-2 border-b-2 px-1 text-left text-sm font-semibold transition sm:justify-center sm:border-b-2",
                      selected
                        ? "border-[#006E5B] text-[#006E5B]"
                        : "border-transparent text-[#617570] hover:text-[#244B44]",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {mode.label}
                  </button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24 }}
                className="grid gap-8 py-8 md:grid-cols-[1fr_0.9fr]"
              >
                <div>
                  <h3 className="text-2xl font-semibold leading-tight text-[#143A35]">{active.title}</h3>
                  <p className="mt-4 text-base leading-7 text-[#55706B]">{active.body}</p>
                  <Link
                    href={active.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#006E5B] hover:text-[#004D40]"
                  >
                    {active.link}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <ul className="divide-y divide-[#D3E1DD] border-y border-[#D3E1DD]">
                  {active.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-3 py-4 text-sm font-medium text-[#385851]">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#DDF3ED] text-[#087B69]">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function OperatingLayer() {
  const sources = [
    ["Medication", "Lisinopril 10mg Â· once daily", "Care plan"],
    ["Allergies", "No known drug allergies", "Care plan"],
    ["Care context", "Hypertension Â· Type 2 diabetes", "Family record"],
    ["Emergency contact", "Amina Hassan Â· verified", "Family profile"],
  ];

  return (
    <AnimatedSection className="bg-[#123A35] py-20 text-white sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-7 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-20">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#87DAC9]">The operating layer</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[0] sm:text-5xl">
              Context you can trace. Decisions you can name.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#C5D8D3]">
              Farz+ gives the care manager a verified picture without letting automation cross the clinical boundary.
            </p>
            <Link
              href="/dashboard?demo=care-team"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-md bg-[#AEE9DA] px-5 text-sm font-bold text-[#063F36] transition hover:-translate-y-0.5 hover:bg-white"
            >
              Open the live workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="border border-white/15 bg-[#0D302C]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 px-5 py-4">
              <div>
                <p className="text-xs font-semibold text-[#87DAC9]">CASE #{handoffCase.id}</p>
                <p className="mt-1 text-lg font-semibold">Medication safety handoff</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded bg-[#2A4D47] px-3 py-2 text-xs font-semibold text-[#D7E8E4]">
                <span className="h-2 w-2 rounded-full bg-[#53D5B9]" />
                Human review in progress
              </span>
            </div>
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-white/15 p-5 lg:border-b-0 lg:border-r">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#87DAC9]">Incoming family message</p>
                <blockquote className="mt-4 text-2xl font-medium leading-[1.35]">
                  â€œ{handoffCase.familyMessage}â€
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <Image
                    src={handoffCase.familyMember.image}
                    alt={handoffCase.familyMember.name}
                    width={42}
                    height={42}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{handoffCase.familyMember.name}</p>
                    <p className="mt-0.5 text-xs text-[#9EB8B2]">Daughter Â· Dubai Â· WhatsApp</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="grid divide-y divide-white/10">
                  {sources.map(([label, value, source]) => (
                    <div key={label} className="grid gap-1 px-5 py-4 sm:grid-cols-[130px_1fr_auto] sm:items-center sm:gap-4">
                      <p className="text-xs font-semibold text-[#87DAC9]">{label}</p>
                      <p className="text-sm text-white">{value}</p>
                      <p className="text-[11px] text-[#91ADA7]">Source: {source}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/15 bg-[#113F39] px-5 py-4">
                  <p className="flex items-start gap-2 text-xs leading-5 text-[#C8DDD8]">
                    <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#70D6C0]" />
                    Corti context is source-grounded. No diagnosis is generated. A human approves the response.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function TrustSection() {
  const trustItems = [
    ["Named accountability", "Every high-risk case shows the assigned care manager and escalation chain."],
    ["Source traceability", "Medication, contact, and care-plan context stays attributable to its record."],
    ["Policy boundaries", "Diagnosis, prescribing, and dose changes remain outside the Farz+ workflow."],
    ["Immutable history", "Messages, context refreshes, approvals, and escalations are recorded in sequence."],
  ];

  return (
    <AnimatedSection className="border-b border-[#DCE8E4] bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-7 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#087B69]">Trust architecture</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[0] text-[#143A35] sm:text-5xl">
              Proof before promises.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#55706B]">
              The platform makes its safety logic visible to the people responsible for care.
            </p>
          </div>
          <div className="divide-y divide-[#D9E5E1] border-y border-[#D9E5E1]">
            {trustItems.map(([title, body], index) => (
              <div key={title} className="grid gap-3 py-5 sm:grid-cols-[56px_190px_1fr] sm:items-center">
                <span className="text-xs font-bold text-[#08A98A]">0{index + 1}</span>
                <h3 className="font-semibold text-[#143A35]">{title}</h3>
                <p className="text-sm leading-6 text-[#617570]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function FinalCareCall() {
  return (
    <AnimatedSection className="bg-[#F3F9F6] py-20 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-7 lg:px-10">
        <div className="grid gap-8 border-y border-[#BFD3CE] py-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#087B69]">Start with one parent</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[0] text-[#143A35] sm:text-5xl">
              Build a care layer your family can see and trust.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#55706B]">
              Begin with a care call, family context, and a consent-based parent profile.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#006E5B] px-6 text-sm font-bold text-white transition hover:bg-[#005B4C]"
            >
              Book a care call
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={whatsappLink("Assalam o alaikum Farz+, I want to understand care options for my parent.")}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#8DB7AF] bg-white px-6 text-sm font-semibold text-[#0D5E51] transition hover:border-[#006E5B] hover:bg-[#EDF7F4]"
            >
              <MessageCircle className="h-4 w-4" />
              Talk on WhatsApp
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-[#617570]">
          <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#08A98A]" /> Parent app is optional</span>
          <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#08A98A]" /> WhatsApp-first support</span>
          <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#08A98A]" /> Care coordination, not diagnosis</span>
        </div>
      </div>
    </AnimatedSection>
  );
}

