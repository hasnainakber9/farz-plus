"use client";

import {
  Activity,
  ArrowLeftRight,
  Bell,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import type { UserRole } from "@/lib/platform-types";
import { cn } from "@/lib/utils";

const roleMeta = {
  FAMILY: {
    label: "Family portal",
    icon: Users,
    href: "/dashboard/family",
    accent: "text-[#087B69]",
  },
  CARE_MANAGER: {
    label: "Care operations",
    icon: HeartHandshake,
    href: "/dashboard/care-manager",
    accent: "text-[#087B69]",
  },
  DOCTOR: {
    label: "Clinical portal",
    icon: Stethoscope,
    href: "/dashboard/doctor",
    accent: "text-[#2F6F9F]",
  },
} as const;

export function DashboardShell({
  role,
  name,
  title,
  subtitle,
  connected,
  children,
}: {
  role: Extract<UserRole, "FAMILY" | "CARE_MANAGER" | "DOCTOR">;
  name: string;
  title: string;
  subtitle: string;
  connected: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = roleMeta[role];
  const RoleIcon = meta.icon;

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const navigation = [
    { label: meta.label, href: meta.href, icon: LayoutDashboard, active: true },
    { label: "Shared handoffs", href: role === "CARE_MANAGER" ? "#handoff" : meta.href, icon: ArrowLeftRight },
    { label: "Care activity", href: role === "FAMILY" ? "#feed" : meta.href, icon: Activity },
    { label: "Trust controls", href: "/medical-disclaimer", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F3F7F5] text-[#143A35]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[238px] border-r border-[#D8E5E1] bg-white lg:flex lg:flex-col">
        <div className="flex h-17 items-center border-b border-[#E1EBE8] px-5">
          <BrandMark />
        </div>
        <div className="px-4 py-5">
          <div className="flex items-center gap-3 rounded-md border border-[#DCE8E4] bg-[#F7FAF9] p-3">
            <span className={cn("grid h-9 w-9 place-items-center rounded-md bg-white shadow-sm", meta.accent)}>
              <RoleIcon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#143A35]">{name}</p>
              <p className="mt-0.5 text-xs text-[#70847E]">{meta.label}</p>
            </div>
          </div>
        </div>
        <nav className="grid gap-1 px-3" aria-label="Dashboard">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold transition",
                  item.active
                    ? "bg-[#E8F5F1] text-[#087B69]"
                    : "text-[#60756F] hover:bg-[#F3F7F5] hover:text-[#143A35]",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-[#E1EBE8] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#60756F]">
            <span className={cn("h-2 w-2 rounded-full", connected ? "bg-[#08A98A]" : "bg-[#D2A240]")} />
            {connected ? "Care operations live" : "Reconnecting"}
          </div>
          <Link
            href="/dashboard/notifications"
            onClick={signOut}
            className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-[#60756F] transition hover:bg-[#F3F7F5] hover:text-[#143A35]"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#143A35]/35 lg:hidden"
          aria-label="Close dashboard navigation"
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] border-r border-[#D8E5E1] bg-white p-4 transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <BrandMark />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-md border border-[#D8E5E1]"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-8 grid gap-2">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md border border-[#DCE8E4] px-3 py-3 text-sm font-semibold text-[#385851]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[238px]">
        <header className="sticky top-0 z-30 flex min-h-17 items-center justify-between gap-4 border-b border-[#D8E5E1] bg-white/95 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 flex-none place-items-center rounded-md border border-[#D8E5E1] lg:hidden"
              aria-label="Open dashboard navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-[#143A35]">{title}</h1>
              <p className="hidden truncate text-xs text-[#70847E] sm:block">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-md border border-[#D8E5E1] text-[#536B66] hover:bg-[#F3F7F5]"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#D65748]" />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
