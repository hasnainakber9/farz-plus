"use client";

import { RotateCcw } from "lucide-react";
import { GlassCard, Shell } from "@/components/ui";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <Shell className="grid min-h-[60vh] place-items-center py-20">
      <GlassCard className="max-w-xl p-8 text-center">
        <h1 className="text-3xl font-semibold text-white">Something needs a quick reset.</h1>
        <p className="mt-4 text-sm leading-7 text-[#B8C0C8]">
          The Farz+ demo interface hit an unexpected state. Try again, or use the WhatsApp path for the pilot flow.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#4CD364] px-6 py-3 text-sm font-bold text-[#050410]"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset view
        </button>
      </GlassCard>
    </Shell>
  );
}
