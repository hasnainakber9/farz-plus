"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  FileCheck2,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  ListChecks,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircle,
  NotebookPen,
  Pill,
  RefreshCw,
  Scale,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import {
  decisionLayers,
  handoffCase,
  initialAuditTrail,
  initialHandoffEvents,
  type HandoffEvent,
  type HandoffEventCategory,
} from "@/lib/handoff-data";
import { cn, whatsappLink } from "@/lib/utils";

type EventFilter = "all" | HandoffEventCategory;
type ReviewState = "pending" | "sending" | "approved" | "escalated";
type CortiMode = "loading" | "demo" | "ready" | "live";

interface CortiViewStatus {
  mode: CortiMode;
  environment: string;
  tenant: string;
}

const eventFilters: { id: EventFilter; label: string }[] = [
  { id: "all", label: "All events" },
  { id: "family", label: "Family" },
  { id: "system", label: "System" },
  { id: "corti", label: "Corti" },
  { id: "human", label: "Human" },
  { id: "notes", label: "Notes" },
];

const navigation = [
  { label: "Overview", icon: LayoutDashboard, target: "case-overview" },
  { label: "Human Handoff", icon: HeartHandshake, target: "event-stream", active: true, count: 3 },
  { label: "Case context", icon: BrainCircuit, target: "case-context" },
  { label: "Decision", icon: ClipboardCheck, target: "decision-panel" },
  { label: "Audit trail", icon: ListChecks, target: "audit-trail" },
] as const;

const supportingNavigation = [
  { label: "Family services", icon: UsersRound, href: "/for-families-in-pakistan" },
  { label: "Care plans", icon: Pill, href: "/care-plans" },
  { label: "Operations", icon: Settings, href: "/operations" },
] as const;

const eventVisual = {
  family: {
    icon: MessageCircle,
    iconClass: "border-[#8EDFCF] bg-[#E9F8F4] text-[#087B69]",
    label: "Family",
  },
  risk: {
    icon: ShieldAlert,
    iconClass: "border-[#FFC1BA] bg-[#FFF0EE] text-[#C63E34]",
    label: "Risk",
  },
  safe: {
    icon: ShieldCheck,
    iconClass: "border-[#B8DDD8] bg-[#EDF7F5] text-[#187B70]",
    label: "Safety",
  },
  corti: {
    icon: BrainCircuit,
    iconClass: "border-[#A8D9E6] bg-[#EDF8FB] text-[#18778F]",
    label: "Corti",
  },
  human: {
    icon: UserRoundCheck,
    iconClass: "border-[#D4CCF5] bg-[#F4F1FF] text-[#6552A8]",
    label: "Human",
  },
} as const;

const decisionIcons = [ShieldAlert, BrainCircuit, FileCheck2, Scale, CheckCircle2, UserRoundCheck];

function currentPakistanTime() {
  return new Intl.DateTimeFormat("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Karachi",
  }).format(new Date());
}

function Avatar({
  src,
  alt,
  size = "md",
}: {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <span className={cn("relative block flex-none overflow-hidden rounded-full border border-[#D5E4E0]", sizes[size])}>
      <Image src={src} alt={alt} fill sizes="48px" className="object-cover" />
    </span>
  );
}

function statusCopy(reviewState: ReviewState) {
  if (reviewState === "approved") {
    return {
      label: "Approved",
      detail: "Queued for family delivery",
      className: "border-[#9BD8C8] bg-[#E8F7F2] text-[#08705F]",
      dot: "bg-[#08A98A]",
    };
  }
  if (reviewState === "escalated") {
    return {
      label: "Supervisor review",
      detail: "Nadia Raza has been notified",
      className: "border-[#E8D29A] bg-[#FFF8E7] text-[#8B6718]",
      dot: "bg-[#D7A52C]",
    };
  }
  if (reviewState === "sending") {
    return {
      label: "Approving",
      detail: "Recording the human decision",
      className: "border-[#A8D9E6] bg-[#EDF8FB] text-[#18778F]",
      dot: "bg-[#2399B4]",
    };
  }
  return {
    label: "In review",
    detail: "Awaiting care-manager approval",
    className: "border-[#A8D9E6] bg-[#EDF8FB] text-[#18778F]",
    dot: "bg-[#2399B4]",
  };
}

function cortiCopy(corti: CortiViewStatus) {
  if (corti.mode === "live") {
    return { label: "Corti live", detail: "Interaction attached", tone: "text-[#08705F]" };
  }
  if (corti.mode === "ready") {
    return { label: "Corti ready", detail: "Connection configured", tone: "text-[#18778F]" };
  }
  if (corti.mode === "loading") {
    return { label: "Checking Corti", detail: "Reading connection", tone: "text-[#536B66]" };
  }
  return { label: "Corti safe demo", detail: "No family data sent", tone: "text-[#8B6718]" };
}

