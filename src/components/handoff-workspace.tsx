"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Bell,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  HeartHandshake,
  Home,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircle,
  MoreVertical,
  NotebookPen,
  Paperclip,
  Pill,
  Scale,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRound,
  UserRoundCheck,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
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

const sidebarItems = [
  { label: "Home", icon: Home },
  { label: "Families", icon: UsersRound },
  { label: "Care dashboard", icon: LayoutDashboard },
  { label: "Human Handoff", icon: HeartHandshake, count: 3 },
  { label: "Corti context", icon: BrainCircuit },
  { label: "Care plans", icon: ClipboardCheck },
  { label: "Medications", icon: Pill },
  { label: "Tasks", icon: ListChecks },
  { label: "Risk flags", icon: ShieldAlert },
  { label: "Reports", icon: BarChart3 },
  { label: "People", icon: UserRound },
  { label: "Admin console", icon: Settings },
] as const;

const filters: { id: EventFilter; label: string }[] = [
  { id: "all", label: "All events" },
  { id: "family", label: "Family" },
  { id: "system", label: "System" },
  { id: "corti", label: "Corti" },
  { id: "human", label: "Human" },
  { id: "notes", label: "Notes" },
];

const eventTone = {
  family: {
    icon: MessageCircle,
    iconClass: "border-[#31D6A8]/35 bg-[#31D6A8]/12 text-[#47E0B7]",
  },
  risk: {
    icon: ShieldAlert,
    iconClass: "border-[#FF5D68]/40 bg-[#FF5D68]/12 text-[#FF6E78]",
  },
  safe: {
    icon: ShieldCheck,
    iconClass: "border-[#43B0C1]/40 bg-[#43B0C1]/12 text-[#6DCCE0]",
  },
  corti: {
    icon: Sparkles,
    iconClass: "border-[#25C8AA]/35 bg-[#25C8AA]/12 text-[#54E1C7]",
  },
  human: {
    icon: UserRoundCheck,
    iconClass: "border-[#8E7DFF]/35 bg-[#8E7DFF]/12 text-[#AA9DFF]",
  },
} as const;

const panelClass = "border border-white/10 bg-[#0B1A2B]";

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
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  return (
    <span className={cn("relative block flex-none overflow-hidden rounded-full border border-white/15", sizes[size])}>
      <Image src={src} alt={alt} fill sizes="44px" className="object-cover" />
    </span>
  );
}

function Presence({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#86A0B8]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#38D6B0]" />
      {label}
    </span>
  );
}

function SidebarPerson({
  image,
  name,
  label,
}: {
  image: string;
  name: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar src={image} alt={name} />
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#081727] bg-[#38D6B0]" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-white">{name}</p>
        <Presence label={label} />
      </div>
    </div>
  );
}

