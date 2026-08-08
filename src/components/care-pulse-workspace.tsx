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
          <CaseMetric
            label="Assigned to"
            value={handoffCase.careManager.name}
            detail={handoffCase.careManager.role}
            image={handoffCase.careManager.image}
          />
          <CaseMetric label="Received" value="09:18 AM PKT" detail={handoffCase.receivedAt.split(",")[0]} />
          <CaseMetric label="Service level" value={handoffCase.sla} detail={handoffCase.dueAt} last />
        </div>
      </div>
    </section>
  );
}

function CaseMetric({
  label,
  value,
  detail,
  image,
  last = false,
}: {
  label: string;
  value: string;
  detail: string;
  image?: string;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-h-24 items-center gap-3 border-b border-r border-[#DCE9E5] px-3 py-4 even:border-r-0 xl:border-b-0 xl:border-r xl:px-5 xl:even:border-r",
        last && "xl:border-r-0 xl:even:border-r-0",
      )}
    >
      {image ? <Avatar src={image} alt={value} size="sm" /> : null}
      <div>
        <p className="text-xs font-bold uppercase text-[#80948F]">{label}</p>
        <p className="mt-1 text-sm font-bold text-[#143A35]">{value}</p>
        <p className="mt-1 text-xs text-[#6F827D]">{detail}</p>
      </div>
    </div>
  );
}