function NavigationBody({
  corti,
  onNavigate,
  onSignOut,
  onClose,
}: {
  corti: CortiViewStatus;
  onNavigate: (target: string) => void;
  onSignOut: () => void;
  onClose?: () => void;
}) {
  const cortiStatus = cortiCopy(corti);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center justify-between border-b border-[#DCE9E5] px-5">
        <BrandMark />
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="grid h-9 w-9 place-items-center rounded-md border border-[#D5E4E0] text-[#536B66]"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 px-3 py-5" aria-label="Care operations">
        <p className="px-3 text-xs font-bold uppercase text-[#80948F]">Casework</p>
        <div className="mt-2 grid gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = "active" in item && item.active;
            return (
              <button
                type="button"
                key={item.label}
                onClick={() => onNavigate(item.target)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition",
                  active
                    ? "bg-[#E8F6F2] text-[#006E5B]"
                    : "text-[#526963] hover:bg-[#F3F8F6] hover:text-[#143A35]",
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-[#08A98A]" : "text-[#7C938D]")} />
                <span className="min-w-0 flex-1">{item.label}</span>
                {"count" in item ? (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#006E5B] px-1 text-xs font-bold text-white">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <p className="mt-7 px-3 text-xs font-bold uppercase text-[#80948F]">Platform</p>
        <div className="mt-2 grid gap-1">
          {supportingNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold text-[#526963] transition hover:bg-[#F3F8F6] hover:text-[#143A35]"
              >
                <Icon className="h-4 w-4 text-[#7C938D]" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-[#DCE9E5] p-3">
        <div className="rounded-md border border-[#D9E7E3] bg-[#F8FBF9] p-3">
          <div className="flex items-center gap-2">
            {corti.mode === "loading" ? (
              <LoaderCircle className="h-4 w-4 animate-spin text-[#2399B4]" />
            ) : (
              <BrainCircuit className="h-4 w-4 text-[#087B69]" />
            )}
            <p className={cn("text-sm font-bold", cortiStatus.tone)}>{cortiStatus.label}</p>
          </div>
          <p className="mt-1 text-xs text-[#6F827D]">{cortiStatus.detail}</p>
        </div>
        <div className="mt-3 flex items-center gap-3 px-2">
          <Avatar src={handoffCase.careManager.image} alt={handoffCase.careManager.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#143A35]">{handoffCase.careManager.name}</p>
            <p className="text-xs text-[#6F827D]">Care manager Â· online</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-3 flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-[#6F827D] transition hover:bg-[#F3F8F6] hover:text-[#143A35]"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

function Topbar({
  onMenu,
  onSignOut,
}: {
  onMenu: () => void;
  onSignOut: () => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#DCE9E5] bg-white/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="grid h-9 w-9 flex-none place-items-center rounded-md border border-[#D5E4E0] text-[#536B66] lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-bold text-[#143A35] sm:text-lg">Human Handoff</h1>
            <span className="hidden items-center gap-1.5 text-xs font-semibold text-[#087B69] sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-[#08A98A]" />
              Live case
            </span>
          </div>
          <p className="hidden text-xs text-[#6F827D] sm:block">Medication safety Â· Lahore</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={whatsappLink("Assalam o alaikum Farz+, I need help with my parent's care.")}
          className="hidden h-9 items-center gap-2 rounded-md border border-[#D5E4E0] px-3 text-xs font-bold text-[#38534D] transition hover:border-[#9FCFC4] hover:bg-[#F3F8F6] sm:inline-flex"
        >
          <MessageCircle className="h-4 w-4 text-[#08A98A]" />
          WhatsApp
        </Link>
        <Link
          href="/contact"
          className="hidden h-9 items-center rounded-md bg-[#006E5B] px-4 text-xs font-bold text-white transition hover:bg-[#005B4C] md:inline-flex"
        >
          Book a care call
        </Link>
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-md border border-[#D5E4E0] text-[#536B66] transition hover:bg-[#F3F8F6]"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#E64D43]" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((value) => !value)}
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
            className="flex h-10 items-center gap-2 rounded-md px-1.5 text-left transition hover:bg-[#F3F8F6]"
          >
            <Avatar src={handoffCase.careManager.image} alt={handoffCase.careManager.name} size="sm" />
            <ChevronDown className="hidden h-4 w-4 text-[#6F827D] xl:block" />
          </button>
          <AnimatePresence>
            {profileOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 top-12 w-52 rounded-md border border-[#D5E4E0] bg-white p-2 shadow-[0_16px_44px_rgba(20,58,53,0.14)]"
              >
                <p className="px-3 py-2 text-xs text-[#6F827D]">{handoffCase.careManager.name}</p>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex h-10 w-full items-center gap-2 rounded px-3 text-sm font-semibold text-[#38534D] hover:bg-[#F3F8F6]"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function CaseOverview({ reviewState }: { reviewState: ReviewState }) {
  const currentStatus = statusCopy(reviewState);

  return (
    <section id="case-overview" className="scroll-mt-24 border-b border-[#DCE9E5] bg-white">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#087B69] hover:text-[#005B4C]">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Farz+
        </Link>
        <div className="mt-4 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase text-[#70847E]">Case {handoffCase.id}</p>
              <span className="rounded border border-[#FFC1BA] bg-[#FFF0EE] px-2 py-1 text-xs font-bold text-[#C63E34]">
                {handoffCase.risk}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-[#143A35] sm:text-3xl">Possible duplicate medication dose</h2>
            <p className="mt-2 text-sm leading-6 text-[#536B66]">
              {handoffCase.familyMember.name} reported this through the verified family WhatsApp channel.
            </p>
          </div>
          <div className={cn("w-full max-w-sm rounded-md border px-4 py-3 xl:w-auto", currentStatus.className)}>
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className={cn("h-2 w-2 rounded-full", currentStatus.dot)} />
              {currentStatus.label}
            </div>
            <p className="mt-1 text-xs opacity-80">{currentStatus.detail}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 border-y border-[#DCE9E5] xl:grid-cols-4">
          <CaseMetric
            label="Parent"
            value={`${handoffCase.parent.name}, ${handoffCase.parent.age}`}
            detail={`${handoffCase.parent.city} Â· Family profile verified`}
          />
          <CaseçŽ8¶‰žËkºwµçAÁÉ½Ù•€ü€ (€€€€€€€€€€€€€€ñ¡•­¥É±”È±…ÍÍ9…µ”ô‰ ´ÐÜ´Ðˆ€¼ø(€€€€€€€€€€€€¤€è€ (€€€€€€€€€€€€€€ñM•¹±…ÍÍ9…µ”ô‰ ´ÐÜ´Ðˆ€¼ø(€€€€€€€€€€€€¥ô(€€€€€€€€€€€íÍ•¹‘¥¹œ€ü€‰I•½É‘¥¹œ…ÁÁÉ½Ù…°ˆ€è…ÁÁÉ½Ù•€ü€‰I•ÍÁ½¹Í”…ÁÁÉ½Ù•ˆ€è€‰ÁÁÉ½Ù”…¹Í•¹‰ô(€€€€€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µÐ´ÈÉ¥É¥µ½±Ì´È…À´Èˆø(€€€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€€€ÑåÁ”ô‰‰ÕÑÑ½¸ˆ(€€€€€€€€€€€€€½¹±¥¬õí½¹Í…±…Ñ•ô(€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰™±•àµ¥¸µ ´ÄÀ¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ•¹Ñ•È…À´ÈÉ½Õ¹‘•µµ‰½É‘•È‰½É‘•ÈµlÕÑÁtÁà´ÈÑ•áÐµáÌ™½¹Ðµ‰½±Ñ•áÐµlŒÔÌÙØÙtÑÉ…¹Í¥Ñ¥½¸¡½Ù•Èé‰½É‘•Èµlå	Ùt¡½Ù•Èé‰œµlååtˆ(€€€€€€€€€€€€ø(€€€€€€€€€€€€€€ñUÍ•ÉÍI½Õ¹±…ÍÍ9…µ”ô‰ ´Ì¸ÔÜ´Ì¸Ôˆ€¼ø(€€€€€€€€€€€€€MÕÁ•ÉÙ¥Í½È(€€€€€€€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€€€ÑåÁ”ô‰‰ÕÑÑ½¸ˆ(€€€€€€€€€€€€€½¹±¥¬õí½¹½ÕÍ9½Ñ•ô(€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰™±•àµ¥¸µ ´ÄÀ¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ•¹Ñ•È…À´ÈÉ½Õ¹‘•µµ‰½É‘•È‰½É‘•ÈµlÕÑÁtÁà´ÈÑ•áÐµáÌ™½¹Ðµ‰½±Ñ•áÐµlŒÔÌÙØÙtÑÉ…¹Í¥Ñ¥½¸¡½Ù•Èé‰½É‘•ÈµlŒåÑt¡½Ù•Èé‰œµlÍáÙtˆ(€€€€€€€€€€€€ø(€€€€€€€€€€€€€€ñ¥±•Q•áÐ±…ÍÍ9…µ”ô‰ ´Ì¸ÔÜ´Ì¸Ôˆ€¼ø(€€€€€€€€€€€€€%¹Ñ•É¹…°¹½Ñ”(€€€€€€€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€ð½‘¥Øø(€€€€€€ð½Í•Ñ¥½¸ø((€€€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”ô‰µÐ´ÌÉ½Õ¹‘•µµ‰½É‘•È‰½É‘•ÈµlÕÑÁt‰œµÝ¡¥Ñ”À´Ðˆø(€€€€€€€€ñ È±…ÍÍ9…µ”ô‰Ñ•áÐµÍ´™½¹Ðµ‰½±Ñ•áÐµlŒÄÐÍÌÕtˆùÍ…±…Ñ¥½¸¡…¥¸ð½ Èø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µÐ´ÌÉ¥…À´Ìˆø(€€€€€€€€€íÁ•½Á±”¹µ…À ¡Á•ÉÍ½¸°¥¹‘•à¤€ôø€ (€€€€€€€€€€€€ñ‘¥Ø­•äõíÁ•ÉÍ½¸¹¹…µ•ô±…ÍÍ9…µ”ô‰É•±…Ñ¥Ù”™±•à¥Ñ•µÌµ•¹Ñ•È…À´Ìˆø(€€€€€€€€€€€€€í¥¹‘•à€ðÁ•½Á±”¹±•¹Ñ €´€Ä€ü€ (€€€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰…‰Í½±ÕÑ”±•™ÐµlÄÕÁátÑ½À´à ´Ø‰½É‘•Èµ°‰½É‘•Èµ‘…Í¡•‰½É‘•Èµl	Ítˆ€¼ø(€€€€€€€€€€€€€€¤€è¹Õ±±ô(€€€€€€€€€€€€€€ñÙ…Ñ…ÈÍÉŒõíÁ•ÉÍ½¸¹¥µ…•ô…±ÐõíÁ•ÉÍ½¸¹¹…µ•ôÍ¥é”ô‰Í´ˆ€¼ø(€€€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µ¥¸µÜ´À™±•à´Äˆø(€€€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰ÑÉÕ¹…Ñ”Ñ•áÐµÍ´™½¹Ðµ‰½±Ñ•áÐµlŒÄÐÍÌÕtˆùíÁ•ÉÍ½¸¹¹…µ•ôð½Àø(€€€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áÐµáÌÑ•áÐµlŒÜÀàÐÝtˆùíÁ•ÉÍ½¸¹É½±•ôð½Àø(€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰Ñ•áÐµÉ¥¡Ðˆø(€€€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áÐµáÌ™½¹Ðµ‰½±Ñ•áÐµlŒÌàÔÌÑtˆùíÁ•ÉÍ½¸¹ÍÑ…ÑÕÍôð½Àø(€€€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰µÐ´À¸ÔÑ•áÐµáÌÑ•áÐµlŒàÀäÐátˆùíÁ•ÉÍ½¸¹¹½Ñ•ôð½Àø(€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€¤¥ô(€€€€€€€€ð½‘¥Øø(€€€€€€ð½Í•Ñ¥½¸ø((€€€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”ô‰µÐ´ÌÉ½Õ¹‘•µµ‰½É‘•È‰½É‘•ÈµlÕÑÁt‰œµÝ¡¥Ñ”À´Ðˆø(€€€€€€€€ñ‰ÕÑÑ½¸ÑåÁ”ô‰‰ÕÑÑ½¸ˆ½¹±¥¬õí½¹Q½±•1•‘•Éô±…ÍÍ9…µ”ô‰™±•àÜµ™Õ±°¥Ñ•µÌµÍÑ…ÉÐ©ÕÍÑ¥™äµ‰•ÑÝ••¸…À´ÌÑ•áÐµ±•™Ðˆø(€€€€€€€€€€ñ‘¥Øø(€€€€€€€€€€€€ñ È±…ÍÍ9…µ”ô‰Ñ•áÐµÍ´™½¹Ðµ‰½±Ñ•áÐµlŒÄÐÍÌÕtˆù•¥Í¥½¸±•‘•Èð½ Èø(€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰µÐ´ÄÑ•áÐµáÌÑ•áÐµlŒÜÀàÐÝtˆù]¡ä¡Õµ…¸É•Ù¥•ÜÝ…ÌÉ•ÅÕ¥É•ð½Àø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€í±•‘•ÉáÁ…¹‘•€ü€ (€€€€€€€€€€€€ñ¡•ÙÉ½¹UÀ±…ÍÍ9…µ”ô‰ ´ÐÜ´ÐÑ•áÐµlŒÜÀàÐÝtˆ€¼ø(€€€€€€€€€€¤€è€ (€€€€€€€€€€€€ñ¡•ÙÉ½¹½Ý¸±…ÍÍ9…µ”ô‰ ´ÐÜ´ÐÑ•áÐµlŒÜÀàÐÝtˆ€¼ø(€€€€€€€€€€¥ô(€€€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µÐ´ÐÉ¥É¥µ½±Ì´Ì…À´ÌÍ´éÉ¥µ½±Ì´Ø±œéÉ¥µ½±Ì´Ìˆø(€€€€€€€€€í‘•¥Í¥½¹1…å•ÉÌ¹µ…À ¡±…å•È°¥¹‘•à¤€ôøì(€€€€€€€€€€€½¹ÍÐ%½¸€ô‘•¥Í¥½¹%½¹Ím¥¹‘•átì(€€€€€€€€€€€½¹ÍÐ¡Õµ…¹A•¹‘¥¹œ€ô¥¹‘•à€ôôô‘•¥Í¥½¹1…å•ÉÌ¹±•¹Ñ €´€Ä€˜˜€……ÁÁÉ½Ù•ì(€€€€€€€€€€€É•ÑÕÉ¸€ (€€€€€€€€€€€€€€ñ‘¥Ø­•äõí±…å•È¹¹…µ•ô±…ÍÍ9…µ”ô‰µ¥¸µÜ´ÀÑ•áÐµ•¹Ñ•Èˆø(€€€€€€€€€€€€€€€€ñÍÁ…¸(€€€€€€€€€€€€€€€€€±…ÍÍ9…µ”õí¸ (€€€€€€€€€€€€€€€€€€€€‰µàµ…ÕÑ¼É¥ ´àÜ´àÁ±…”µ¥Ñ•µÌµ•¹Ñ•ÈÉ½Õ¹‘•µ™Õ±°‰½É‘•Èˆ°(€€€€€€€€€€€€€€€€€€€¡Õµ…¹A•¹‘¥¹œ(€€€€€€€€€€€€€€€€€€€€€€ü€‰‰½É‘•ÈµlÉØÜÕt‰œµláÝtÑ•áÐµlŒáØÜÄátˆ(€€€€€€€€€€€€€€€€€€€€€€è€‰‰½É‘•ÈµlÝt‰œµláÕtÑ•áÐµlŒÀàÝØåtˆ°(€€€€€€€€€€€€€€€€€€¥ô(€€€€€€€€€€€€€€€€ø(€€€€€€€€€€€€€€€€€€ñ%½¸±…ÍÍ9…µ”ô‰ ´ÐÜ´Ðˆ€¼ø(€€€€€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰µÐ´Ä¸ÔÑ•áÐµáÌ±•…‘¥¹œ´ÐÑ•áÐµlŒØÀÜÔÙtˆùí±…å•È¹¹…µ•ôð½Àø(€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€¤ì(€€€€€€€€€ô¥ô(€€€€€€€€ð½‘¥Øø(€€€€€€€€ñ¹¥µ…Ñ•AÉ•Í•¹”¥¹¥Ñ¥…°õí™…±Í•ôø(€€€€€€€€€í±•‘•ÉáÁ…¹‘•€ü€ (€€€€€€€€€€€€ñµ½Ñ¥½¸¹‘¥Ø(€€€€€€€€€€€€€¥¹¥Ñ¥…°õíì¡•¥¡Ðè€À°½Á…¥Ñäè€Àõô(€€€€€€€€€€€€€…¹¥µ…Ñ”õíì¡•¥¡Ðè€‰…ÕÑ¼ˆ°½Á…¥Ñäè€Äõô(€€€€€€€€€€€€€•á¥Ðõíì¡•¥¡Ðè€À°½Á…¥Ñäè€Àõô(€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰½Ù•É™±½Üµ¡¥‘‘•¸ˆ(€€€€€€€€€€€€ø(€€€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µÐ´Ð‰½É‘•ÈµÐ‰½É‘•ÈµlåÕtÁÐ´Èˆø(€€€€€€€€€€€€€€€í‘•¥Í¥½¹1…å•ÉÌ¹µ…À ¡±…å•È¤€ôø€ (€€€€€€€€€€€€€€€€€€ñ‘¥Ø­•äõí±…å•È¹¹…µ•ô±…ÍÍ9…µ”ô‰‰½É‘•Èµˆ‰½É‘•ÈµlÑ	tÁä´È±…ÍÐé‰½É‘•Èµˆ´Àˆø(€€€€€€€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áÐµáÌ™½¹Ðµ‰½±Ñ•áÐµlŒÌàÔÌÑtˆùí±…å•È¹¹…µ•ôð½Àø(€€€€€€€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰µÐ´ÄÑ•áÐµáÌ±•…‘¥¹œ´ÔÑ•áÐµlŒÜÀàÐÝtˆùí±…å•È¹‘•Ñ…¥±ôð½Àø(€€€€€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€€€€€¤¥ô(€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€ð½µ½Ñ¥½¸¹‘¥Øø(€€€€€€€€€€¤€è¹Õ±±ô(€€€€€€€€ð½¹¥µ…Ñ•AÉ•Í•¹”ø(€€€€€€ð½Í•Ñ¥½¸ø((€€€€€€ñÍ•Ñ¥½¸¥ô‰…Õ‘¥ÐµÑÉ…¥°ˆ±…ÍÍ9…µ”ô‰µÐ´ÌÍÉ½±°µµÐ´ÈÐÉ½Õ¹‘•µµ‰½É‘•È‰½É‘•ÈµlÕÑÁt‰œµÝ¡¥Ñ”À´Ðˆø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ‰•ÑÝ••¸…À´Ìˆø(€€€€€€€€€€ñ È±…ÍÍ9…µ”ô‰Ñ•áÐµÍ´™½¹Ðµ‰½±Ñ•áÐµlŒÄÐÍÌÕtˆùÕ‘¥ÐÑÉ…¥°ð½ Èø(€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰¥¹±¥¹”µ™±•à¥Ñ•µÌµ•¹Ñ•È…À´ÄÑ•áÐµáÌ™½¹ÐµÍ•µ¥‰½±Ñ•áÐµlŒÀàÝØåtˆø(€€€€€€€€€€€€ñ1½­-•å¡½±”±…ÍÍ9…µ”ô‰ ´Ì¸ÔÜ´Ì¸Ôˆ€¼ø(€€€€€€€€€€€%µµÕÑ…‰±”(€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€ð½‘¥Øø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µÐ´Ìˆø(€€€€€€€€€í…Õ‘¥Ñ¹ÑÉ¥•Ì¹Í±¥” ´Ô¤¹µ…À ¡•¹ÑÉä°¥¹‘•à¤€ôø€ (€€€€€€€€€€€€ñ‘¥Ø­•äõí€‘í•¹ÑÉä¹Ñ¥µ•ô´‘í•¹ÑÉä¹•Ù•¹Ñô´‘í¥¹‘•áõô±…ÍÍ9…µ”ô‰‰½É‘•Èµˆ‰½É‘•ÈµlÑ	tÁä´È±…ÍÐé‰½É‘•Èµˆ´Àˆø(€€€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ‰•ÑÝ••¸…À´ÌÑ•áÐµáÌÑ•áÐµlŒàÀäÐátˆø(€€€€€€€€€€€€€€€€ñÍÁ…¸ùí•¹ÑÉä¹Ñ¥µ•ôð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€ñÍÁ…¸ùí•¹ÑÉä¹…Ñ½Éôð½ÍÁ…¸ø(€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰µÐ´ÄÑ•áÐµáÌ±•…‘¥¹œ´ÔÑ•áÐµlŒÔÌÙØÙtˆùí•¹ÑÉä¹•Ù•¹Ñôð½Àø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€¤¥ô(€€€€€€€€ð½‘¥Øø(€€€€€€ð½Í•Ñ¥½¸ø(€€€€ð½…Í¥‘”ø(€€¤ì)ô()•áÁ½ÉÐ™Õ¹Ñ¥½¸…É•AÕ±Í•]½É­ÍÁ…”¡ì½¹M¥¹=ÕÐôèì½¹M¥¹=ÕÐè€ ¤€ôøÙ½¥ô¤ì(€½¹ÍÐÍ¡½Õ±‘I•‘Õ•5½Ñ¥½¸€ôÕÍ•I•‘Õ•‘5½Ñ¥½¸ ¤ì(€½¹ÍÐmµ½‰¥±•=Á•¸°Í•Ñ5½‰¥±•=Á•¹t€ôÕÍ•MÑ…Ñ”¡™…±Í”¤ì(€½¹ÍÐm•Ù•¹ÑÌ°Í•ÑÙ•¹ÑÍt€ôÕÍ•MÑ…Ñ”ñ!…¹‘½™™Ù•¹Ñmtø¡¥¹¥Ñ¥…±!…¹‘½™™Ù•¹ÑÌ¤ì(€½¹ÍÐm…Ñ¥Ù•¥±Ñ•È°Í•ÑÑ¥Ù•¥±Ñ•Ét€ôÕÍ•MÑ…Ñ”ñÙ•¹Ñ¥±Ñ•Èø ‰…±°ˆ¤ì(€½¹ÍÐm•Ù•¹ÑÍáÁ…¹‘•°Í•ÑÙ•¹ÑÍáÁ…¹‘•‘t€ôÕÍ•MÑ…Ñ”¡™…±Í”¤ì(€½¹ÍÐm±•‘•ÉáÁ…¹‘•°Í•Ñ1•‘•ÉáÁ…¹‘•‘t€ôÕÍ•MÑ…Ñ”¡™…±Í”¤ì(€½¹ÍÐm¹½Ñ”°Í•Ñ9½Ñ•t€ôÕÍ•MÑ…Ñ” ˆˆ¤ì(€½¹ÍÐmÉ•ÍÁ½¹Í”°Í•ÑI•ÍÁ½¹Í•t€ôÕÍ•MÑ…Ñ”ñÍÑÉ¥¹œø¡¡…¹‘½™™…Í”¹ÁÉ½Á½Í•‘I•ÍÁ½¹Í”¤ì(€½¹ÍÐmÉ•Ù¥•ÝMÑ…Ñ”°Í•ÑI•Ù¥•ÝMÑ…Ñ•t€ôÕÍ•MÑ…Ñ”ñI•Ù¥•ÝMÑ…Ñ”ø ‰Á•¹‘¥¹œˆ¤ì(€½¹ÍÐm‘å¹…µ¥Õ‘¥Ð°Í•Ñå¹…µ¥Õ‘¥Ñt€ôÕÍ•MÑ…Ñ”ñìÑ¥µ”èÍÑÉ¥¹œì•Ù•¹ÐèÍÑÉ¥¹œì…Ñ½ÈèÍÑÉ¥¹œõmtø¡mt¤ì(€½¹ÍÐm½ÉÑ¤°Í•Ñ½ÉÑ¥t€ôÕÍ•MÑ…Ñ”ñ½ÉÑ¥Y¥•ÝMÑ…ÑÕÌø¡ìµ½‘”è€‰±½…‘¥¹œˆ°•¹Ù¥É½¹µ•¹Ðè€‰•Ôˆ°Ñ•¹…¹Ðè€‰‰…Í”ˆô¤ì(€½¹ÍÐmÍå¹¥¹½ÉÑ¤°Í•ÑMå¹¥¹½ÉÑ¥t€ôÕÍ•MÑ…Ñ”¡™…±Í”¤ì((€ÕÍ•™™•Ð  ¤€ôøì(€€€±•Ð…Ñ¥Ù”€ôÑÉÕ”ì(€€€™•Ñ  ˆ½…Á¤½½ÉÑ¤½ÍÑ…ÑÕÌˆ°ì…¡”è€‰¹¼µÍÑ½É”ˆô¤(€€€€€€¹Ñ¡•¸ ¡É•ÍÕ±Ð¤€ôøÉ•ÍÕ±Ð¹©Í½¸ ¤¤(€€€€€€¹Ñ¡•¸ ¡ÍÑ…ÑÕÌèìµ½‘”üè½ÉÑ¥5½‘”ì•¹Ù¥É½¹µ•¹ÐüèÍÑÉ¥¹œìÑ•¹…¹ÐüèÍÑÉ¥¹œô¤€ôøì(€€€€€€€¥˜€ ……Ñ¥Ù”¤É•ÑÕÉ¸ì(€€€€€€€Í•Ñ½ÉÑ¤¡ì(€€€€€€€€€µ½‘”èÍÑ…ÑÕÌ¹µ½‘”€üü€‰‘•µ¼ˆ°(€€€€€€€€€•¹Ù¥É½¹µ•¹ÐèÍÑ…ÑÕÌ¹•¹Ù¥É½¹µ•¹Ð€üü€‰•Ôˆ°(€€€€€€€€€Ñ•¹…¹ÐèÍÑ…ÑÕÌ¹Ñ•¹…¹Ð€üü€‰‰…Í”ˆ°(€€€€€€€ô¤ì(€€€€€ô¤(€€€€€€¹…Ñ   ¤€ôøì(€€€€€€€¥˜€¡…Ñ¥Ù”¤Í•Ñ½ÉÑ¤¡ìµ½‘”è€‰‘•µ¼ˆ°•¹Ù¥É½¹µ•¹Ðè€‰•Ôˆ°Ñ•¹…¹Ðè€‰‰…Í”ˆô¤ì(€€€€€ô¤ì(€€€É•ÑÕÉ¸€ ¤€ôøì(€€€€€…Ñ¥Ù”€ô™…±Í”ì(€€€ôì(€ô°mt¤ì((€™Õ¹Ñ¥½¸…‘‘Ù•¹Ð¡•Ù•¹Ðè!…¹‘½™™Ù•¹Ð¤ì(€€€Í•ÑÙ•¹ÑÌ ¡ÕÉÉ•¹Ð¤€ôøl¸¸¹ÕÉÉ•¹Ð°•Ù•¹Ñt¤ì(€ô((€™Õ¹Ñ¥½¸…‘‘Õ‘¥Ð¡•Ù•¹ÐèÍÑÉ¥¹œ°…Ñ½ÈèÍÑÉ¥¹œ€ô¡…¹‘½™™…Í”¹…É•5…¹…•È¹¹…µ”¤ì(€€€Í•Ñå¹…µ¥Õ‘¥Ð ¡ÕÉÉ•¹Ð¤€ôøl¸¸¹ÕÉÉ•¹Ð°ìÑ¥µ”èÕÉÉ•¹ÑA…­¥ÍÑ…¹Q¥µ” ¤°•Ù•¹Ð°…Ñ½Èõt¤ì(€ô((€™Õ¹Ñ¥½¸¡…¹‘±•‘‘9½Ñ” ¤ì(€€€½¹ÍÐÑÉ¥µµ•€ô¹½Ñ”¹ÑÉ¥´ ¤ì(€€€¥˜€ …ÑÉ¥µµ•¤É•ÑÕÉ¸ì(€€€…‘‘Ù•¹Ð¡ì(€€€€€¥è•ÙÐµ¹½Ñ”´‘í…Ñ”¹¹½Ü ¥õ€°(€€€€€Ñ¥µ”èÕÉÉ•¹ÑA…­¥ÍÑ…¹Q¥µ” ¤°(€€€€€…Ñ•½Éäè€‰¹½Ñ•Ìˆ°(€€€€€…Ñ½Èè¡…¹‘½™™…Í”¹…É•5…¹…•È¹¹…µ”°(€€€€€Ñ¥Ñ±”è€‰%¹Ñ•É¹…°¹½Ñ”…‘‘•ˆ°(€€€€€‘•Ñ…¥°èÑÉ¥µµ•°(€€€€€µ•Ñ„èl‰Y¥Í¥‰±”Ñ¼…Éè¬ÍÑ…™˜½¹±ä‰t°(€€€€€Ñ½¹”è€‰¡Õµ…¸ˆ°(€€€ô¤ì(€€€…‘‘Õ‘¥Ð ‰%¹Ñ•É¹…°…Í”¹½Ñ”…‘‘•ˆ¤ì(€€€Í•Ñ9½Ñ” ˆˆ¤ì(€€€Í•ÑÑ¥Ù•¥±Ñ•È ‰…±°ˆ¤ì(€ô((€™Õ¹Ñ¥½¸¡…¹‘±•ÁÁÉ½Ù” ¤ì(€€€¥˜€¡É•Ù¥•ÝMÑ…Ñ”€ôôô€‰…ÁÁÉ½Ù•ˆñðÉ•Ù¥•ÝMÑ…Ñ”€ôôô€‰Í•¹‘¥¹œˆ¤É•ÑÕÉ¸ì(€€€Í•ÑI•Ù¥•ÝMÑ…Ñ” ‰Í•¹‘¥¹œˆ¤ì(€€€Ý¥¹‘½Ü¹Í•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€Í•ÑI•Ù¥•ÝMÑ…Ñ” ‰…ÁÁÉ½Ù•ˆ¤ì(€€€€€…‘‘Ù•¹Ð¡ì(€€€€€€€¥è•ÙÐµ…ÁÁÉ½Ù•´‘í…Ñ”¹¹½Ü ¥õ€°(€€€€€€€Ñ¥µ”èÕÉÉ•¹ÑA…­¥ÍÑ…¹Q¥µ” ¤°(€€€€€€€…Ñ•½Éäè€‰¡Õµ…¸ˆ°(€€€€€€€…Ñ½Èè¡…¹‘½™™…Í”¹…É•5…¹…•È¹¹…µ”°(€€€€€€€Ñ¥Ñ±”è€‰I•Ù¥•Ý•É•ÍÁ½¹Í”…ÁÁÉ½Ù•ˆ°(€€€€€€€‘•Ñ…¥°è€‰Q¡”É•ÍÁ½¹Í”Á…ÍÍ•Ñ¡”¡Õµ…¸…ÁÁÉ½Ù…°…Ñ”…¹¥ÌÅÕ•Õ•™½È™…µ¥±ä‘•±¥Ù•Éä¸ˆ°(€€€€€€€µ•Ñ„èl‰ÁÁÉ½Ù•‰ä…É”µ…¹…•Èˆ°€‰]¡…ÑÍÁÀ‘•±¥Ù•ÉäÅÕ•Õ”‰t°(€€€€€€€Ñ½¹”è€‰¡Õµ…¸ˆ°(€€€€€ô¤ì(€€€€€…‘‘Õ‘¥Ð ‰I•Ù¥•Ý•É•ÍÁ½¹Í”…ÁÁÉ½Ù•ˆ¤ì(€€€ô°Í¡½Õ±‘I•‘Õ•5½Ñ¥½¸€ü€À€è€ÐÔÀ¤ì(€ô((€™Õ¹Ñ¥½¸¡…¹‘±•Í…±…Ñ” ¤ì(€€€¥˜€¡É•Ù¥•ÝMÑ…Ñ”€ôôô€‰•Í…±…Ñ•ˆ¤É•ÑÕÉ¸ì(€€€Í•ÑI•Ù¥•ÝMÑ…Ñ” ‰•Í…±…Ñ•ˆ¤ì(€€€…‘‘Ù•¹Ð¡ì(€€€€€¥è•ÙÐµ•Í…±…Ñ•´‘í…Ñ”¹¹½Ü ¥õ€°(€€€€€Ñ¥µ”èÕÉÉ•¹ÑA…­¥ÍÑ…¹Q¥µ” ¤°(€€€€€…Ñ•½Éäè€‰¡Õµ…¸ˆ°(€€€€€…Ñ½Èè¡…¹‘½™™…Í”¹…É•5…¹…•È¹¹…µ”°(€€€€€Ñ¥Ñ±”è€‰MÕÁ•ÉÙ¥Í½ÈÉ•Ù¥•ÜÉ•ÅÕ•ÍÑ•ˆ°(€€€€€‘•Ñ…¥°è€‘í¡…¹‘½™™…Í”¹ÍÕÁ•ÉÙ¥Í½È¹¹…µ•ôÝ…Ì…‘‘•Ñ¼Ñ¡”¡…¹‘½™˜…¹¹½Ñ¥™¥•½˜Ñ¡”µ•‘¥…Ñ¥½¸µÉ¥Í¬…Í”¹€°(€€€€€µ•Ñ„èl‰Í…±…Ñ¥½¸±•Ù•°èMÕÁ•ÉÙ¥Í½È‰t°(€€€€€Ñ½¹”è€‰¡Õµ…¸ˆ°(€€€ô¤ì(€€€…‘‘Õ‘¥Ð ‰MÕÁ•ÉÙ¥Í½ÈÉ•Ù¥•ÜÉ•ÅÕ•ÍÑ•ˆ¤ì(€ô((€…Íå¹Œ™Õ¹Ñ¥½¸¡…¹‘±•Må¹½ÉÑ¤ ¤ì(€€€¥˜€¡Íå¹¥¹½ÉÑ¤¤É•ÑÕÉ¸ì(€€€Í•ÑMå¹¥¹½ÉÑ¤¡ÑÉÕ”¤ì(€€€ÑÉäì(€€€€€½¹ÍÐÉ•ÍÕ±Ð€ô…Ý…¥Ð™•Ñ  ˆ½…Á¤½½ÉÑ¤½¥¹Ñ•É…Ñ¥½¹Ìˆ°ì(€€€€€€€µ•Ñ¡½è€‰A=MPˆ°(€€€€€€€¡•…‘•ÉÌèì€‰½¹Ñ•¹ÐµQåÁ”ˆè€‰…ÁÁ±¥…Ñ¥½¸½©Í½¸ˆô°(€€€€€€€‰½‘äè)M=8¹ÍÑÉ¥¹¥™ä¡ì…Í•%è¡…¹‘½™™…Í”¹¥ô¤°(€€€€€ô¤ì(€€€€€½¹ÍÐÁ…å±½…€ô€¡…Ý…¥ÐÉ•ÍÕ±Ð¹©Í½¸ ¤¤…Ìì(€€€€€€€µ½‘”üè€‰‘•µ¼ˆð€‰É•…‘äˆð€‰±¥Ù”ˆì(€€€€€€€Íå¹•üè‰½½±•…¸ì(€€€€€€€¥¹Ñ•É…Ñ¥½¹%üèÍÑÉ¥¹œì(€€€€€€€µ•ÍÍ…”üèÍÑÉ¥¹œì(€€€€€€€•ÉÉ½ÈüèÍÑÉ¥¹œì(€€€€€ôì(€€€€€¥˜€ …É•ÍÕ±Ð¹½¬¤Ñ¡É½Ü¹•ÜÉÉ½È¡Á…å±½…¹•ÉÉ½È€üü€‰½ÉÑ¤É•ÅÕ•ÍÐ™…¥±•¸ˆ¤ì((€€€€€Í•Ñ½ÉÑ¤ ¡ÕÉÉ•¹Ð¤€ôø€¡ì€¸¸¹ÕÉÉ•¹Ð°µ½‘”èÁ…å±½…¹µ½‘”€üüÕÉÉ•¹Ð¹µ½‘”ô¤¤ì(€€€€€…‘‘Ù•¹Ð¡ì(€€€€€€€¥è•ÙÐµ½ÉÑ¤µÉ•™É•Í ´‘í…Ñ”¹¹½Ü ¥õ€°(€€€€€€€Ñ¥µ”èÕÉÉ•¹ÑA…­¥ÍÑ…¹Q¥µ” ¤°(€€€€€€€…Ñ•½Éäè€‰½ÉÑ¤ˆ°(€€€€€€€…Ñ½Èè€‰½ÉÑ¤ˆ°(€€€€€€€Ñ¥Ñ±”èÁ…å±½…¹Íå¹•€ü€‰1¥Ù”½ÉÑ¤¥¹Ñ•É…Ñ¥½¸…ÑÑ…¡•ˆ€è€‰½ÉÑ¤‘•µ¼½¹Ñ•áÐÉ•™É•Í¡•ˆ°(€€€€€€€‘•Ñ…¥°èÁ…å±½…¹µ•ÍÍ…”€üü€‰½ÉÑ¤½¹Ñ•áÐÉ•™É•Í¡•¸ˆ°(€€€€€€€µ•Ñ„èÁ…å±½…¹¥¹Ñ•É…Ñ¥½¹%€üm%¹Ñ•É…Ñ¥½¸è€‘íÁ…å±½…¹¥¹Ñ•É…Ñ¥½¹%‘õt€èÕ¹‘•™¥¹•°(€€€€€€€Ñ½¹”è€‰½ÉÑ¤ˆ°(€€€€€ô¤ì(€€€€€…‘‘Õ‘¥Ð¡Á…å±½…¹Íå¹•€ü€‰½ÉÑ¤¥¹Ñ•É…Ñ¥½¸…ÑÑ…¡•ˆ€è€‰½ÉÑ¤‘•µ¼½¹Ñ•áÐÉ•™É•Í¡•ˆ°€‰MåÍÑ•´ˆ¤ì(€€€ô…Ñ €¡•ÉÉ½È¤ì(€€€€€…‘‘Ù•¹Ð¡ì(€€€€€€€¥è•ÙÐµ½ÉÑ¤µ•ÉÉ½È´‘í…Ñ”¹¹½Ü ¥õ€°(€€€€€€€Ñ¥µ”èÕÉÉ•¹ÑA…­¥ÍÑ…¹Q¥µ” ¤°(€€€€€€€…Ñ•½Éäè€‰ÍåÍÑ•´ˆ°(€€€€€€€…Ñ½Èè€‰MåÍÑ•´ˆ°(€€€€€€€Ñ¥Ñ±”è€‰½ÉÑ¤Íå¹Œ¹••‘Ì…ÑÑ•¹Ñ¥½¸ˆ°(€€€€€€€‘•Ñ…¥°è•ÉÉ½È¥¹ÍÑ…¹•½˜ÉÉ½È€ü•ÉÉ½È¹µ•ÍÍ…”€è€‰½ÉÑ¤É•ÅÕ•ÍÐ™…¥±•¸ˆ°(€€€€€€€µ•Ñ„èl‰9¼™…µ¥±äÉ•ÍÁ½¹Í”Ý…Ì…™™•Ñ•‰t°(€€€€€€€Ñ½¹”è€‰É¥Í¬ˆ°(€€€€€ô¤ì(€€€ô™¥¹…±±äì(€€€€€Í•ÑMå¹¥¹½ÉÑ¤¡™…±Í”¤ì(€€€ô(€ô((€™Õ¹Ñ¥½¸¹…Ù¥…Ñ•Q¼¡Ñ…É•ÐèÍÑÉ¥¹œ¤ì(€€€Í•Ñ5½‰¥±•=Á•¸¡™…±Í”¤ì(€€€Ý¥¹‘½Ü¹É•ÅÕ•ÍÑ¹¥µ…Ñ¥½¹É…µ”  ¤€ôøì(€€€€€‘½Õµ•¹Ð¹•Ñ±•µ•¹Ñ	å%¡Ñ…É•Ð¤ü¹ÍÉ½±±%¹Ñ½Y¥•Ü¡ì‰•¡…Ù¥½ÈèÍ¡½Õ±‘I•‘Õ•5½Ñ¥½¸€ü€‰…ÕÑ¼ˆ€è€‰Íµ½½Ñ ˆ°‰±½¬è€‰ÍÑ…ÉÐˆô¤ì(€€€ô¤ì(€ô((€™Õ¹Ñ¥½¸™½ÕÍ9½Ñ” ¤ì(€€€‘½Õµ•¹Ð¹•Ñ±•µ•¹Ñ	å% ‰¥¹Ñ•É¹…°µ¹½Ñ”ˆ¤ü¹ÍÉ½±±%¹Ñ½Y¥•Ü¡ì(€€€€€‰•¡…Ù¥½ÈèÍ¡½Õ±‘I•‘Õ•5½Ñ¥½¸€ü€‰…ÕÑ¼ˆ€è€‰Íµ½½Ñ ˆ°(€€€€€‰±½¬è€‰•¹Ñ•Èˆ°(€€€ô¤ì(€€€Ý¥¹‘½Ü¹Í•ÑQ¥µ•½ÕÐ  ¤€ôø‘½Õµ•¹Ð¹•Ñ±•µ•¹Ñ	å% ‰¥¹Ñ•É¹…°µ¹½Ñ”ˆ¤ü¹™½ÕÌ ¤°Í¡½Õ±‘I•‘Õ•5½Ñ¥½¸€ü€À€è€ÌÔÀ¤ì(€ô((€½¹ÍÐ±…Ñ•ÍÑMÑ…ÑÕÌ€ô(€€€É•Ù¥•ÝMÑ…Ñ”€ôôô€‰…ÁÁÉ½Ù•ˆ(€€€€€€ü€‰I•ÍÁ½¹Í”…ÁÁÉ½Ù•ˆ(€€€€€€èÉ•Ù¥•ÝMÑ…Ñ”€ôôô€‰•Í…±…Ñ•ˆ(€€€€€€€€ü€‰MÕÁ•ÉÙ¥Í½ÈÉ•Ù¥•ÜÉ•ÅÕ•ÍÑ•ˆ(€€€€€€€€è€‰Ý…¥Ñ¥¹œ…É”µµ…¹…•È…ÁÁÉ½Ù…°ˆì((€É•ÑÕÉ¸€ (€€€€ñ‘¥Ø‘…Ñ„µÁ±…Ñ™½É´µÍ¡•±°±…ÍÍ9…µ”ô‰µ¥¸µ µÍÉ••¸‰œµlÍÝÕtÑ•áÐµlŒÄÐÍÌÕtm™½¹ÐµÍå¹Ñ¡•Í¥Ìé¹½¹•tˆø(€€€€€€ñ…Í¥‘”±…ÍÍ9…µ”ô‰™¥á•¥¹Í•Ðµä´À±•™Ð´Àè´ÐÀ¡¥‘‘•¸ÜµlÈÌÉÁát‰½É‘•ÈµÈ‰½É‘•ÈµlåÕt±œé‰±½¬ˆø(€€€€€€€€ñ9…Ù¥…Ñ¥½¹	½‘ä½ÉÑ¤õí½ÉÑ¥ô½¹9…Ù¥…Ñ”õí¹…Ù¥…Ñ•Q½ô½¹M¥¹=ÕÐõí½¹M¥¹=ÕÑô€¼ø(€€€€€€ð½…Í¥‘”ø((€€€€€€ñ¹¥µ…Ñ•AÉ•Í•¹”ø(€€€€€€€íµ½‰¥±•=Á•¸€ü€ (€€€€€€€€€€ðø(€€€€€€€€€€€€ñµ½Ñ¥½¸¹‰ÕÑÑ½¸(€€€€€€€€€€€€€ÑåÁ”ô‰‰ÕÑÑ½¸ˆ(€€€€€€€€€€€€€…É¥„µ±…‰•°ô‰±½Í”¹…Ù¥…Ñ¥½¸ˆ(€€€€€€€€€€€€€½¹±¥¬õì ¤€ôøÍ•Ñ5½‰¥±•=Á•¸¡™…±Í”¥ô(€€€€€€€€€€€€€¥¹¥Ñ¥…°õíì½Á…¥Ñäè€Àõô(€€€€€€€€€€€€€…¹¥µ…Ñ”õíì½Á…¥Ñäè€Äõô(€€€€€€€€€€€€€•á¥Ðõíì½Á…¥Ñäè€Àõô(€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰™¥á•¥¹Í•Ð´Àè´ÐÀ‰œµlŒÄÐÍÌÕt¼ÐÀ‰…­‘É½Àµ‰±ÕÈµÍ´±œé¡¥‘‘•¸ˆ(€€€€€€€€€€€€¼ø(€€€€€€€€€€€€ñµ½Ñ¥½¸¹…Í¥‘”(€€€€€€€€€€€€€¥¹¥Ñ¥…°õíìàè€´ÈØÀõô(€€€€€€€€€€€€€…¹¥µ…Ñ”õíìàè€Àõô(€€€€€€€€€€€€€•á¥Ðõíìàè€´ÈØÀõô(€€€€€€€€€€€€€ÑÉ…¹Í¥Ñ¥½¸õíì‘ÕÉ…Ñ¥½¸èÍ¡½Õ±‘I•‘Õ•5½Ñ¥½¸€ü€À€è€À¸ÈÐ°•…Í”è€‰•…Í•=ÕÐˆõô(€€€€€€€€€€€€€±…ÍÍ9…µ”ô‰™¥á•¥¹Í•Ðµä´À±•™Ð´Àè´ÔÀÜµmµ¥¸ àÙÙÜ°ÌÀÁÁà¥t‰½É‘•ÈµÈ‰½É‘•ÈµlåÕt±œé¡¥‘‘•¸ˆ(€€€€€€€€€€€€ø(€€€€€€€€€€€€€€ñ9…Ù¥…Ñ¥½¹	½‘ä(€€€€€€€€€€€€€€€½ÉÑ¤õí½ÉÑ¥ô(€€€€€€€€€€€€€€€½¹9…Ù¥…Ñ”õí¹…Ù¥…Ñ•Q½ô(€€€€€€€€€€€€€€€½¹M¥¹=ÕÐõí½¹M¥¹=ÕÑô(€€€€€€€€€€€€€€€½¹±½Í”õì ¤€ôøÍ•Ñ5½‰¥±•=Á•¸¡™…±Í”¥ô(€€€€€€€€€€€€€€¼ø(€€€€€€€€€€€€ð½µ½Ñ¥½¸¹…Í¥‘”ø(€€€€€€€€€€ð¼ø(€€€€€€€€¤€è¹Õ±±ô(€€€€€€ð½¹¥µ…Ñ•AÉ•Í•¹”ø((€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µ¥¸µ µÍÉ••¸±œéÁ°µlÈÌÉÁátˆø(€€€€€€€€ñQ½Á‰…È½¹5•¹Ôõì ¤€ôøÍ•Ñ5½‰¥±•=Á•¸¡ÑÉÕ”¥ô½¹M¥¹=ÕÐõí½¹M¥¹=ÕÑô€¼ø(€€€€€€€€ñ…Í•=Ù•ÉÙ¥•ÜÉ•Ù¥•ÝMÑ…Ñ”õíÉ•Ù¥•ÝMÑ…Ñ•ô€¼ø(€€€€€€€€ñµ…¥¸±…ÍÍ9…µ”ô‰µàµ…ÕÑ¼É¥µ…àµÜµlÄØÀÁÁát…À´ÐÁà´ÐÁä´ÔÍ´éÁà´Ø±œéÉ¥µ½±Ìµmµ¥¹µ…à À°Å™È¥|ÌàÁÁát±œé¥Ñ•µÌµÍÑ…ÉÐˆø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰½É‘•È´Èµ¥¸µÜ´À±œé½É‘•È´Äˆø(€€€€€€€€€€€€ñÙ•¹ÑMÑÉ•…´(€€€€€€€€€€€€€•Ù•¹ÑÌõí•Ù•¹ÑÍô(€€€€€€€€€€€€€…Ñ¥Ù•¥±Ñ•Èõí…Ñ¥Ù•¥±Ñ•Éô(€€€€€€€€€€€€€½¹¥±Ñ•ÈõíÍ•ÑÑ¥Ù•¥±Ñ•Éô(€€€€€€€€€€€€€•áÁ…¹‘•õí•Ù•¹ÑÍáÁ…¹‘•‘ô(€€€€€€€€€€€€€½¹Q½±•áÁ…¹‘•õì ¤€ôøÍ•ÑÙ•¹ÑÍáÁ…¹‘• ¡Ù…±Õ”¤€ôø€…Ù…±Õ”¥ô(€€€€€€€€€€€€€¹½Ñ”õí¹½Ñ•ô(€€€€€€€€€€€€€Í•Ñ9½Ñ”õíÍ•Ñ9½Ñ•ô(€€€€€€€€€€€€€½¹‘‘9½Ñ”õí¡…¹‘±•‘‘9½Ñ•ô(€€€€€€€€€€€€€½ÉÑ¤õí½ÉÑ¥ô(€€€€€€€€€€€€€Íå¹¥¹œõíÍå¹¥¹½ÉÑ¥ô(€€€€€€€€€€€€€½¹Må¹½ÉÑ¤õí¡…¹‘±•Må¹½ÉÑ¥ô(€€€€€€€€€€€€¼ø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰½É‘•È´Ä±œé½É‘•È´Èˆø(€€€€€€€€€€€€ñ•¥Í¥½¹A…¹•°(€€€€€€€€€€€€€É•ÍÁ½¹Í”õíÉ•ÍÁ½¹Í•ô(€€€€€€€€€€€€€Í•ÑI•ÍÁ½¹Í”õíÍ•ÑI•ÍÁ½¹Í•ô(€€€€€€€€€€€€€É•Ù¥•ÝMÑ…Ñ”õíÉ•Ù¥•ÝMÑ…Ñ•ô(€€€€€€€€€€€€€½¹ÁÁÉ½Ù”õí¡…¹‘±•ÁÁÉ½Ù•ô(€€€€€€€€€€€€€½¹Í…±…Ñ”õí¡…¹‘±•Í…±…Ñ•ô(€€€€€€€€€€€€€½¹½ÕÍ9½Ñ”õí™½ÕÍ9½Ñ•ô(€€€€€€€€€€€€€±•‘•ÉáÁ…¹‘•õí±•‘•ÉáÁ…¹‘•‘ô(€€€€€€€€€€€€€½¹Q½±•1•‘•Èõì ¤€ôøÍ•Ñ1•‘•ÉáÁ…¹‘• ¡Ù…±Õ”¤€ôø€…Ù…±Õ”¥ô(€€€€€€€€€€€€€‘å¹…µ¥Õ‘¥Ðõí‘å¹…µ¥Õ‘¥Ñô(€€€€€€€€€€€€¼ø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€ð½µ…¥¸ø(€€€€€€€€ñ™½½Ñ•È±…ÍÍ9…µ”ô‰‰½É‘•ÈµÐ‰½É‘•ÈµlåÕt‰œµÝ¡¥Ñ”Áà´ÔÁä´ÐÑ•áÐµáÌÑ•áÐµlŒÜÀàÐÝtˆø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µàµ…ÕÑ¼™±•àµ…àµÜµlÄØÀÁÁát™±•àµÝÉ…À¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ‰•ÑÝ••¸…À´Èˆø(€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰¥¹±¥¹”µ™±•à¥Ñ•µÌµ•¹Ñ•È…À´Èˆø(€€€€€€€€€€€€€€ñ1½­-•å¡½±”±…ÍÍ9…µ”ô‰ ´Ì¸ÔÜ´Ì¸Ôˆ€¼ø(€€€€€€€€€€€€€½¹Í•¹Ðµ‰…Í•…•ÍÌƒ
Üí±…Ñ•ÍÑMÑ…ÑÕÍô(€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€€€ñÍÁ…¸ùA…­¥ÍÑ…¸MÑ…¹‘…ÉQ¥µ”ƒ
Ü€Èä)Õ°€ÈÀÈØð½ÍÁ…¸ø(€€€€€€€€€€€€ñÍÁ…¸ù…Éè¬½½É‘¥¹…Ñ•Ì…É”¸%Ð‘½•Ì¹½Ð‘¥…¹½Í”½ÈÁÉ•ÍÉ¥‰”¸ð½ÍÁ…¸ø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€ð½™½½Ñ•Èø(€€€€€€ð½‘¥Øø(€€€€ð½‘¥Øø(€€¤ì)ô