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
  onSync: () => ãù¶‰žËkºwµçq‘¥Ø±…ÍÍ9…µ”ô‰µ¥¸µÜ´À™±•à´Äˆø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰ÑÉÕ¹…Ñ”Ñ•áÐµlÄÅÁát™½¹ÐµÍ•µ¥‰½±Ñ•áÐµÝ¡¥Ñ”ˆùíÁ•ÉÍ½¸¹¹…µ•ôð½Àø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áÐµlåÁátÑ•áÐµlŒÜÜáÁtˆùíÁ•ÉÍ½¸¹É½±•ôð½Àø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰Ñ•áÐµÉ¥¡Ðˆø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áÐµlåÁát™½¹Ðµµ•‘¥Õ´Ñ•áÐµlÕÁåtˆùíÁ•ÉÍ½¸¹ÍÑ…ÑÕÍôð½Àø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰µÐ´À¸ÔÑ•áÐµlåÁátÑ•áÐµlŒÙàÔäátˆùíÁ•ÉÍ½¸¹¹½Ñ•ôð½Àø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€¤¥ô(€€€€€€ð½‘¥Øø(€€€€ð½Í•Ñ¥½¸ø(€€¤ì)ô()½¹ÍÐ‘•¥Í¥½¹%½¹Ì€ômM¡¥•±‘±•ÉÐ°	É…¥¹¥ÉÕ¥Ð°¥±•¡•¬È°M…±”°¡•­¥É±”È°UÍ•ÉI½Õ¹‘¡•­tì()™Õ¹Ñ¥½¸•¥Í¥½¹1•‘•È¡ì•áÁ…¹‘•°½¹Q½±”ôèì•áÁ…¹‘•è‰½½±•…¸ì½¹Q½±”è€ ¤€ôøÙ½¥ô¤ì(€É•ÑÕÉ¸€ (€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”õí¸ ‰É½Õ¹‘•µµÀ´Ìˆ°Á…¹•±±…ÍÌ¥ôø(€€€€€€ñ‰ÕÑÑ½¸ÑåÁ”ô‰‰ÕÑÑ½¸ˆ½¹±¥¬õí½¹Q½±•ô±…ÍÍ9…µ”ô‰™±•àÜµ™Õ±°¥Ñ•µÌµÍÑ…ÉÐ©ÕÍÑ¥™äµ‰•ÑÝ••¸…À´ÌÑ•áÐµ±•™Ðˆø(€€€€€€€€ñ‘¥Øø(€€€€€€€€€€ñ È±…ÍÍ9…µ”ô‰Ñ•áÐµÍ´™½¹ÐµÍ•µ¥‰½±Ñ•áÐµÝ¡¥Ñ”ˆù•¥Í¥½¸±•‘•Èð½ Èø(€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰µÐ´ÄÑ•áÐµlÄÁÁátÑ•áÐµlŒàÀäÕÝtˆù]¡äÑ¡¥Ì…Í”É•ÅÕ¥É•Ì¡Õµ…¸É•Ù¥•Üð½Àø(€€€€€€€€ð½‘¥Øø(€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰™±•à¥Ñ•µÌµ•¹Ñ•È…À´ÄÑ•áÐµlåÁát™½¹ÐµÍ•µ¥‰½±Ñ•áÐµlŒáÍÑtˆø(€€€€€€€€€í•áÁ…¹‘•€ü€‰½±±…ÁÍ”ˆ€è€‰áÁ…¹‰ô(€€€€€€€€€í•áÁ…¹‘•€ü€ñ¡•ÙÉ½¹UÀ±…ÍÍ9…µ”ô‰ ´ÌÜ´Ìˆ€¼ø€è€ñ¡•ÙÉ½¹½Ý¸±…ÍÍ9…µ”ô‰ ´ÌÜ´Ìˆ€¼ùô(€€€€€€€€ð½ÍÁ…¸ø(€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µÐ´ÐÉ¥É¥µ½±Ì´Ø…À´Äˆø(€€€€€€€í‘•¥Í¥½¹1…å•ÉÌ¹µ…À ¡±…å•È°¥¹‘•à¤€ôøì(€€€€€€€€€½¹ÍÐ%½¸€ô‘•¥Í¥½¹%½¹Ím¥¹‘•átì(€€€€€€€€€É•ÑÕÉ¸€ (€€€€€€€€€€€€ñ‘¥Ø­•äõí±…å•È¹¹…µ•ô±…ÍÍ9…µ”ô‰µ¥¸µÜ´ÀÑ•áÐµ•¹Ñ•Èˆø(€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰µàµ…ÕÑ¼É¥ ´ÜÜ´ÜÁ±…”µ¥Ñ•µÌµ•¹Ñ•ÈÉ½Õ¹‘•µ™Õ±°‰½É‘•È‰½É‘•ÈµÝ¡¥Ñ”¼ÄÔÑ•áÐµlŒåÁ	tˆø(€€€€€€€€€€€€€€€€ñ%½¸±…ÍÍ9…µ”ô‰ ´Ì¸ÔÜ´Ì¸Ôˆ€¼ø(€€€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰µÐ´Ä¸ÔÑ•áÐµláÁát±•…‘¥¹œ´ÌÑ•áÐµlŒäÍÙÙtˆùí±…å•È¹¹…µ•ôð½Àø(€€€€€€€€€€€€€€ñ¡•­¥É±”È±…ÍÍ9…µ”ô‰µàµ…ÕÑ¼µÐ´Ä ´ÌÜ´ÌÑ•áÐµlŒÌáÙÁtˆ€¼ø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€¤ì(€€€€€€€ô¥ô(€€€€€€ð½‘¥Øø(€€€€€í•áÁ…¹‘•€ü€ (€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µÐ´Ð‰½É‘•ÈµÐ‰½É‘•ÈµÝ¡¥Ñ”¼ÄÀÁÐ´Ìˆø(€€€€€€€€€í‘•¥Í¥½¹1…å•ÉÌ¹µ…À ¡±…å•È¤€ôø€ (€€€€€€€€€€€€ñ‘¥Ø­•äõí±…å•È¹¹…µ•ô±…ÍÍ9…µ”ô‰É¥É¥µ½±ÌµlàáÁá|Å™Ét…À´Ì‰½É‘•Èµˆ‰½É‘•ÈµÝ¡¥Ñ”¼àÁä´È±…ÍÐé‰½É‘•Èµˆ´Àˆø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áÐµlåÁát™½¹ÐµÍ•µ¥‰½±Ñ•áÐµÝ¡¥Ñ”ˆùí±…å•È¹¹…µ•ôð½Àø(€€€€€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áÐµlåÁát±•…‘¥¹œ´ÐÑ•áÐµlŒÝäÑÙtˆùí±…å•È¹‘•Ñ…¥±ôð½Àø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€¤¥ô(€€€€€€€€ð½‘¥Øø(€€€€€€¤€è¹Õ±±ô(€€€€ð½Í•Ñ¥½¸ø(€€¤ì)ô()™Õ¹Ñ¥½¸Õ‘¥ÑQÉ…¥°¡ì(€‘å¹…µ¥Õ‘¥Ð°)ôèì(€‘å¹…µ¥Õ‘¥ÐèìÑ¥µ”èÍÑÉ¥¹œì•Ù•¹ÐèÍÑÉ¥¹œì…Ñ½ÈèÍÑÉ¥¹œõmtì)ô¤ì(€½¹ÍÐ•¹ÑÉ¥•Ì€ôl¸¸¹¥¹¥Ñ¥…±Õ‘¥ÑQÉ…¥°°€¸¸¹‘å¹…µ¥Õ‘¥Ñtì(€É•ÑÕÉ¸€ (€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”õí¸ ‰É½Õ¹‘•µµÀ´Ìˆ°Á…¹•±±…ÍÌ¥ôø(€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ‰•ÑÝ••¸…À´Ìˆø(€€€€€€€€ñ È±…ÍÍ9…µ”ô‰Ñ•áÐµÍ´™½¹ÐµÍ•µ¥‰½±Ñ•áÐµÝ¡¥Ñ”ˆùÕ‘¥ÐÑÉ…¥°€¡¥µµÕÑ…‰±”¤ð½ Èø(€€€€€€€€ñ‰ÕÑÑ½¸ÑåÁ”ô‰‰ÕÑÑ½¸ˆ±…ÍÍ9…µ”ô‰Ñ•áÐµlåÁát™½¹ÐµÍ•µ¥‰½±Ñ•áÐµlŒØÍÑÁt¡½Ù•ÈéÑ•áÐµlÝåátˆø(€€€€€€€€€Y¥•Ü…Õ‘¥Ð±½œ(€€€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€ð½‘¥Øø(€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µÐ´Èˆø(€€€€€€€í•¹ÑÉ¥•Ì¹Í±¥” ´Ð¤¹µ…À ¡•¹ÑÉä°¥¹‘•à¤€ôø€ (€€€€€€€€€€ñ‘¥Ø(€€€€€€€€€€€­•äõí€‘í•¹ÑÉä¹Ñ¥µ•ô´‘í•¹ÑÉä¹•Ù•¹Ñô´‘í¥¹‘•áõô(€€€€€€€€€€€±…ÍÍ9…µ”ô‰É¥É¥µ½±ÌµlÔÙÁá}µ¥¹µ…à À°Å™È¥|ÔÙÁát…À´È‰½É‘•Èµˆ‰½É‘•ÈµÝ¡¥Ñ”¼àÁä´Ä¸ÔÑ•áÐµlåÁát±…ÍÐé‰½É‘•Èµˆ´Àˆ(€€€€€€€€€€ø(€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ•áÐµlŒÜÄàÜåtˆùí•¹ÑÉä¹Ñ¥µ•ôð½ÍÁ…¸ø(€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰ÑÉÕ¹…Ñ”Ñ•áÐµl	átˆùí•¹ÑÉä¹•Ù•¹Ñôð½ÍÁ…¸ø(€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰ÑÉÕ¹…Ñ”Ñ•áÐµÉ¥¡ÐÑ•áÐµlŒÜÄàÜåtˆùí•¹ÑÉä¹…Ñ½Éôð½ÍÁ…¸ø(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€¤¥ô(€€€€€€ð½‘¥Øø(€€€€ð½Í•Ñ¥½¸ø(€€¤ì)ô()™Õ¹Ñ¥½¸•¥Í¥½¹I…¥°¡ì(€É•ÍÁ½¹Í”°(€Í•ÑI•ÍÁ½¹Í”°(€É•Ù¥•ÝMÑ…Ñ”°(€½¹ÁÁÉ½Ù”°(€½¹Í…±…Ñ”°(€½¹½ÕÍ9½Ñ”°(€±•‘•ÉáÁ…¹‘•°(€½¹Q½±•1•‘•È°(€‘å¹…µ¥Õ‘¥Ð°)ôèì(€É•ÍÁ½¹Í”èÍÑÉ¥¹œì(€Í•ÑI•ÍÁ½¹Í”è€¡É•ÍÁ½¹Í”èÍÑÉ¥¹œ¤€ôøÙ½¥ì(€É•Ù¥•ÝMÑ…Ñ”èI•Ù¥•ÝMÑ…Ñ”ì(€½¹ÁÁÉ½Ù”è€ ¤€ôøÙ½¥ì(€½¹Í…±…Ñ”è€ ¤€ôøÙ½¥ì(€½¹½ÕÍ9½Ñ”è€ ¤€ôøÙ½¥ì(€±•‘•ÉáÁ…¹‘•è‰½½±•…¸ì(€½¹Q½±•1•‘•Èè€ ¤€ôøÙ½¥ì(€‘å¹…µ¥Õ‘¥ÐèìÑ¥µ”èÍÑÉ¥¹œì•Ù•¹ÐèÍÑÉ¥¹œì…Ñ½ÈèÍÑÉ¥¹œõmtì)ô¤ì(€½¹ÍÐm•‘¥Ñ¥¹œ°Í•Ñ‘¥Ñ¥¹t€ôÕÍ•MÑ…Ñ”¡™…±Í”¤ì((€É•ÑÕÉ¸€ (€€€€ñ…Í¥‘”±…ÍÍ9…µ”ô‰É¥½¹Ñ•¹ÐµÍÑ…ÉÐ…À´Ä¸Ôˆø(€€€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”õí¸ ‰É½Õ¹‘•µµÀ´È¸Ôˆ°Á…¹•±±…ÍÌ¥ôø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰™±•à¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ‰•ÑÝ••¸…À´Ìˆø(€€€€€€€€€€ñ È±…ÍÍ9…µ”ô‰Ñ•áÐµlÄÍÁát™½¹ÐµÍ•µ¥‰½±Ñ•áÐµÝ¡¥Ñ”ˆùAÉ½Á½Í•É•ÍÁ½¹Í”€¡É•Ù¥•Ý•¤ð½ Èø(€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€ÑåÁ”ô‰‰ÕÑÑ½¸ˆ(€€€€€€€€€€€½¹±¥¬õì ¤€ôøÍ•Ñ‘¥Ñ¥¹œ ¡Ù…±Õ”¤€ôø€…Ù…±Õ”¥ô(€€€€€€€€€€€±…ÍÍ9…µ”ô‰Ñ•áÐµlÄÁÁát™½¹ÐµÍ•µ¥‰½±Ñ•áÐµlŒÔåÙ	t¡½Ù•ÈéÑ•áÐµlÑÑÑtˆ(€€€€€€€€€€ø(€€€€€€€€€€€í•‘¥Ñ¥¹œ€ü€‰¥¹¥Í •‘¥Ñ¥¹œˆ€è€‰‘¥Ð‰ô(€€€€€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€€€ð½‘¥Øø(€€€€€€€í•‘¥Ñ¥¹œ€ü€ (€€€€€€€€€€ñÑ•áÑ…É•„(€€€€€€€€€€€Ù…±Õ”õíÉ•ÍÁ½¹Í•ô(€€€€€€€€€€€½¹¡…¹”õì¡•Ù•¹Ð¤€ôøÍ•ÑI•ÍÁ½¹Í”¡•Ù•¹Ð¹Ñ…É•Ð¹Ù…±Õ”¥ô(€€€€€€€€€€€É½ÝÌõìÝô(€€€€€€€€€€€±…ÍÍ9…µ”ô‰µÐ´ÌÜµ™Õ±°É•Í¥é”µ¹½¹”É½Õ¹‘•µµ‰½É‘•È‰½É‘•ÈµlŒÌáÙÁt¼ÌÀ‰œµlŒÀàÄÜÈÙtÀ´ÌÑ•áÐµlÄÅÁát±•…‘¥¹œµlÄ¸ØÕtÑ•áÐµláÁt½ÕÑ±¥¹”µ¹½¹”™½ÕÌéÉ¥¹œ´È™½ÕÌéÉ¥¹œµlŒÌáÙÁt¼ÄÀˆ(€€€€€€€€€€¼ø(€€€€€€€€¤€è€ (€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰µÐ´ÈÑ•áÐµlÄÁÁát±•…‘¥¹œµlÄ¸ÔÕtÑ•áÐµlÕÁåtˆùíÉ•ÍÁ½¹Í•ôð½Àø(€€€€€€€€¥ô(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µÐ´È™±•à™±•àµÝÉ…À…À´ÈÑ•áÐµlåÁátÑ•áÐµlŒàáÁÍtˆø(€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰¥¹±¥¹”µ™±•à¥Ñ•µÌµ•¹Ñ•È…À´ÄÉ½Õ¹‘•‰œµlŒÌáÙÁt¼àÁà´ÈÁä´ÄÑ•áÐµlŒØÉåÉtˆø(€€€€€€€€€€€€ñ5•ÍÍ…•¥É±”±…ÍÍ9…µ”ô‰ ´ÌÜ´Ìˆ€¼ø¡…¹¹•°è]¡…ÑÍÁÀ(€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰¥¹±¥¹”µ™±•à¥Ñ•µÌµ•¹Ñ•È…À´ÄÉ½Õ¹‘•‰œµÝ¡¥Ñ”½lÀ¸ÀÑtÁà´ÈÁä´Äˆø(€€€€€€€€€€€€ñÑ¥Ù¥Ñä±…ÍÍ9…µ”ô‰ ´ÌÜ´Ìˆ€¼ø1…¹Õ…”è¹±¥Í (€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€ð½‘¥Øø(€€€€€€ð½Í•Ñ¥½¸ø((€€€€€€ñA½±¥å	½Õ¹‘…Éä€¼ø(€€€€€€ñÁÁÉ½Ù…±A…¹•°(€€€€€€€É•Ù¥•ÝMÑ…Ñ”õíÉ•Ù¥•ÝMÑ…Ñ•ô(€€€€€€€½¹ÁÁÉ½Ù”õí½¹ÁÁÉ½Ù•ô(€€€€€€€½¹Í…±…Ñ”õí½¹Í…±…Ñ•ô(€€€€€€€½¹½ÕÍ9½Ñ”õí½¹½ÕÍ9½Ñ•ô(€€€€€€¼ø(€€€€€€ñÍ…±…Ñ¥½¹¡…¥¸É•Ù¥•ÝMÑ…Ñ”õíÉ•Ù¥•ÝMÑ…Ñ•ô€¼ø(€€€€€€ñ•¥Í¥½¹1•‘•È•áÁ…¹‘•õí±•‘•ÉáÁ…¹‘•‘ô½¹Q½±”õí½¹Q½±•1•‘•Éô€¼ø(€€€€€€ñÕ‘¥ÑQÉ…¥°‘å¹…µ¥Õ‘¥Ðõí‘å¹…µ¥Õ‘¥Ñô€¼ø(€€€€ð½…Í¥‘”ø(€€¤ì)ô()™Õ¹Ñ¥½¸]½É­ÍÁ…•A±…•¡½±‘•È¡ì(€Ñ¥Ñ±”°(€½¹I•ÑÕÉ¸°)ôèì(€Ñ¥Ñ±”èÍÑÉ¥¹œì(€½¹I•ÑÕÉ¸è€ ¤€ôøÙ½¥ì)ô¤ì(€É•ÑÕÉ¸€ (€€€€ñÍ•Ñ¥½¸±…ÍÍ9…µ”ô‰É¥µ¥¸µ µm…±Œ ÄÀÁÙ ´ØÑÁà¥tÁ±…”µ¥Ñ•µÌµ•¹Ñ•ÈÁà´Øˆø(€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µ…àµÜµµÑ•áÐµ•¹Ñ•Èˆø(€€€€€€€€ñ¥É±•!•±À±…ÍÍ9…µ”ô‰µàµ…ÕÑ¼ ´äÜ´äÑ•áÐµlŒÑÙàÁtˆ€¼ø(€€€€€€€€ñ È±…ÍÍ9…µ”ô‰µÐ´ÔÑ•áÐ´Éá°™½¹Ðµ•áÑÉ…‰½±Ñ•áÐµÝ¡¥Ñ”ˆùíÑ¥Ñ±•ôð½ Èø(€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰µÐ´ÌÑ•áÐµÍ´±•…‘¥¹œ´ÜÑ•áÐµlŒáÍÑtˆø(€€€€€€€€€Q¡¥ÌÝ½É­ÍÁ…”¥ÌÉ•ÁÉ•Í•¹Ñ•¥¸Ñ¡”Á±…Ñ™½É´¹…Ù¥…Ñ¥½¸¸Q¡”ÕÉÉ•¹Ð¥µÁ±•µ•¹Ñ…Ñ¥½¸Á…ÍÌ¥Ì™½ÕÍ•½¸Ñ¡”(€€€€€€€€€½µÁ±•Ñ”¡Õµ…¸µ¡…¹‘½™˜Ý½É­™±½Ü¸(€€€€€€€€ð½Àø(€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€ÑåÁ”ô‰‰ÕÑÑ½¸ˆ(€€€€€€€€€½¹±¥¬õí½¹I•ÑÕÉ¹ô(€€€€€€€€€±…ÍÍ9…µ”ô‰µÐ´Ø¥¹±¥¹”µ™±•à ´ÄÀ¥Ñ•µÌµ•¹Ñ•È…À´ÈÉ½Õ¹‘•µµ‰œµlŒÌáÙÁtÁà´ÐÑ•áÐµáÌ™½¹Ðµ•áÑÉ…‰½±Ñ•áÐµlŒÀØÄÐÈÅtˆ(€€€€€€€€ø(€€€€€€€€€€ñÉÉ½Ý1•™Ð±…ÍÍ9…µ”ô‰ ´ÐÜ´Ðˆ€¼ø(€€€€€€€€€I•ÑÕÉ¸Ñ¼!Õµ…¸!…¹‘½™˜(€€€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€ð½‘¥Øø(€€€€ð½Í•Ñ¥½¸ø(€€¤ì)ô()•áÁ½ÉÐ™Õ¹Ñ¥½¸!…¹‘½™™]½É­ÍÁ…”¡ì½¹M¥¹=ÕÐôèì½¹M¥¹=ÕÐè€ ¤€ôøÙ½¥ô¤ì(€½¹ÍÐm…Ñ¥Ù•]½É­ÍÁ…”°Í•ÑÑ¥Ù•]½É­ÍÁ…•t€ôÕÍ•MÑ…Ñ” ‰!Õµ…¸!…¹‘½™˜ˆ¤ì(€½¹ÍÐmµ½‰¥±•=Á•¸°Í•Ñ5½‰¥±•=Á•¹t€ôÕÍ•MÑ…Ñ”¡™…±Í”¤ì(€½¹ÍÐm•Ù•¹ÑÌ°Í•ÑÙ•¹ÑÍt€ôÕÍ•MÑ…Ñ”ñ!…¹‘½™™Ù•¹Ñmtø¡¥¹¥Ñ¥…±!…¹‘½™™Ù•¹ÑÌ¤ì(€½¹ÍÐm…Ñ¥Ù•¥±Ñ•È°Í•ÑÑ¥Ù•¥±Ñ•Ét€ôÕÍ•MÑ…Ñ”ñÙ•¹Ñ¥±Ñ•Èø ‰…±°ˆ¤ì(€½¹ÍÐm•Ù•¹ÑÍáÁ…¹‘•°Í•ÑÙ•¹ÑÍáÁ…¹‘•‘t€ôÕÍ•MÑ…Ñ”¡™…±Í”¤ì(€½¹ÍÐm±•‘•ÉáÁ…¹‘•°Í•Ñ1•‘•ÉáÁ…¹‘•‘t€ôÕÍ•MÑ…Ñ”¡™…±Í”¤ì(€½¹ÍÐm¹½Ñ”°Í•Ñ9½Ñ•t€ôÕÍ•MÑ…Ñ” ˆˆ¤ì(€½¹ÍÐmÉ•ÍÁ½¹Í”°Í•ÑI•ÍÁ½¹Í•t€ôÕÍ•MÑ…Ñ”ñÍÑÉ¥¹œø¡¡…¹‘½™™…Í”¹ÁÉ½Á½Í•‘I•ÍÁ½¹Í”¤ì(€½¹ÍÐmÉ•Ù¥•ÝMÑ…Ñ”°Í•ÑI•Ù¥•ÝMÑ…Ñ•t€ôÕÍ•MÑ…Ñ”ñI•Ù¥•ÝMÑ…Ñ”ø ‰Á•¹‘¥¹œˆ¤ì(€½¹ÍÐm‘å¹…µ¥Õ‘¥Ð°Í•Ñå¹…µ¥Õ‘¥Ñt€ôÕÍ•MÑ…Ñ”ñìÑ¥µ”èÍÑÉ¥¹œì•Ù•¹ÐèÍÑÉ¥¹œì…Ñ½ÈèÍÑÉ¥¹œõmtø¡mt¤ì(€½¹ÍÐm½ÉÑ¤°Í•Ñ½ÉÑ¥t€ôÕÍ•MÑ…Ñ”ñ½ÉÑ¥Y¥•ÝMÑ…ÑÕÌø¡ì(€€€µ½‘”è€‰±½…‘¥¹œˆ°(€€€•¹Ù¥É½¹µ•¹Ðè€‰•Ôˆ°(€€€Ñ•¹…¹Ðè€‰‰…Í”ˆ°(€ô¤ì(€½¹ÍÐmÍå¹¥¹½ÉÑ¤°Í•ÑMå¹¥¹½ÉÑ¥t€ôÕÍ•MÑ…Ñ”¡™…±Í”¤ì((€ÕÍ•™™•Ð  ¤€ôøì(€€€±•Ð…Ñ¥Ù”€ôÑÉÕ”ì(€€€™•Ñ  ˆ½…Á¤½½ÉÑ¤½ÍÑ…ÑÕÌˆ°ì…¡”è€‰¹¼µÍÑ½É”ˆô¤(€€€€€€¹Ñ¡•¸ ¡É•ÍÁ½¹Í”¤€ôøÉ•ÍÁ½¹Í”¹©Í½¸ ¤¤(€€€€€€¹Ñ¡•¸ ¡ÍÑ…ÑÕÌèìµ½‘”üè½ÉÑ¥5½‘”ì•¹Ù¥É½¹µ•¹ÐüèÍÑÉ¥¹œìÑ•¹…¹ÐüèÍÑÉ¥¹œô¤€ôøì(€€€€€€€¥˜€ ……Ñ¥Ù”¤É•ÑÕÉ¸ì(€€€€€€€Í•Ñ½ÉÑ¤¡ì(€€€€€€€€€µ½‘”èÍÑ…ÑÕÌ¹µ½‘”€üü€‰‘•µ¼ˆ°(€€€€€€€€€•¹Ù¥É½¹µ•¹ÐèÍÑ…ÑÕÌ¹•¹Ù¥É½¹µ•¹Ð€üü€‰•Ôˆ°(€€€€€€€€€Ñ•¹…¹ÐèÍÑ…ÑÕÌ¹Ñ•¹…¹Ð€üü€‰‰…Í”ˆ°(€€€€€€€ô¤ì(€€€€€ô¤(€€€€€€¹…Ñ   ¤€ôøì(€€€€€€€¥˜€¡…Ñ¥Ù”¤Í•Ñ½ÉÑ¤¡ìµ½‘”è€‰‘•µ¼ˆ°•¹Ù¥É½¹µ•¹Ðè€‰•Ôˆ°Ñ•¹…¹Ðè€‰‰…Í”ˆô¤ì(€€€€€ô¤ì((€€€É•ÑÕÉ¸€ ¤€ôøì(€€€€€…Ñ¥Ù”€ô™…±Í”ì(€€€ôì(€ô°mt¤ì((€½¹ÍÐ±…Ñ•ÍÑMÑ…ÑÕÌ€ô(€€€É•Ù¥•ÝMÑ…Ñ”€ôôô€‰…ÁÁÉ½Ù•ˆ(€€€€€€ü€‰I•ÍÁ½¹Í”…ÁÁÉ½Ù•ˆ(€€€€€€èÉ•Ù¥•ÝMÑ…Ñ”€ôôô€‰•Í…±…Ñ•ˆ(€€€€€€€€ü€‰MÕÁ•ÉÙ¥Í½ÈÉ•Ù¥•ÜÉ•ÅÕ•ÍÑ•ˆ(€€€€€€€€è€‰Ý…¥Ñ¥¹œ…É”µµ…¹…•È…ÁÁÉ½Ù…°ˆì((€™Õ¹Ñ¥½¸…‘‘Ù•¹Ð¡•Ù•¹Ðè!…¹‘½™™Ù•¹Ð¤ì(€€€Í•ÑÙ•¹ÑÌ ¡ÕÉÉ•¹Ð¤€ôøl¸¸¹ÕÉÉ•¹Ð°•Ù•¹Ñt¤ì(€ô((€™Õ¹Ñ¥½¸…‘‘Õ‘¥Ð¡•Ù•¹ÐèÍÑÉ¥¹œ°…Ñ½ÈèÍÑÉ¥¹œ€ô¡…¹‘½™™…Í”¹…É•5…¹…•È¹¹…µ”¤ì(€€€Í•Ñå¹…µ¥Õ‘¥Ð ¡ÕÉÉ•¹Ð¤€ôøl¸¸¹ÕÉÉ•¹Ð°ìÑ¥µ”èÕÉÉ•¹ÑA…­¥ÍÑ…¹Q¥µ” ¤°•Ù•¹Ð°…Ñ½Èõt¤ì(€ô((€™Õ¹Ñ¥½¸¡…¹‘±•‘‘9½Ñ” ¤ì(€€€½¹ÍÐÑÉ¥µµ•€ô¹½Ñ”¹ÑÉ¥´ ¤ì(€€€¥˜€ …ÑÉ¥µµ•¤É•ÑÕÉ¸ì(€€€…‘‘Ù•¹Ð¡ì(€€€€€¥è•ÙÐµ¹½Ñ”´‘í…Ñ”¹¹½Ü ¥õ€°(€€€€€Ñ¥µ”èÕÉÉ•¹ÑA…­¥ÍÑ…¹Q¥µ” ¤°(€€€€€…Ñ•½Éäè€‰¹½Ñ•Ìˆ°(€€€€€…Ñ½Èè¡…¹‘½™™…Í”¹…É•5…¹…•È¹¹…µ”°(€€€€€Ñ¥Ñ±”è€‰%¹Ñ•É¹…°¹½Ñ”…‘‘•ˆ°(€€€€€‘•Ñ…¥°èÑÉ¥µµ•°(€€€€€µ•Ñ„èl‰Y¥Í¥‰±”Ñ¼…Éè¬ÍÑ…™˜½¹±ä‰t°(€€€€€Ñ½¹”è€‰¡Õµ…¸ˆ°(€€€ô¤ì(€€€…‘‘Õ‘¥Ð ‰%¹Ñ•É¹…°…Í”¹½Ñ”…‘‘•ˆ¤ì(€€€Í•Ñ9½Ñ” ˆˆ¤ì(€€€Í•ÑÑ¥Ù•¥±Ñ•È ‰…±°ˆ¤ì(€ô((€™Õ¹Ñ¥½¸¡…¹‘±•ÁÁÉ½Ù” ¤ì(€€€¥˜€¡É•Ù¥•ÝMÑ…Ñ”€ôôô€‰…ÁÁÉ½Ù•ˆñðÉ•Ù¥•ÝMÑ…Ñ”€ôôô€‰Í•¹‘¥¹œˆ¤É•ÑÕÉ¸ì(€€€Í•ÑI•Ù¥•ÝMÑ…Ñ” ‰Í•¹‘¥¹œˆ¤ì(€€€Ý¥¹‘½Ü¹Í•ÑQ¥µ•½ÕÐ  ¤€ôøì(€€€€€Í•ÑI•Ù¥•ÝMÑ…Ñ” ‰…ÁÁÉ½Ù•ˆ¤ì(€€€€€…‘‘Ù•¹Ð¡ì(€€€€€€€¥è•ÙÐµ…ÁÁÉ½Ù•´‘í…Ñ”¹¹½Ü ¥õ€°(€€€€€€€Ñ¥µ”èÕÉÉ•¹ÑA…­¥ÍÑ…¹Q¥µ” ¤°(€€€€€€€…Ñ•½Éäè€‰¡Õµ…¸ˆ°(€€€€€€€…Ñ½Èè¡…¹‘½™™…Í”¹…É•5…¹…•È¹¹…µ”°(€€€€€€€Ñ¥Ñ±”è€‰I•Ù¥•Ý•É•ÍÁ½¹Í”…ÁÁÉ½Ù•ˆ°(€€€€€€€‘•Ñ…¥°è€‰Q¡”É•ÍÁ½¹Í”Á…ÍÍ•Ñ¡”¡Õµ…¸…ÁÁÉ½Ù…°…Ñ”…¹¥ÌÅÕ•Õ•™½È™…µ¥±ä‘•±¥Ù•Éä¸ˆ°(€€€€€€€µ•Ñ„èl‰ÁÁÉ½Ù•‰ä…É”µ…¹…•Èˆ°€‰]¡…ÑÍÁÀ‘•±¥Ù•ÉäÅÕ•Õ”‰t°(€€€€€€€Ñ½¹”è€‰¡Õµ…¸ˆ°(€€€€€ô¤ì(€€€€€…‘‘Õ‘¥Ð ‰I•Ù¥•Ý•É•ÍÁ½¹Í”…ÁÁÉ½Ù•ˆ¤ì(€€€ô°€ÐÔÀ¤ì(€ô((€™Õ¹Ñ¥½¸¡…¹‘±•Í…±…Ñ” ¤ì(€€€¥˜€¡É•Ù¥•ÝMÑ…Ñ”€ôôô€‰•Í…±…Ñ•ˆ¤É•ÑÕÉ¸ì(€€€Í•ÑI•Ù¥•ÝMÑ…Ñ” ‰•Í…±…Ñ•ˆ¤ì(€€€…‘‘Ù•¹Ð¡ì(€€€€€¥è•ÙÐµ•Í…±…Ñ•´‘í…Ñ”¹¹½Ü ¥õ€°(€€€€€Ñ¥µ”èÕÉÉ•¹ÑA…­¥ÍÑ…¹Q¥µ” ¤°(€€€€€…Ñ•½Éäè€‰¡Õµ…¸ˆ°(€€€€€…Ñ½Èè¡…¹‘½™™…Í”¹…É•5…¹…•È¹¹…µ”°(€€€€€Ñ¥Ñ±”è€‰MÕÁ•ÉÙ¥Í½ÈÉ•Ù¥•ÜÉ•ÅÕ•ÍÑ•ˆ°(€€€€€‘•Ñ…¥°è€‘í¡…¹‘½™™…Í”¹ÍÕÁ•ÉÙ¥Í½È¹¹…µ•ôÝ…Ì…‘‘•Ñ¼Ñ¡”¡…¹‘½™˜…¹¹½Ñ¥™¥•½˜Ñ¡”µ•‘¥…Ñ¥½¸µÉ¥Í¬…Í”¹€°(€€€€€µ•Ñ„èl‰Í…±…Ñ¥½¸±•Ù•°èMÕÁ•ÉÙ¥Í½È‰t°(€€€€€Ñ½¹”è€‰¡Õµ…¸ˆ°(€€€ô¤ì(€€€…‘‘Õ‘¥Ð ‰MÕÁ•ÉÙ¥Í½ÈÉ•Ù¥•ÜÉ•ÅÕ•ÍÑ•ˆ¤ì(€ô((€…Íå¹Œ™Õ¹Ñ¥½¸¡…¹‘±•Må¹½ÉÑ¤ ¤ì(€€€¥˜€¡Íå¹¥¹½ÉÑ¤¤É•ÑÕÉ¸ì(€€€Í•ÑMå¹¥¹½ÉÑ¤¡ÑÉÕ”¤ì(€€€ÑÉäì(€€€€€½¹ÍÐÉ•ÍÁ½¹Í”€ô…Ý…¥Ð™•Ñ  ˆ½…Á¤½½ÉÑ¤½¥¹Ñ•É…Ñ¥½¹Ìˆ°ì(€€€€€€€µ•Ñ¡½è€‰A=MPˆ°(€€€€€€€¡•…‘•ÉÌèì€‰½¹Ñ•¹ÐµQåÁ”ˆè€‰…ÁÁ±¥…Ñ¥½¸½©Í½¸ˆô°(€€€€€€€‰½‘äè)M=8¹ÍÑÉ¥¹¥™ä¡ì…Í•%è¡…¹‘½™™…Í”¹¥ô¤°(€€€€€ô¤ì(€€€€€½¹ÍÐÁ…å±½…€ô€¡…Ý…¥ÐÉ•ÍÁ½¹Í”¹©Í½¸ ¤¤…Ìì(€€€€€€€µ½‘”üè€‰‘•µ¼ˆð€‰É•…‘äˆð€‰±¥Ù”ˆì(€€€€€€€Íå¹•üè‰½½±•…¸ì(€€€€€€€¥¹Ñ•É…Ñ¥½¹%üèÍÑÉ¥¹œì(€€€€€€€µ•ÍÍ…”üèÍÑÉ¥¹œì(€€€€€€€•ÉÉ½ÈüèÍÑÉ¥¹œì(€€€€€ôì(€€€€€¥˜€ …É•ÍÁ½¹Í”¹½¬¤Ñ¡É½Ü¹•ÜÉÉ½È¡Á…å±½…¹•ÉÉ½È€üü€‰½ÉÑ¤É•ÅÕ•ÍÐ™…¥±•¸ˆ¤ì((€€€€€Í•Ñ½ÉÑ¤ ¡ÕÉÉ•¹Ð¤€ôø€¡ì€¸¸¹ÕÉÉ•¹Ð°µ½‘”èÁ…å±½…¹µ½‘”€üüÕÉÉ•¹Ð¹µ½‘”ô¤¤ì(€€€€€…‘‘Ù•¹Ð¡ì(€€€€€€€¥è•ÙÐµ½ÉÑ¤µÉ•™É•Í ´‘í…Ñ”¹¹½Ü ¥õ€°(€€€€€€€Ñ¥µ”èÕÉÉ•¹ÑA…­¥ÍÑ…¹Q¥µ” ¤°(€€€€€€€…Ñ•½Éäè€‰½ÉÑ¤ˆ°(€€€€€€€…Ñ½Èè€‰½ÉÑ¤ˆ°(€€€€€€€Ñ¥Ñ±”èÁ…å±½…¹Íå¹•€ü€‰1¥Ù”½ÉÑ¤¥¹Ñ•É…Ñ¥½¸…ÑÑ…¡•ˆ€è€‰½ÉÑ¤‘•µ¼½¹Ñ•áÐÉ•™É•Í¡•ˆ°(€€€€€€€‘•Ñ…¥°èÁ…å±½…¹µ•ÍÍ…”€üü€‰½ÉÑ¤½¹Ñ•áÐÉ•™É•Í¡•¸ˆ°(€€€€€€€µ•Ñ„èÁ…å±½…¹¥¹Ñ•É…Ñ¥½¹%€üm%¹Ñ•É…Ñ¥½¸è€‘íÁ…å±½…¹¥¹Ñ•É…Ñ¥½¹%‘õt€èÕ¹‘•™¥¹•°(€€€€€€€Ñ½¹”è€‰½ÉÑ¤ˆ°(€€€€€ô¤ì(€€€€€…‘‘Õ‘¥Ð¡Á…å±½…¹Íå¹•€ü€‰½ÉÑ¤¥¹Ñ•É…Ñ¥½¸…ÑÑ…¡•ˆ€è€‰½ÉÑ¤‘•µ¼½¹Ñ•áÐÉ•™É•Í¡•ˆ°€‰MåÍÑ•´ˆ¤ì(€€€ô…Ñ €¡•ÉÉ½È¤ì(€€€€€…‘‘Ù•¹Ð¡ì(€€€€€€€¥è•ÙÐµ½ÉÑ¤µ•ÉÉ½È´‘í…Ñ”¹¹½Ü ¥õ€°(€€€€€€€Ñ¥µ”èÕÉÉ•¹ÑA…­¥ÍÑ…¹Q¥µ” ¤°(€€€€€€€…Ñ•½Éäè€‰ÍåÍÑ•´ˆ°(€€€€€€€…Ñ½Èè€‰MåÍÑ•´ˆ°(€€€€€€€Ñ¥Ñ±”è€‰½ÉÑ¤Íå¹Œ¹••‘Ì…ÑÑ•¹Ñ¥½¸ˆ°(€€€€€€€‘•Ñ…¥°è•ÉÉ½È¥¹ÍÑ…¹•½˜ÉÉ½È€ü•ÉÉ½È¹µ•ÍÍ…”€è€‰½ÉÑ¤É•ÅÕ•ÍÐ™…¥±•¸ˆ°(€€€€€€€µ•Ñ„èl‰9¼™…µ¥±äÉ•ÍÁ½¹Í”Ý…Ì…™™•Ñ•‰t°(€€€€€€€Ñ½¹”è€‰É¥Í¬ˆ°(€€€€€ô¤ì(€€€ô™¥¹…±±äì(€€€€€Í•ÑMå¹¥¹½ÉÑ¤¡™…±Í”¤ì(€€€ô(€ô((€™Õ¹Ñ¥½¸™½ÕÍ9½Ñ” ¤ì(€€€‘½Õµ•¹Ð¹•Ñ±•µ•¹Ñ	å% ‰¥¹Ñ•É¹…°µ¹½Ñ”ˆ¤ü¹™½ÕÌ ¤ì(€ô((€É•ÑÕÉ¸€ (€€€€ñ‘¥Ø(€€€€€‘…Ñ„µÁ±…Ñ™½É´µÍ¡•±°(€€€€€±…ÍÍ9…µ”ô‰µ¥¸µ µÍÉ••¸‰œµlŒÀØÄÌÈÅtÑ•áÐµÝ¡¥Ñ”m™½¹ÐµÍå¹Ñ¡•Í¥Ìé¹½¹•tÍ•±•Ñ¥½¸é‰œµlŒÌáÙÁt¼ÌÀˆ(€€€€ø(€€€€€€ñM¥‘•‰…È(€€€€€€€…Ñ¥Ù•]½É­ÍÁ…”õí…Ñ¥Ù•]½É­ÍÁ…•ô(€€€€€€€Í•ÑÑ¥Ù•]½É­ÍÁ…”õíÍ•ÑÑ¥Ù•]½É­ÍÁ…•ô(€€€€€€€½¹M¥¹=ÕÐõí½¹M¥¹=ÕÑô(€€€€€€€µ½‰¥±•=Á•¸õíµ½‰¥±•=Á•¹ô(€€€€€€€½¹±½Í•5½‰¥±”õì ¤€ôøÍ•Ñ5½‰¥±•=Á•¸¡™…±Í”¥ô(€€€€€€€½ÉÑ¤õí½ÉÑ¥ô(€€€€€€¼ø((€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µ¥¸µ µÍÉ••¸±œéÁ°µlÈÄÉÁátˆø(€€€€€€€€ñQ½Á‰…È½¹5•¹Ôõì ¤€ôøÍ•Ñ5½‰¥±•=Á•¸¡ÑÉÕ”¥ô½¹M¥¹=ÕÐõí½¹M¥¹=ÕÑô€¼ø(€€€€€€€í…Ñ¥Ù•]½É­ÍÁ…”€ôôô€‰!Õµ…¸!…¹‘½™˜ˆ€ü€ (€€€€€€€€€€ðø(€€€€€€€€€€€€ñ…Í•!•…‘•ÈÉ•Ù¥•ÝMÑ…Ñ”õíÉ•Ù¥•ÝMÑ…Ñ•ô€¼ø(€€€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰É¥…À´ÌÁà´ÐÁˆ´ÔÁÐ´ÌÍ´éÁà´Ôá°éÉ¥µ½±Ìµmµ¥¹µ…à À°Å™È¥|ÐÄÁÁátˆø(€€€€€€€€€€€€€€ñÙ•¹ÑQ¥µ•±¥¹”(€€€€€€€€€€€€€€€•Ù•¹ÑÌõí•Ù•¹ÑÍô(€€€€€€€€€€€€€€€…Ñ¥Ù•¥±Ñ•Èõí…Ñ¥Ù•¥±Ñ•Éô(€€€€€€€€€€€€€€€½¹¥±Ñ•ÈõíÍ•ÑÑ¥Ù•¥±Ñ•Éô(€€€€€€€€€€€€€€€•áÁ…¹‘•õí•Ù•¹ÑÍáÁ…¹‘•‘ô(€€€€€€€€€€€€€€€½¹Q½±•áÁ…¹‘•õì ¤€ôøÍ•ÑÙ•¹ÑÍáÁ…¹‘• ¡Ù…±Õ”¤€ôø€…Ù…±Õ”¥ô(€€€€€€€€€€€€€€€¹½Ñ”õí¹½Ñ•ô(€€€€€€€€€€€€€€€Í•Ñ9½Ñ”õíÍ•Ñ9½Ñ•ô(€€€€€€€€€€€€€€€½¹‘‘9½Ñ”õí¡…¹‘±•‘‘9½Ñ•ô(€€€€€€€€€€€€€€€½ÉÑ¤õí½ÉÑ¥ô(€€€€€€€€€€€€€€€Íå¹¥¹œõíÍå¹¥¹½ÉÑ¥ô(€€€€€€€€€€€€€€€½¹Må¹½ÉÑ¤õí¡…¹‘±•Må¹½ÉÑ¥ô(€€€€€€€€€€€€€€¼ø(€€€€€€€€€€€€€€ñ•¥Í¥½¹I…¥°(€€€€€€€€€€€€€€€É•ÍÁ½¹Í”õíÉ•ÍÁ½¹Í•ô(€€€€€€€€€€€€€€€Í•ÑI•ÍÁ½¹Í”õíÍ•ÑI•ÍÁ½¹Í•ô(€€€€€€€€€€€€€€€É•Ù¥•ÝMÑ…Ñ”õíÉ•Ù¥•ÝMÑ…Ñ•ô(€€€€€€€€€€€€€€€½¹ÁÁÉ½Ù”õí¡…¹‘±•ÁÁÉ½Ù•ô(€€€€€€€€€€€€€€€½¹Í…±…Ñ”õí¡…¹‘±•Í…±…Ñ•ô(€€€€€€€€€€€€€€€½¹½ÕÍ9½Ñ”õí™½ÕÍ9½Ñ•ô(€€€€€€€€€€€€€€€±•‘•ÉáÁ…¹‘•õí±•‘•ÉáÁ…¹‘•‘ô(€€€€€€€€€€€€€€€½¹Q½±•1•‘•Èõì ¤€ôøÍ•Ñ1•‘•ÉáÁ…¹‘• ¡Ù…±Õ”¤€ôø€…Ù…±Õ”¥ô(€€€€€€€€€€€€€€€‘å¹…µ¥Õ‘¥Ðõí‘å¹…µ¥Õ‘¥Ñô(€€€€€€€€€€€€€€¼ø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€ñ™½½Ñ•È±…ÍÍ9…µ”ô‰™±•àµ¥¸µ ´ÄÀ™±•àµÝÉ…À¥Ñ•µÌµ•¹Ñ•È©ÕÍÑ¥™äµ‰•ÑÝ••¸…À´È‰½É‘•ÈµÐ‰½É‘•ÈµÝ¡¥Ñ”¼ÄÀÁà´ÔÁä´ÈÑ•áÐµlÄÁÁátÑ•áÐµlŒØØÝäÑtˆø(€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰¥¹±¥¹”µ™±•à¥Ñ•µÌµ•¹Ñ•È…À´Èˆø(€€€€€€€€€€€€€€€€ñ1½­-•å¡½±”±…ÍÍ9…µ”ô‰ ´Ì¸ÔÜ´Ì¸Ôˆ€¼ø(€€€€€€€€€€€€€€€½¹Í•¹Ðµ‰…Í•…•ÍÌƒŠˆí±…Ñ•ÍÑMÑ…ÑÕÍô(€€€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€€€€€ñÍÁ…¸ùA…­¥ÍÑ…¸MÑ…¹‘…ÉQ¥µ”€¡A-P¤€™¹‰ÍÀíð™¹‰ÍÀì€Èä)Õ°€ÈÀÈØð½ÍÁ…¸ø(€€€€€€€€€€€€€€ñÍÁ…¸û
¤€ÈÀÈØ…Éè¬¸…É”½½É‘¥¹…Ñ¥½¸°¹½Ð‘¥…¹½Í¥Ì¸ð½ÍÁ…¸ø(€€€€€€€€€€€€ð½™½½Ñ•Èø(€€€€€€€€€€ð¼ø(€€€€€€€€¤€è€ (€€€€€€€€€€ñ]½É­ÍÁ…•A±…•¡½±‘•ÈÑ¥Ñ±”õí…Ñ¥Ù•]½É­ÍÁ…•ô½¹I•ÑÕÉ¸õì ¤€ôøÍ•ÑÑ¥Ù•]½É­ÍÁ…” ‰!Õµ…¸!…¹‘½™˜ˆ¥ô€¼ø(€€€€€€€€¥ô(€€€€€€ð½‘¥Øø(€€€€ð½‘¥Øø(€€¤ì)ô(