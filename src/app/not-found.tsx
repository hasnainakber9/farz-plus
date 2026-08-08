import Link from "next/link";
import { GlassCard, Shell } from "@/components/ui";

export default function NotFound() {
  return (
    <Shell className="grid min-h-[60vh] place-items-center py-20">
      <GlassCard className="max-w-xl p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#087B69]">Empty state</p>
        <h1 className="mt-4 text-3xl font-semibold text-[#143A35]">This care page is not active yet.</h1>
        <p className="mt-4 text-sm leading-7 text-[#617570]">
          Let&apos;s route you back to the main care journey.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-[#006E5B] px-6 py-3 text-sm font-bold text-white"
        >
          Return home
        </Link>
      </GlassCard>
    </Shell>
  );
}
