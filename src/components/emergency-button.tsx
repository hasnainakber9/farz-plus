"use client";

import { AlertTriangle, PhoneCall, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function EmergencyButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FF4D5A] px-6 py-3 text-sm font-bold text-white shadow-[0_0_28px_rgba(255,77,90,0.35)] transition hover:-translate-y-0.5",
          className,
        )}
      >
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        Emergency SOS
      </button>
      {open ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-[#050410]/80 px-5 backdrop-blur-xl" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-[28px] border border-[#FF4D5A]/30 bg-[#12070B] p-6 shadow-[0_40px_140px_rgba(255,77,90,0.25)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFB6BC]">Confirm emergency</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Start the Farz+ emergency protocol?</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white"
                aria-label="Close emergency modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#FFD4D8]">
              This confirms urgency, starts the family call tree, and tells the care manager to coordinate approved local support.
              For immediate medical danger, call local emergency services directly.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:1122"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#FF4D5A] px-5 py-3 text-sm font-bold text-white"
              >
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                Call local emergency
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
