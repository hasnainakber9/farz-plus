"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";

const primaryNav = [
  { label: "Platform", href: "/#handoff-simulator" },
  { label: "For Overseas Families", href: "/families" },
  { label: "For Care Managers", href: "/care-teams" },
  { label: "For Doctors", href: "/doctors" },
  { label: "Care Plans", href: "/care-plans" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [alertState, setAlertState] = useState<"idle" | "sending" | "sent">("idle");
  const reduceMotion = useReducedMotion();

  async function simulateEmergency() {
    if (alertState === "sending") return;
    setAlertState("sending");
    try {
      await fetch("/api/platform/emergency", { method: "POST" });
      setAlertState("sent");
      window.setTimeout(() => setAlertState("idle"), 4500);
    } catch {
      setAlertState("idle");
    }
  }

  return (
    <>
      <header className="site-header site-border sticky top-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex h-17 w-full max-w-[1540px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span className="hidden items-center gap-1.5 border-l site-border pl-3 text-[10px] font-bold uppercase text-[var(--site-muted)] sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-[#08A98A] shadow-[0_0_0_4px_rgba(8,169,138,0.1)]" />
              Care operations online
            </span>
          </div>
          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary navigation">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-[12px] font-semibold text-[var(--site-muted)] transition hover:bg-[var(--site-surface-soft)] hover:text-[var(--site-text)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 xl:flex">
            <ThemeToggle />
            <button
              type="button"
              onClick={simulateEmergency}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-[#E6B7B0] px-3 text-xs font-bold text-[#B4493C] transition hover:bg-[#FFF0EE]"
            >
              <AlertTriangle className="h-4 w-4" />
              Simulate alert
            </button>
            <Link
              href="/login"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[#006E5B] px-4 text-xs font-bold text-white transition hover:bg-[#005B4C]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Access dashboard
            </Link>
          </div>
          <div className="flex items-center gap-2 xl:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-md border site-border text-[var(--site-text)]"
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="site-surface site-border border-t px-4 py-4 shadow-[0_18px_40px_rgba(20,58,53,0.12)] xl:hidden"
            >
              <nav className="mx-auto grid max-w-[1540px] gap-1" aria-label="Mobile navigation">
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="site-border border-b px-1 py-3 text-sm font-semibold text-[var(--site-text)] last:border-b-0"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      simulateEmergency();
                      setOpen(false);
                    }}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#E6B7B0] text-sm font-bold text-[#B4493C]"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Simulate emergency alert
                  </button>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#006E5B] text-sm font-bold text-white"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Access dashboard
                  </Link>
                </div>
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {alertState === "sent" ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="status"
            className="fixed right-4 top-20 z-[60] max-w-sm rounded-md border border-[#AFCFC7] bg-white p-4 shadow-[0_18px_50px_rgba(20,58,53,0.16)]"
          >
            <p className="flex items-center gap-2 text-sm font-bold text-[#08705F]">
              <CheckCircle2 className="h-4 w-4" />
              Demo emergency workflow activated
            </p>
            <p className="mt-1 text-xs leading-5 text-[#60756F]">
              The family dashboard and care feed now show the alert. No emergency service was contacted.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
