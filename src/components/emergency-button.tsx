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
          "inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#D94A43] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#BD3E38]",
          className,
        )}
      >
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        Emergency SOS
      </button>
      {open ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-[#143A35]/45 px-5 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-md border border-[#F1B6B1] bg-white p-6 shadow-[0_32px_100px_rgba(20,58,53,0.2)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-[#B83E37]">Confirm emergency</p>
                <h2 className="mt-3 text-2xl font-semibold text-[#143A35]">Start the Farz+ emergency protocol?</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-md border border-[#D5E4E0] text-[#536B66]"
                aria-label="Close emergency modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#536B66]">
              This confirms urgency, starts the family call tree, and tells the care manager to coordinate approved local support.
              For immediate medical danger, call local emergency services directly.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:1122"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#D94A43] px-5 py-3 text-sm font-bold text-white"
              >
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                Call local emergency
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-[#D5E4E0] px-5 py-3 text-sm font-semibold text-[#38534D]"
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
