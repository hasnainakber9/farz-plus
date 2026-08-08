"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Check,
  FileCheck2,
  HeartHandshake,
  LayoutDashboard,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  UserRoundCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CareNetwork3D } from "@/components/care-network-3d";
import { HandoffSimulator } from "@/components/handoff-simulator";
import { realImages } from "@/lib/assets";

const personas = [
  {
    label: "Overseas families",
    title: "Be present without becoming the operations desk.",
    detail: "Family updates, sibling sync, medication visibility, care summaries, and a named person accountable in Pakistan.",
    href: "/families",
    image: realImages.elderPortrait,
    icon: Users,
  },
  {
    label: "Care managers",
    title: "Turn every concern into an accountable handoff.",
    detail: "A prioritized patient queue, source-grounded context, medication records, and one human approval gate.",
    href: "/care-teams",
    image: realImages.careManager,
    icon: HeartHandshake,
  },
  {
    label: "Doctors and clinics",
    title: "Receive structured escalations, not scattered messages.",
    detail: "Clinical summaries, recent vitals, allergies, care logs, and an explicit record of every professional decision.",
    href: "/doctors",
    image: realImages.careTeam,
    icon: Stethoscope,
  },
];

export function PlatformHome() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="site-shell">
      <section className="relative h-[calc(100svh-112px)] min-h-[650px] max-h-[820px] overflow-hidden bg-[var(--site-hero)] text-[var(--site-hero-text)]">
        <div className="absolute inset-x-0 bottom-0 top-[340px] z-0 lg:inset-0">
          <CareNetwork3D />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-[1540px] flex-col px-4 sm:px-6 lg:px-8">
          <div className="flex flex-1 items-start pt-14 sm:pt-18 lg:items-center lg:pt-0">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[650px]"
            >
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase text-[#78E3CA]">
                <span className="h-2 w-2 rounded-full bg-[#78E3CA] shadow-[0_0_0_6px_rgba(120,227,202,0.1)]" />
                Pakistan&apos;s human-led care operating layer
              </p>
              <h1 className="mt-5 text-[42px] font-extrabold leading-[1.02] tracking-[0] sm:text-[58px] lg:text-[66px]">
                Your parents&apos; care, carried by people you can name.
              </h1>
              <p className="mt-5 max-w-[590px] text-base leading-7 text-[#C0DCD5] sm:text-lg">
                Farz+ connects overseas families, care managers, Saathis, and doctors around one live record of
                medicines, check-ins, risk, and human-approved handoffs.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#handoff-simulator"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#78E3CA] px-5 text-sm font-bold text-[#073D35] transition hover:bg-[#9AF0DC]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Run a sample handoff
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 px-5 text-sm font-bold text-white transition hover:border-white/45 hover:bg-white/8"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Access the platform
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#A9C8C0]">
                {["Family messaging", "Corti when approved", "Human approval", "Auditable actions"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#78E3CA]" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="flex min-h-18 items-center justify-between gap-4 border-t border-white/12">
            <p className="max-w-xl text-xs leading-5 text-[#A9C8C0]">
              Illustrative network view: drag to see how accountability moves between family, care team, and clinician.
            </p>
            <Link href="#handoff-simulator" className="grid h-10 w-10 flex-none place-items-center rounded-md border border-white/18 text-[#78E3CA]" aria-label="Continue to handoff simulator">
              <ArrowDown className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <HandoffSimulator />

      <section className="site-soft site-border border-b py-18 sm:py-22">
        <div className="mx-auto max-w-[1540px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase text-[#08A98A]">A care system, not another chatbot</p>
              <h2 className="site-text mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
                AI prepares the work. Humans carry the duty.
              </h2>
              <p className="site-muted mt-4 text-base leading-7">
                Every high-risk case has a source trail, policy boundary, named owner, status trail, and
                documented outcome.
              </p>
              <Link href="/how-it-works" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#08A98A]">
                See the operating model <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-px overflow-hidden rounded-md border site-border bg-[var(--site-line)] sm:grid-cols-2">
              {[
                { icon: MessageCircle, title: "Verified family signal", detail: "A family message attaches to the right elder and household." },
                { icon: ShieldCheck, title: "Safety and policy layer", detail: "Risk rules block diagnosis, prescribing, and autonomous high-risk replies." },
                { icon: FileCheck2, title: "Source-grounded context", detail: "Corti assembles attributable records for human review." },
                { icon: UserRoundCheck, title: "Named human action", detail: "A care manager approves, edits, or escalates every consequential handoff." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="site-surface min-h-44 p-5">
                    <Icon className="h-5 w-5 text-[#08A98A]" />
                    <h3 className="site-text mt-5 text-base font-bold">{item.title}</h3>
                    <p className="site-muted mt-2 text-sm leading-6">{item.detail}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="site-surface site-border border-b py-18 sm:py-22">
        <div className="mx-auto max-w-[1540px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-[#08A98A]">One platform, three perspectives</p>
              <h2 className="site-text mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
                Everyone sees the work they need, not the noise they don&apos;t.
              </h2>
            </div>
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-[#08A98A]">
              Open role selection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-3">
            {personas.map((persona) => {
              const Icon = persona.icon;
              return (
                <article key={persona.label} className="site-surface overflow-hidden rounded-md border site-border">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={persona.image.src}
                      alt={persona.image.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition duration-500 hover:scale-[1.025]"
                    />
                    <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-md bg-white text-[#087B69] shadow-lg">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase text-[#08A98A]">{persona.label}</p>
                    <h3 className="site-text mt-3 text-xl font-bold leading-snug">{persona.title}</h3>
                    <p className="site-muted mt-3 text-sm leading-6">{persona.detail}</p>
                    <Link href={persona.href} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#08A98A]">
                      Explore this view <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="site-soft py-18 sm:py-22">
        <div className="mx-auto grid max-w-[1540px] gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase text-[#08A98A]">Trust is operational</p>
            <h2 className="site-text mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
              Built to show who knew what, who decided, and what happened next.
            </h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                { icon: LockKeyhole, text: "Tenant-scoped consent and role access" },
                { icon: ShieldCheck, text: "No autonomous diagnosis or prescribing" },
                { icon: FileCheck2, text: "Source and decision audit trail" },
                { icon: HeartHandshake, text: "Named human owner for every handoff" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <p key={item.text} className="site-text flex items-center gap-3 text-sm font-semibold">
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-md bg-[#E1F5EF] text-[#087B69]">
                      <Icon className="h-4 w-4" />
                    </span>
                    {item.text}
                  </p>
                );
              })}
            </div>
          </div>
          <div className="rounded-md bg-[#073D35] p-6 text-white sm:p-7">
            <p className="text-xs font-bold uppercase text-[#78E3CA]">Platform access</p>
            <h3 className="mt-3 text-2xl font-extrabold">See the same case from every role.</h3>
            <p className="mt-3 text-sm leading-6 text-[#C0DCD5]">
              Sign in to open the family, care-manager, clinician, or administrator workspace assigned to your account.
            </p>
            <Link href="/login" className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#78E3CA] text-sm font-bold text-[#073D35] hover:bg-[#9AF0DC]">
              <LayoutDashboard className="h-4 w-4" />
              Enter the working prototype
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
