import Link from "next/link";
import { GlassCard, Shell } from "@/components/ui";

export default function NotFound() {
  return (
    <Shell className="grid min-h-[60vh] place-items-center py-20">
      <GlassCard className="max-w-xl p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#A0E7B4]">Empty state</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">This care page is not active yet.</h1>
        <p className="mt-4 text-sm leading-7 text-[#B8C0C8]">
          The Farz+ MVP keeps missing pages calm and useful, then routes families back to the main care journey.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#4CD364] px-6 py-3 text-sm font-bold text-[#050410]"
        >
          Return home
        </Link>
      </GlassCard>
    </Shell>
  );
}