function Sidebar({
  activeWorkspace,
  setActiveWorkspace,
  onSignOut,
  mobileOpen,
  onCloseMobile,
  corti,
}: {
  activeWorkspace: string;
  setActiveWorkspace: (label: string) => void;
  onSignOut: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  corti: CortiViewStatus;
}) {
  const cortiLabel =
    corti.mode === "live"
      ? "Live sync"
      : corti.mode === "ready"
        ? "Ready to enable"
        : corti.mode === "loading"
          ? "Checking"
          : "Safe demo mode";

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[212px] flex-col border-r border-white/10 bg-[#071626] transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <BrandMark />
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onCloseMobile}
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-[#9FB1C1] lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-label="Care platform">
          <div className="grid gap-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = item.label === activeWorkspace;
              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => {
                    setActiveWorkspace(item.label);
                    onCloseMobile();
                  }}
                  className={cn(
                    "flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-left text-[13px] font-medium transition",
                    active
                      ? "bg-[#0B5B5C] text-white"
                      : "text-[#A8B7C5] hover:bg-white/[0.05] hover:text-white",
                  )}
                >
                  <Icon className={cn("h-4 w-4 flex-none", active ? "text-[#5BE0C2]" : "text-[#8499AB]")} />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {"count" in item ? (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#42DAB7] px-1 text-[10px] font-extrabold text-[#061421]">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase text-[#667F94]">Active care manager</p>
            <div className="px-3">
              <SidebarPerson
                image={handoffCase.careManager.image}
                name={handoffCase.careManager.name}
                label="Online"
              />
            </div>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase text-[#667F94]">Supervisor on duty</p>
            <div className="px-3">
              <SidebarPerson
                image={handoffCase.supervisor.image}
                name={handoffCase.supervisor.name}
                label="Online"
              />
            </div>
          </div>

          <div className={cn("mt-4 rounded-md p-3", panelClass)}>
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              {corti.mode === "loading" ? (
                <Activity className="h-4 w-4 animate-pulse text-[#72C9D9]" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-[#38D6B0]" />
              )}
              Corti {corti.mode === "live" ? "connected" : "context"}
            </div>
            <p className="mt-1.5 text-[10px] leading-4 text-[#7890A5]">{cortiLabel}</p>
          </div>
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={onSignOut}
            className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-xs font-medium text-[#91A4B6] hover:bg-white/[0.05] hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#071626]/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="grid h-9 w-9 flex-none place-items-center rounded-md border border-white/10 text-[#9FB1C1] lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <h1 className="truncate text-base font-extrabold text-white sm:text-lg">Human Handoff Room</h1>
        <span className="hidden items-center gap-1.5 text-xs text-[#A5B7C6] sm:inline-flex">
          <span className="h-2 w-2 rounded-full bg-[#38D6B0]" />
          Live
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={whatsappLink("Assalam o alaikum Farz+, I need help with my parent's care.")}
          className="hidden h-9 items-center gap-2 rounded-full border border-white/15 px-4 text-xs font-semibold text-white transition hover:border-[#38D6B0]/50 hover:bg-[#38D6B0]/8 sm:inline-flex"
        >
          <MessageCircle className="h-4 w-4 text-[#38D6B0]" />
          WhatsApp
        </Link>
        <Link
          href="/contact"
          className="hidden h-9 items-center rounded-full bg-[#38D6B0] px-4 text-xs font-extrabold text-[#061421] transition hover:bg-[#E6FAF3] md:inline-flex"
        >
          Book a care call
        </Link>
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-full border border-white/10 text-[#9FB1C1] hover:text-white"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#FF5D68]" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((value) => !value)}
            aria-expanded={profileOpen}
            className="flex h-10 items-center gap-2 rounded-full px-1.5 text-left hover:bg-white/[0.05]"
          >
            <Avatar src={handoffCase.careManager.image} alt={handoffCase.careManager.name} size="sm" />
            <span className="hidden text-xs font-semibold text-white xl:inline">{handoffCase.careManager.name}</span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-[#8297A9] xl:block" />
          </button>
          {profileOpen ? (
            <div className="absolute right-0 top-12 w-48 rounded-md border border-white/10 bg-[#0A1929] p-1.5 shadow-2xl">
              <button
                type="button"
                onClick={onSignOut}
                className="flex h-10 w-full items-center gap-2 rounded px-3 text-xs text-[#C8D2DC] hover:bg-white/[0.06] hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function CaseHeader({ reviewState }: { reviewState: ReviewState }) {
  const status =
    reviewState === "approved" ? "Approved" : reviewState === "escalated" ? "Supervisor review" : "In review";
  const statusColor =
    reviewState === "approved" ? "bg-[#38D6B0]" : reviewState === "escalated" ? "bg-[#FFC857]" : "bg-[#43B0C1]";

  return (
    <section className={cn("mx-4 mt-4 rounded-md sm:mx-5", panelClass)}>
      <div className="grid min-h-20 gap-4 px-5 py-4 xl:grid-cols-[minmax(280px,1.45fr)_0.58fr_0.58fr_0.58fr_36px] xl:items-center xl:gap-0">
        <div className="xl:border-r xl:border-white/10 xl:pr-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-extrabold text-white">CASE #{handoffCase.id}</p>
            <span className="rounded bg-[#FF5D68]/18 px-2 py-1 text-[10px] font-bold text-[#FF7B83]">
              {handoffCase.risk}
            </span>
          </div>
          <p className="mt-2 text-xs text-[#8EA2B4]">Medication risk detected &nbsp;â€¢&nbsp; {handoffCase.receivedAt}</p>
        </div>
        <div className="flex items-center gap-2 xl:px-4">
          <Avatar src={handoffCase.careManager.image} alt={handoffCase.careManager.name} size="sm" />
          <div>
            <p className="text-[10px] text-[#71879B]">Assigned to</p>
            <p className="text-xs font-semibold text-white">{handoffCase.careManager.name}</p>
            <p className="text-[10px] text-[#7D92A5]">{handoffCase.careManager.role}</p>
          </div>
        </div>
        <div className="xl:border-l xl:border-white/10 xl:px-4">
          <p className="text-[10px] text-[#71879B]">Status</p>
          <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-white">
            <span className={cn("h-2 w-2 rounded-full", statusColor)} />
            {status}
          </p>
          <p className="mt-1 text-[10px] text-[#7D92A5]">
            {reviewState === "approved" ? "Queued for delivery" : "Awaiting approval"}
          </p>
        </div>
        <div className="xl:border-l xl:border-white/10 xl:px-4">
          <p className="text-[10px] text-[#71879B]">SLA</p>
          <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-white">
            <Clock3 className="h-4 w-4 text-[#9FB1C1]" />
            {handoffCase.sla}
          </p>
          <p className="mt-1 text-[10px] text-[#7D92A5]">{handoffCase.dueAt}</p>
        </div>
        <button
          type="button"
          aria-label="More case actions"
          className="hidden h-9 w-9 place-items-center rounded-md text-[#8DA0B2] hover:bg-white/[0.06] hover:text-white xl:grid"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </section>
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
  return (
    <div className="mt-4 overflow-hidden rounded-md border border-white/10 bg-[#0D2032]">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4">
        <ContextItem title="Medications" lines={handoffCase.parent.medications} source="Care plan" />
        <ContextItem title="Allergies" lines={handoffCase.parent.allergies} source="Care plan" />
        <ContextItem title="Care plan" lines={handoffCase.parent.carePlan} source="Family record" />
        <ContextItem
          title="Emergency contact"
          lines={[handoffCase.parent.emergencyContact]}
          source="Verified family profile"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-2.5">
        <p className="text-[10px] text-[#7990A4]">
          {corti.mode === "live"
            ? "Live Corti interaction attached to the Farz+ case reference."
            : "Demo context is shown locally. No family or medical details have been sent to Corti."}
        </p>
        <button
          type="button"
          onClick={onSync}
          disabled={syncing}
          className="inline-flex h-8 items-center gap-2 rounded px-3 text-[11px] font-semibold text-[#65DCC6] hover:bg-[#38D6B0]/8 disabled:cursor-wait disabled:opacity-60"
        >
          <BrainCircuit className={cn("h-3.5 w-3.5", syncing && "animate-pulse")} />
          {syncing ? "Preparing context" : "Refresh Corti context"}
        </button>
      </div>
    </div>
  );
}

function ContextItem({ title, lines, source }: { title: string; lines: readonly string[]; source: string }) {
  return (
    <div className="min-h-28 border-b border-white/10 p-4 last:border-r-0 sm:border-r xl:border-b-0">
      <p className="text-xs font-semibold text-white">{title}</p>
      <div className="mt-2 space-y-1">
        {lines.map((line) => (
          <p key={line} className="text-[11px] leading-4 text-[#C6D0D9]">
            {line}
          </p>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-[#71879A]">Source: {source}</p>
    </div>
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
  const tone = eventTone[event.tone];
  const Icon = tone.icon;
  const isContext = event.id === "evt-corti-context";
  const isFamilyMessage = event.id === "evt-family-message";

  return (
    <article className="relative grid grid-cols-[82px_minmax(0,1fr)] border-b border-white/8 py-4 last:border-b-0 sm:grid-cols-[104px_minmax(0,1fr)]">
      <div className="relative px-3 sm:px-4">
        <span className={cn("relative z-10 grid h-7 w-7 place-items-center rounded-full border", tone.iconClass)}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="absolute left-[26px] top-7 h-[calc(100%+1rem)] w-px bg-white/10 sm:left-[30px]" />
        <p className="absolute left-[46px] top-[19px] whitespace-nowrap text-[10px] text-[#8297A9] sm:left-[54px]">
          {event.time}
        </p>
        <p className="mt-2 pl-0 text-[10px] text-[#6F8498] sm:pl-10">
          {isFamilyMessage ? "Family" : event.actor}
        </p>
      </div>

      <div className="min-w-0 pr-4">
        {isFamilyMessage ? (
          <div className="flex items-start gap-3">
            <Avatar src={handoffCase.familyMember.image} alt={handoffCase.familyMember.name} size="lg" />
            <div className="min-w-0 rounded-md border border-white/10 bg-[#0D2032] px-3 py-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[12px] font-semibold text-white">{event.actor}</h3>
                {event.meta?.map((tag) => (
                  <span key={tag} className="rounded bg-[#38D6B0]/10 px-2 py-1 text-[9px] font-semibold text-[#6EDCC7]">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] leading-[1.6] text-[#D0D8DF]">{event.title}</p>
              {expanded ? <p className="mt-1 text-[10px] text-[#7E93A5]">{event.detail}</p> : null}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[13px] font-semibold text-white">{event.title}</h3>
              {event.meta?.slice(0, 1).map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "rounded px-2 py-1 text-[9px] font-semibold",
                    event.tone === "risk"
                      ? "bg-[#FF5D68]/12 text-[#FF7E87]"
                      : "bg-[#38D6B0]/10 text-[#6EDCC7]",
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-1.5 max-w-3xl text-[11px] leading-[1.65] text-[#B4C1CC]">{event.detail}</p>

            {event.meta && (expanded || event.meta.length > 1) ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {event.meta.slice(1).map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-white/10 bg-white/[0.035] px-2 py-1 text-[9px] text-[#8FA2B3]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </>
        )}

        {isContext ? <ContextGrid corti={corti} syncing={syncing} onSync={onSyncCorti} /> : null}
      </div>
    </article>
  );
}

function EventTimeline({
  events,
  activeFilter,
  onFilter,
  expanded,
  onToggleExpanded,
  note,
  setNote,
  onAddNote,
  corti,
  syncing,
  onSyncCorti,
}: {
  events: HandoffEvent[];
  activeFilter: EventFilter;
  onFilter: (filter: EventFilter) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  note: string;
  setNote: (note: string) => void;
  onAddNote: () => void;
  corti: CortiViewStatus;
  syncing: boolean;
  onSyncCorti: () => void;
}) {
  const filteredEvents = activeFilter === "all" ? events : events.filter((event) => event.category === activeFilter);

  return (
    <section className={cn("flex min-h-[650px] min-w-0 flex-col overflow-hidden rounded-md", panelClass)}>
      <div className="flex min-h-12 items-center justify-between gap-3 border-b border-white/10 px-3">
        <div className="flex min-w-0 gap-1 overflow-x-auto py-2">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter.id}
              onClick={() => onFilter(filter.id)}
              aria-pressed={activeFilter === filter.id}
              className={cn(
                "h-8 flex-none rounded-full px-3 text-[11px] font-semibold transition",
                activeFilter === filter.id
                  ? "bg-[#0B5B5C] text-[#E8FFFA]"
                  : "text-[#91A4B6] hover:bg-white/[0.05] hover:text-white",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onToggleExpanded}
          className="hidden h-8 flex-none items-center gap-2 rounded px-2 text-[10px] font-semibold text-[#8FA3B4] hover:bg-white/[0.05] hover:text-white sm:flex"
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {expanded ? "Collapse details" : "Expand all"}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-1">
        {filteredEvents.length ? (
          filteredEvents.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              expanded={expanded}
              corti={corti}
              syncing={syncing}
              onSyncCorti={onSyncCorti}
            />
          ))
        ) : (
          <div className="grid min-h-80 place-items-center px-6 text-center">
            <div>
              <FileCheck2 className="mx-auto h-7 w-7 text-[#557085]" />
              <p className="mt-3 text-sm font-semibold text-white">No events in this view</p>
              <p className="mt-1 text-xs text-[#7990A4]">Choose another event filter to continue.</p>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onAddNote();
        }}
        className="flex items-center gap-2 border-t border-white/10 bg-[#091827] p-3"
      >
        <label htmlFor="internal-note" className="sr-only">
          Add an internal note
        </label>
        <div className="relative min-w-0 flex-1">
          <input
            id="internal-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add an internal note (not shared with family)..."
            className="h-10 w-full rounded-md border border-white/10 bg-[#0C1C2D] pl-3 pr-20 text-xs text-white outline-none placeholder:text-[#61778B] focus:border-[#38D6B0]/45 focus:ring-2 focus:ring-[#38D6B0]/10"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[#6F8598]">
            <Paperclip className="h-4 w-4" />
            <NotebookPen className="h-4 w-4" />
          </div>
        </div>
        <button
          type="submit"
          disabled={!note.trim()}
          className="h-10 flex-none rounded-md bg-[#38D6B0] px-4 text-xs font-extrabold text-[#061421] transition hover:bg-[#E6FAF3] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add note
        </button>
      </form>
    </section>
  );
}

function PolicyBoundary() {
  const policies = [
    "No diagnosis or prescribing",
    "General safety guidance only",
    "Source-grounded context",
    "Human approval required",
  ];

  return (
    <section className={cn("rounded-md p-2.5", panelClass)}>
      <h2 className="text-[13px] font-semibold text-white">Policy boundary</h2>
      <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
        {policies.map((policy) => (
          <p key={policy} className="flex items-start gap-1.5 text-[9px] leading-[0.9rem] text-[#B6C2CC]">
            <Check className="mt-0.5 h-3 w-3 flex-none text-[#38D6B0]" />
            {policy}
          </p>
        ))}
      </div>
    </section>
  );
}

function ApprovalPanel({
  reviewState,
  onApprove,
  onEscalate,
  onFocusNote,
}: {
  reviewState: ReviewState;
  onApprove: () => void;
  onEscalate: () => void;
  onFocusNote: () => void;
}) {
  const approved = reviewState === "approved";
  const sending = reviewState === "sending";

  return (
    <section className={cn("rounded-md p-2.5", panelClass)}>
      <h2 className="text-[13px] font-semibold text-white">Approval</h2>
      <p className="mt-0.5 text-[9px] text-[#8196A8]">
        {approved ? "Reviewed response approved and queued." : "Awaiting your approval"}
      </p>
      <button
        type="button"
        onClick={onApprove}
        disabled={approved || sending}
        className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#38D6B0] text-xs font-extrabold text-[#061421] transition hover:bg-[#E6FAF3] disabled:cursor-not-allowed disabled:bg-[#1A6A60] disabled:text-[#A8D9D0]"
      >
        {approved ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        {sending ? "Approving..." : approved ? "Response approved" : "Approve and send"}
      </button>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={onEscalate}
          className="flex min-h-8 items-center justify-center gap-2 rounded-md border border-white/10 px-2 text-[9px] font-semibold text-[#C7D2DB] hover:border-[#FFC857]/35 hover:bg-[#FFC857]/8 hover:text-white"
        >
          <UsersRound className="h-3.5 w-3.5" />
          Supervisor review
        </button>
        <button
          type="button"
          onClick={onFocusNote}
          className="flex min-h-8 items-center justify-center gap-2 rounded-md border border-white/10 px-2 text-[9px] font-semibold text-[#C7D2DB] hover:border-[#38D6B0]/35 hover:bg-[#38D6B0]/8 hover:text-white"
        >
          <FileText className="h-3.5 w-3.5" />
          Add internal note
        </button>
      </div>
    </section>
  );
}

function EscalationChain({ reviewState }: { reviewState: ReviewState }) {
  const people = [
    {
      ...handoffCase.careManager,
      status: reviewState === "approved" ? "Approved" : "In review",
      note: "Since 09:22 AM",
    },
    {
      ...handoffCase.supervisor,
      status: reviewState === "escalated" ? "Review requested" : "On duty",
      note: reviewState === "escalated" ? "Just now" : "Escalate if needed",
    },
    {
      ...handoffCase.medicalAdvisor,
      status: "On call",
      note: "For escalations",
    },
  ];

  return (
    <section className={cn("rounded-md p-2.5", panelClass)}>
      <h2 className="text-[13px] font-semibold text-white">Escalation chain</h2>
      <div className="mt-2 grid gap-2">
        {people.map((person, index) => (
          <div key={person.name} className="relative flex items-center gap-3">
            {index < people.length - 1 ? (
              <span className="absolute left-[13px] top-7 h-5 border-l border-dashed border-white/20" />
            ) : null}
            <Avatar src={person.image} alt={person.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-white">{person.name}</p>
              <p className="text-[9px] text-[#778DA0]">{person.role}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-medium text-[#C5D0D9]">{person.status}</p>
              <p className="mt-0.5 text-[9px] text-[#6F8598]">{person.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const decisionIcons = [ShieldAlert, BrainCircuit, FileCheck2, Scale, CheckCircle2, UserRoundCheck];

function DecisionLedger({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <section className={cn("rounded-md p-3", panelClass)}>
      <button type="button" onClick={onToggle} className="flex w-full items-start justify-between gap-3 text-left">
        <div>
          <h2 className="text-sm font-semibold text-white">Decision ledger</h2>
          <p className="mt-1 text-[10px] text-[#8095A7]">Why this case requires human review</p>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-semibold text-[#8FA3B4]">
          {expanded ? "Collapse" : "Expand"}
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </span>
      </button>
      <div className="mt-4 grid grid-cols-6 gap-1">
        {decisionLayers.map((layer, index) => {
          const Icon = decisionIcons[index];
          return (
            <div key={layer.name} className="min-w-0 text-center">
              <span className="mx-auto grid h-7 w-7 place-items-center rounded-full border border-white/15 text-[#9FB0BF]">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <p className="mt-1.5 text-[8px] leading-3 text-[#93A6B6]">{layer.name}</p>
              <CheckCircle2 className="mx-auto mt-1 h-3 w-3 text-[#38D6B0]" />
            </div>
          );
        })}
      </div>
      {expanded ? (
        <div className="mt-4 border-t border-white/10 pt-3">
          {decisionLayers.map((layer) => (
            <div key={layer.name} className="grid grid-cols-[88px_1fr] gap-3 border-b border-white/8 py-2 last:border-b-0">
              <p className="text-[9px] font-semibold text-white">{layer.name}</p>
              <p className="text-[9px] leading-4 text-[#7F94A6]">{layer.detail}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function AuditTrail({
  dynamicAudit,
}: {
  dynamicAudit: { time: string; event: string; actor: string }[];
}) {
  const entries = [...initialAuditTrail, ...dynamicAudit];
  return (
    <section className={cn("rounded-md p-3", panelClass)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-white">Audit trail (immutable)</h2>
        <button type="button" className="text-[9px] font-semibold text-[#63C4E0] hover:text-[#A7E9F8]">
          View audit log
        </button>
      </div>
      <div className="mt-2">
        {entries.slice(-4).map((entry, index) => (
          <div
            key={`${entry.time}-${entry.event}-${index}`}
            className="grid grid-cols-[56px_minmax(0,1fr)_56px] gap-2 border-b border-white/8 py-1.5 text-[9px] last:border-b-0"
          >
            <span className="text-[#71879A]">{entry.time}</span>
            <span className="truncate text-[#AEBCC8]">{entry.event}</span>
            <span className="truncate text-right text-[#71879A]">{entry.actor}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DecisionRail({
  response,
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
  setResponse: (response: string) => void;
  reviewState: ReviewState;
  onApprove: () => void;
  onEscalate: () => void;
  onFocusNote: () => void;
  ledgerExpanded: boolean;
  onToggleLedger: () => void;
  dynamicAudit: { time: string; event: string; actor: string }[];
}) {
  const [editing, setEditing] = useState(false);

  return (
    <aside className="grid content-start gap-1.5">
      <section className={cn("rounded-md p-2.5", panelClass)}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[13px] font-semibold text-white">Proposed response (reviewed)</h2>
          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            className="text-[10px] font-semibold text-[#59D6BE] hover:text-[#A4F4E4]"
          >
            {editing ? "Finish editing" : "Edit"}
          </button>
        </div>
        {editing ? (
          <textarea
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            rows={7}
            className="mt-3 w-full resize-none rounded-md border border-[#38D6B0]/30 bg-[#081726] p-3 text-[11px] leading-[1.65] text-[#CED8E0] outline-none focus:ring-2 focus:ring-[#38D6B0]/10"
          />
        ) : (
          <p className="mt-2 text-[10px] leading-[1.55] text-[#C5D0D9]">{response}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-2 text-[9px] text-[#88A0B3]">
          <span className="inline-flex items-center gap-1 rounded bg-[#38D6B0]/8 px-2 py-1 text-[#62D9C2]">
            <MessageCircle className="h-3 w-3" /> Channel: WhatsApp
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-white/[0.04] px-2 py-1">
            <Activity className="h-3 w-3" /> Language: English
          </span>
        </div>
      </section>

      <PolicyBoundary />
      <ApprovalPanel
        reviewState={reviewState}
        onApprove={onApprove}
        onEscalate={onEscalate}
        onFocusNote={onFocusNote}
      />
      <EscalationChain reviewState={reviewState} />
      <DecisionLedger expanded={ledgerExpanded} onToggle={onToggleLedger} />
      <AuditTrail dynamicAudit={dynamicAudit} />
    </aside>
  );
}

function WorkspacePlaceholder({
  title,
  onReturn,
}: {
  title: string;
  onReturn: () => void;
}) {
  return (
    <section className="grid min-h-[calc(100vh-64px)] place-items-center px-6">
      <div className="max-w-md text-center">
        <CircleHelp className="mx-auto h-9 w-9 text-[#4C6A80]" />
        <h2 className="mt-5 text-2xl font-extrabold text-white">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-[#8FA3B4]">
          This workspace is represented in the platform navigation. The current implementation pass is focused on the
          complete human-handoff workflow.
        </p>
        <button
          type="button"
          onClick={onReturn}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-[#38D6B0] px-4 text-xs font-extrabold text-[#061421]"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Human Handoff
        </button>
      </div>
    </section>
  );
}

export function HandoffWorkspace({ onSignOut }: { onSignOut: () => void }) {
  const [activeWorkspace, setActiveWorkspace] = useState("Human Handoff");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [events, setEvents] = useState<HandoffEvent[]>(initialHandoffEvents);
  const [activeFilter, setActiveFilter] = useState<EventFilter>("all");
  const [eventsExpanded, setEventsExpanded] = useState(false);
  const [ledgerExpanded, setLedgerExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [response, setResponse] = useState<string>(handoffCase.proposedResponse);
  const [reviewState, setReviewState] = useState<ReviewState>("pending");
  const [dynamicAudit, setDynamicAudit] = useState<{ time: string; event: string; actor: string }[]>([]);
  const [corti, setCorti] = useState<CortiViewStatus>({
    mode: "loading",
    environment: "eu",
    tenant: "base",
  });
  const [syncingCorti, setSyncingCorti] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/corti/status", { cache: "no-store" })
      .then((response) => response.json())
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

  const latestStatus =
    reviewState === "approved"
      ? "Response approved"
      : reviewState === "escalated"
        ? "Supervisor review requested"
        : "Awaiting care-manager approval";

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
    }, 450);
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
      const response = await fetch("/api/corti/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: handoffCase.id }),
      });
      const payload = (await response.json()) as {
        mode?: "demo" | "ready" | "live";
        synced?: boolean;
        interactionId?: string;
        message?: string;
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error ?? "Corti request failed.");

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

  function focusNote() {
    document.getElementById("internal-note")?.focus();
  }

  return (
    <div
      data-platform-shell
      className="min-h-screen bg-[#061321] text-white [font-synthesis:none] selection:bg-[#38D6B0]/30"
    >
      <Sidebar
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        onSignOut={onSignOut}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        corti={corti}
      />

      <div className="min-h-screen lg:pl-[212px]">
        <Topbar onMenu={() => setMobileOpen(true)} onSignOut={onSignOut} />
        {activeWorkspace === "Human Handoff" ? (
          <>
            <CaseHeader reviewState={reviewState} />
            <div className="grid gap-3 px-4 pb-5 pt-3 sm:px-5 xl:grid-cols-[minmax(0,1fr)_410px]">
              <EventTimeline
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
              <DecisionRail
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
            <footer className="flex min-h-10 flex-wrap items-center justify-between gap-2 border-t border-white/10 px-5 py-2 text-[10px] text-[#667F94]">
              <span className="inline-flex items-center gap-2">
                <LockKeyhole className="h-3.5 w-3.5" />
                Consent-based access â€¢ {latestStatus}
              </span>
              <span>Pakistan Standard Time (PKT) &nbsp;|&nbsp; 29 Jul 2026</span>
              <span>Â© 2026 Farz+. Care coordination, not diagnosis.</span>
            </footer>
          </>
        ) : (
          <WorkspacePlaceholder title={activeWorkspace} onReturn={() => setActiveWorkspace("Human Handoff")} />
        )}
      </div>
    </div>
  );
}