function ContextGrid({
  corti,
  syncing,
  onSync,
}: {
  corti: CortiViewStatus;
  syncing: boolean;
  onSync: () => void;
}) {
  const contextItems = [
    { title: "Medications", lines: handoffCase.parent.medications, source: "Care plan" },
    { title: "Allergies", lines: handoffCase.parent.allergies, source: "Care plan" },
    { title: "Care plan", lines: handoffCase.parent.carePlan, source: "Family record" },
    {
      title: "Emergency contact",
      lines: [handoffCase.parent.emergencyContact],
      source: "Verified family profile",
    },
  ];

  return (
    <section id="case-context" className="mt-4 scroll-mt-24 overflow-hidden rounded-md border border-[#CFE2DD] bg-[#F5FAF8]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#CFE2DD] px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-[#087B69]" />
            <h4 className="text-sm font-bold text-[#143A35]">Corti context package</h4>
          </div>
          <p className="mt-1 text-xs leading-5 text-[#60756F]">
            Source-grounded context for a human decision. No diagnosis or dosing change is generated.
          </p>
        </div>
        <button
          type="button"
          onClick={onSync}
          disabled={syncing}
          className="inline-flex min-h-9 items-center gap-2 rounded-md border border-[#AFCFC7] bg-white px-3 text-xs font-bold text-[#087B69] transition hover:border-[#69B9A7] hover:bg-[#ECF8F4] disabled:cursor-wait disabled:opacity-60"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} />
          {syncing ? "Refreshing" : "Refresh context"}
        </button>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4">
        {contextItems.map((item) => (
          <div key={item.title} className="min-h-36 border-b border-[#D9E7E3] p-4 sm:border-r xl:border-b-0">
            <p className="text-xs font-bold uppercase text-[#70847E]">{item.title}</p>
            <div className="mt-3 space-y-2">
              {item.lines.map((line) => (
                <p key={line} className="text-sm leading-5 text-[#274A43]">
                  {line}
                </p>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#80948F]">Source: {item.source}</p>
          </div>
        ))}
      </div>
      <p className="border-t border-[#CFE2DD] px-4 py-3 text-xs leading-5 text-[#60756F]">
        {corti.mode === "live"
          ? "A live Corti interaction is attached to this Farz+ case reference."
          : "Safe demo mode is active. No family or medical details are sent to Corti until a configured interaction is enabled."}
      </p>
    </section>
  );
}

function EventRow({
  event,
  expanded,
  corti,
  syncing,
  onSyncCorti,
}: {
  event: HandoffEvent;
  expanded: boolean;
  corti: CortiViewStatus;
  syncing: boolean;
  onSyncCorti: () => void;
}) {
  const visual = eventVisual[event.tone];
  const Icon = visual.icon;
  const isFamilyMessage = event.id === "evt-family-message";
  const isContext = event.id === "evt-corti-context";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="grid grid-cols-[42px_minmax(0,1fr)] gap-3 border-b border-[#E0ECE8] px-4 py-5 last:border-b-0 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-4"
    >
      <div className="relative">
        <span className={cn("relative z-10 grid h-9 w-9 place-items-center rounded-full border", visual.iconClass)}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="absolute left-[17px] top-9 h-[calc(100%+1.25rem)…1586 tokens truncated…esponse,
  setResponse,
  reviewState,
  onApprove,
  onEscalate,
  onFocusNote,
  ledgerExpanded,
  onToggleLedger,
  dynamicAudit,
}: {
  response: string;
  setResponse: (value: string) => void;
  reviewState: ReviewState;
  onApprove: () => void;
  onEscalate: () => void;
  onFocusNote: () => void;
  ledgerExpanded: boolean;
  onToggleLedger: () => void;
  dynamicAudit: { time: string; event: string; actor: string }[];
}) {
  const [editing, setEditing] = useState(false);
  const currentStatus = statusCopy(reviewState);
  const approved = reviewState === "approved";
  const sending = reviewState === "sending";
  const people = [
    {
      ...handoffCase.careManager,
      status: approved ? "Approved" : "In review",
      note: "Assigned at 09:22 AM",
    },
    {
      ...handoffCase.supervisor,
      status: reviewState === "escalated" ? "Review requested" : "On duty",
      note: reviewState === "escalated" ? "Notified just now" : "Available if needed",
    },
    { ...handoffCase.medicalAdvisor, status: "On call", note: "Clinical escalation only" },
  ];
  const auditEntries = [...initialAuditTrail, ...dynamicAudit];

  return (
    <aside id="decision-panel" className="scroll-mt-24 lg:sticky lg:top-20 lg:self-start">
      <section className="overflow-hidden rounded-md border border-[#CFE0DB] bg-white shadow-[0_18px_48px_rgba(20,58,53,0.08)]">
        <div className="border-b border-[#DCE9E5] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-[#087B69]">Human decision</p>
              <h2 className="mt-1 text-lg font-bold text-[#143A35]">Proposed family response</h2>
            </div>
            <button
              type="button"
              onClick={() => setEditing((value) => !value)}
              className="rounded-md border border-[#D5E4E0] px-2.5 py-1.5 text-xs font-bold text-[#087B69] hover:bg-[#F3F8F6]"
            >
              {editing ? "Done" : "Edit"}
            </button>
          </div>
          {editing ? (
            <textarea
              value={response}
              onChange={(event) => setResponse(event.target.value)}
              rows={8}
              className="mt-4 w-full resize-none rounded-md border border-[#AFCFC7] bg-[#F8FBF9] p-3 text-sm leading-6 text-[#274A43] outline-none focus:border-[#08A98A] focus:ring-2 focus:ring-[#08A98A]/15"
            />
          ) : (
            <p className="mt-4 text-sm leading-6 text-[#38534D]">{response}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded border border-[#B7DED4] bg-[#EAF8F4] px-2 py-1 text-xs font-semibold text-[#08705F]">
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </span>
            <span className="inline-flex items-center gap-1.5 rounded border border-[#D5E4E0] bg-white px-2 py-1 text-xs text-[#60756F]">
              English
            </span>
          </div>
        </div>

        <div className="border-b border-[#DCE9E5] bg-[#F8FBF9] px-5 py-4">
          <p className="text-xs font-bold uppercase text-[#70847E]">Policy boundary</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {[
              "No diagnosis or prescribing",
              "General safety guidance only",
              "Source-grounded context",
              "Human approval required",
            ].map((policy) => (
              <p key={policy} className="flex items-start gap-2 text-xs leading-5 text-[#536B66]">
                <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-[#08A98A]" />
                {policy}
              </p>
            ))}
          </div>
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStatus.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={cn("rounded-md border px-3 py-2.5", currentStatus.className)}
            >
              <p className="flex items-center gap-2 text-sm font-bold">
                <span className={cn("h-2 w-2 rounded-full", currentStatus.dot)} />
                {currentStatus.label}
              </p>
              <p className="mt-1 text-xs opacity-80">{currentStatus.detail}</p>
            </motion.div>
          </AnimatePresence>
          <button
            type="button"
            onClick={onApprove}
            disabled={approved || sending}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#006E5B] text-sm font-bold text-white transition hover:bg-[#005B4C] disabled:cursor-not-allowed disabled:bg-[#9FC8BF]"
          >
            {sending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : approved ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {sending ? "Recording approval" : approved ? "Response approved" : "Approve and send"}
          </button>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onEscalate}
              className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#D5E4E0] px-2 text-xs font-bold text-[#536B66] transition hover:border-[#D9BC6F] hover:bg-[#FFF9E9]"
            >
              <UsersRound className="h-3.5 w-3.5" />
              Supervisor
            </button>
            <button
              type="button"
              onClick={onFocusNote}
              className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#D5E4E0] px-2 text-xs font-bold text-[#536B66] transition hover:border-[#9FCFC4] hover:bg-[#F3F8F6]"
            >
              <FileText className="h-3.5 w-3.5" />
              Internal note
            </button>
          </div>
        </div>
      </section>

      <section className="mt-3 rounded-md border border-[#D5E4E0] bg-white p-4">
        <h2 className="text-sm font-bold text-[#143A35]">Escalation chain</h2>
        <div className="mt-3 grid gap-3">
          {people.map((person, index) => (
            <div key={person.name} className="relative flex items-center gap-3">
              {index < people.length - 1 ? (
                <span className="absolute left-[15px] top-8 h-6 border-l border-dashed border-[#BFD3CE]" />
              ) : null}
              <Avatar src={person.image} alt={person.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#143A35]">{person.name}</p>
                <p className="text-xs text-[#70847E]">{person.role}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#38534D]">{person.status}</p>
                <p className="mt-0.5 text-xs text-[#80948F]">{person.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-3 rounded-md border border-[#D5E4E0] bg-white p-4">
        <button type="button" onClick={onToggleLedger} className="flex w-full items-start justify-between gap-3 text-left">
          <div>
            <h2 className="text-sm font-bold text-[#143A35]">Decision ledger</h2>
            <p className="mt-1 text-xs text-[#70847E]">Why human review was required</p>
          </div>
          {ledgerExpanded ? (
            <ChevronUp className="h-4 w-4 text-[#70847E]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#70847E]" />
          )}
        </button>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3">
          {decisionLayers.map((layer, index) => {
            const Icon = decisionIcons[index];
            const humanPending = index === decisionLayers.length - 1 && !approved;
            return (
              <div key={layer.name} className="min-w-0 text-center">
                <span
                  className={cn(
                    "mx-auto grid h-8 w-8 place-items-center rounded-full border",
                    humanPending
                      ? "border-[#E2C675] bg-[#FFF8E7] text-[#8B6718]"
                      : "border-[#AFCFC7] bg-[#EFF8F5] text-[#087B69]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-1.5 text-xs leading-4 text-[#60756F]">{layer.name}</p>
              </div>
            );
          })}
        </div>
        <AnimatePresence initial={false}>
          {ledgerExpanded ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-[#DCE9E5] pt-2">
                {decisionLayers.map((layer) => (
                  <div key={layer.name} className="border-b border-[#E4EEEB] py-2 last:border-b-0">
                    <p className="text-xs font-bold text-[#38534D]">{layer.name}</p>
                    <p className="mt-1 text-xs leading-5 text-[#70847E]">{layer.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <section id="audit-trail" className="mt-3 scroll-mt-24 rounded-md border border-[#D5E4E0] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-[#143A35]">Audit trail</h2>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#087B69]">
            <LockKeyhole className="h-3.5 w-3.5" />
            Immutable
          </span>
        </div>
        <div className="mt-3">
          {auditEntries.slice(-5).map((entry, index) => (
            <div key={`${entry.time}-${entry.event}-${index}`} className="border-b border-[#E4EEEB] py-2 last:border-b-0">
              <div className="flex items-center justify-between gap-3 text-xs text-[#80948F]">
                <span>{entry.time}</span>
                <span>{entry.actor}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-[#536B66]">{entry.event}</p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

export function CarePulseWorkspace({ onSignOut }: { onSignOut: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [events, setEvents] = useState<HandoffEvent[]>(initialHandoffEvents);
  const [activeFilter, setActiveFilter] = useState<EventFilter>("all");
  const [eventsExpanded, setEventsExpanded] = useState(false);
  const [ledgerExpanded, setLedgerExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [response, setResponse] = useState<string>(handoffCase.proposedResponse);
  const [reviewState, setReviewState] = useState<ReviewState>("pending");
  const [dynamicAudit, setDynamicAudit] = useState<{ time: string; event: string; actor: string }[]>([]);
  const [corti, setCorti] = useState<CortiViewStatus>({ mode: "loading", environment: "eu", tenant: "base" });
  const [syncingCorti, setSyncingCorti] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/corti/status", { cache: "no-store" })
      .then((result) => result.json())
      .then((status: { mode?: CortiMode; environment?: string; tenant?: string }) => {
        if (!active) return;
        setCorti({
          mode: status.mode ?? "demo",
          environment: status.environment ?? "eu",
          tenant: status.tenant ?? "base",
        });
      })
      .catch(() => {
        if (active) setCorti({ mode: "demo", environment: "eu", tenant: "base" });
      });
    return () => {
      active = false;
    };
  }, []);

  function addEvent(event: HandoffEvent) {
    setEvents((current) => [...current, event]);
  }

  function addAudit(event: string, actor: string = handoffCase.careManager.name) {
    setDynamicAudit((current) => [...current, { time: currentPakistanTime(), event, actor }]);
  }

  function handleAddNote() {
    const trimmed = note.trim();
    if (!trimmed) return;
    addEvent({
      id: `evt-note-${Date.now()}`,
      time: currentPakistanTime(),
      category: "notes",
      actor: handoffCase.careManager.name,
      title: "Internal note added",
      detail: trimmed,
      meta: ["Visible to Farz+ staff only"],
      tone: "human",
    });
    addAudit("Internal case note added");
    setNote("");
    setActiveFilter("all");
  }

  function handleApprove() {
    if (reviewState === "approved" || reviewState === "sending") return;
    setReviewState("sending");
    window.setTimeout(() => {
      setReviewState("approved");
      addEvent({
        id: `evt-approved-${Date.now()}`,
        time: currentPakistanTime(),
        category: "human",
        actor: handoffCase.careManager.name,
        title: "Reviewed response approved",
        detail: "The response passed the human approval gate and is queued for family delivery.",
        meta: ["Approved by care manager", "WhatsApp delivery queue"],
        tone: "human",
      });
      addAudit("Reviewed response approved");
    }, shouldReduceMotion ? 0 : 450);
  }

  function handleEscalate() {
    if (reviewState === "escalated") return;
    setReviewState("escalated");
    addEvent({
      id: `evt-escalated-${Date.now()}`,
      time: currentPakistanTime(),
      category: "human",
      actor: handoffCase.careManager.name,
      title: "Supervisor review requested",
      detail: `${handoffCase.supervisor.name} was added to the handoff and notified of the medication-risk case.`,
      meta: ["Escalation level: Supervisor"],
      tone: "human",
    });
    addAudit("Supervisor review requested");
  }

  async function handleSyncCorti() {
    if (syncingCorti) return;
    setSyncingCorti(true);
    try {
      const result = await fetch("/api/corti/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: handoffCase.id }),
      });
      const payload = (await result.json()) as {
        mode?: "demo" | "ready" | "live";
        synced?: boolean;
        interactionId?: string;
        message?: string;
        error?: string;
      };
      if (!result.ok) throw new Error(payload.error ?? "Corti request failed.");

      setCorti((current) => ({ ...current, mode: payload.mode ?? current.mode }));
      addEvent({
        id: `evt-corti-refresh-${Date.now()}`,
        time: currentPakistanTime(),
        category: "corti",
        actor: "Corti",
        title: payload.synced ? "Live Corti interaction attached" : "Corti demo context refreshed",
        detail: payload.message ?? "Corti context refreshed.",
        meta: payload.interactionId ? [`Interaction: ${payload.interactionId}`] : undefined,
        tone: "corti",
      });
      addAudit(payload.synced ? "Corti interaction attached" : "Corti demo context refreshed", "System");
    } catch (error) {
      addEvent({
        id: `evt-corti-error-${Date.now()}`,
        time: currentPakistanTime(),
        category: "system",
        actor: "System",
        title: "Corti sync needs attention",
        detail: error instanceof Error ? error.message : "Corti request failed.",
        meta: ["No family response was affected"],
        tone: "risk",
      });
    } finally {
      setSyncingCorti(false);
    }
  }

  function navigateTo(target: string) {
    setMobileOpen(false);
    window.requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
    });
  }

  function focusNote() {
    document.getElementById("internal-note")?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "center",
    });
    window.setTimeout(() => document.getElementById("internal-note")?.focus(), shouldReduceMotion ? 0 : 350);
  }

  const latestStatus =
    reviewState === "approved"
      ? "Response approved"
      : reviewState === "escalated"
        ? "Supervisor review requested"
        : "Awaiting care-manager approval";

  return (
    <div data-platform-shell className="min-h-screen bg-[#F3F7F5] text-[#143A35] [font-synthesis:none]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[232px] border-r border-[#DCE9E5] lg:block">
        <NavigationBody corti={corti} onNavigate={navigateTo} onSignOut={onSignOut} />
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#143A35]/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-[min(86vw,300px)] border-r border-[#DCE9E5] lg:hidden"
            >
              <NavigationBody
                corti={corti}
                onNavigate={navigateTo}
                onSignOut={onSignOut}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="min-h-screen lg:pl-[232px]">
        <Topbar onMenu={() => setMobileOpen(true)} onSignOut={onSignOut} />
        <CaseOverview reviewState={reviewState} />
        <main className="mx-auto grid max-w-[1600px] gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="order-2 min-w-0 lg:order-1">
            <EventStream
              events={events}
              activeFilter={activeFilter}
              onFilter={setActiveFilter}
              expanded={eventsExpanded}
              onToggleExpanded={() => setEventsExpanded((value) => !value)}
              note={note}
              setNote={setNote}
              onAddNote={handleAddNote}
              corti={corti}
              syncing={syncingCorti}
              onSyncCorti={handleSyncCorti}
            />
          </div>
          <div className="order-1 lg:order-2">
            <DecisionPanel
              response={response}
              setResponse={setResponse}
              reviewState={reviewState}
              onApprove={handleApprove}
              onEscalate={handleEscalate}
              onFocusNote={focusNote}
              ledgerExpanded={ledgerExpanded}
              onToggleLedger={() => setLedgerExpanded((value) => !value)}
              dynamicAudit={dynamicAudit}
            />
          </div>
        </main>
        <footer className="border-t border-[#DCE9E5] bg-white px-5 py-4 text-xs text-[#70847E]">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2">
              <LockKeyhole className="h-3.5 w-3.5" />
              Consent-based access Â· {latestStatus}
            </span>
            <span>Pakistan Standard Time Â· 29 Jul 2026</span>
            <span>Farz+ coordinates care. It does not diagnose or prescribe.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

