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
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#087B69]">{eyebrow}</p>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold leading-[1.08] tracking-[0] text-[#143A35] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {children ? <div className="mt-5 text-base leading-7 text-[#55706B] sm:text-lg">{children}</div> : null}
    </div>
  );
}

export function GlassCard({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[#D9E5E1] bg-white p-5 shadow-[0_12px_40px_rgba(20,58,53,0.06)] transition duration-300 hover:border-[#A9C9C2]",
        className,
      )}
      {...props}
    >
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
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#006E5B] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_26px_rgba(0,110,91,0.18)] transition hover:-translate-y-0.5 hover:bg-[#005B4C] focus:outline-none focus:ring-2 focus:ring-[#0AB392] focus:ring-offset-2 focus:ring-offset-white",
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
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#8DB7AF] bg-white px-6 py-3 text-sm font-semibold text-[#0D5E51] transition hover:-translate-y-0.5 hover:border-[#006E5B] hover:bg-[#F0F8F5] focus:outline-none focus:ring-2 focus:ring-[#0AB392] focus:ring-offset-2 focus:ring-offset-white",
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
    stable: "border-[#9FD8CC] bg-[#E6F7F2] text-[#08715F]",
    watch: "border-[#E7CA88] bg-[#FFF7DF] text-[#805E16]",
    risk: "border-[#F3B1A8] bg-[#FFF0ED] text-[#A83B2D]",
    info: "border-[#A9CED4] bg-[#EEF8FA] text-[#216A75]",
    neutral: "border-[#D9E5E1] bg-[#F4F7F6] text-[#617570]",
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
    <li className="flex gap-3 text-sm leading-6 text-[#47645E]">
      <Check className="mt-0.5 h-4 w-4 flex-none text-[#08A98A]" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

export function DisclaimerBox() {
  return (
    <div className="rounded-lg border border-[#F1B9B1] bg-[#FFF3F1] p-5 text-sm leading-7 text-[#79473F]">
      <div className="mb-2 flex items-center gap-2 font-semibold text-[#7F2D23]">
        <ShieldAlert className="h-4 w-4 text-[#D65748]" aria-hidden="true" />
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
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#087B69]">{label}</p>
      <p className="mt-3 font-mono text-3xl font-semibold text-[#143A35]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#617570]">{detail}</p>
    </GlassCard>
  );
}
