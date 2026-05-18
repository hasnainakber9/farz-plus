import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight, Check, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#A0E7B4]">{eyebrow}</p>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {children ? <div className="mt-5 text-base leading-8 text-[#B8C0C8] sm:text-lg">{children}</div> : null}
    </div>
  );
}

export function GlassCard({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & { children: ReactNode }) {
  return (
    <div className={cn("glass rounded-[24px] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#A0E7B4]/35", className)} {...props}>
      {children}
    </div>
  );
}

export function PrimaryButton({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#4CD364] px-6 py-3 text-sm font-bold text-[#050410] shadow-[0_0_35px_rgba(76,211,100,0.38)] transition hover:-translate-y-0.5 hover:bg-[#A0E7B4] focus:outline-none focus:ring-2 focus:ring-[#A0E7B4] focus:ring-offset-2 focus:ring-offset-[#050410]",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

export function SecondaryButton({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#A0E7B4]/50 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-[#4CD364] hover:bg-[#4CD364]/10 focus:outline-none focus:ring-2 focus:ring-[#A0E7B4] focus:ring-offset-2 focus:ring-offset-[#050410]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function StatusPill({
  children,
  tone = "stable",
}: {
  children: ReactNode;
  tone?: "stable" | "watch" | "risk" | "info" | "neutral";
}) {
  const tones = {
    stable: "border-[#4CD364]/30 bg-[#4CD364]/12 text-[#A0E7B4]",
    watch: "border-[#FFC857]/35 bg-[#FFC857]/12 text-[#FFD98A]",
    risk: "border-[#FF4D5A]/35 bg-[#FF4D5A]/12 text-[#FF9BA3]",
    info: "border-[#43B0C1]/35 bg-[#43B0C1]/12 text-[#A7F3FF]",
    neutral: "border-white/10 bg-white/[0.08] text-[#B8C0C8]",
  };
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold", tones[tone])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}

export function CheckRow({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-sm leading-6 text-[#D7DEE6]">
      <Check className="mt-0.5 h-4 w-4 flex-none text-[#4CD364]" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

export function DisclaimerBox() {
  return (
    <div className="rounded-[24px] border border-[#FF4D5A]/25 bg-[#FF4D5A]/8 p-5 text-sm leading-7 text-[#FFD4D8]">
      <div className="mb-2 flex items-center gap-2 font-semibold text-white">
        <ShieldAlert className="h-4 w-4 text-[#FF4D5A]" aria-hidden="true" />
        Medical disclaimer
      </div>
      Farz+ is a care coordination and family-support platform. It does not replace hospitals, licensed physicians,
      emergency services, ambulance providers, or professional medical advice.
    </div>
  );
}

export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <GlassCard className="p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[#A0E7B4]">{label}</p>
      <p className="mt-3 font-mono text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#B8C0C8]">{detail}</p>
    </GlassCard>
  );
}
