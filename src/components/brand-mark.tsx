import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function BrandMark() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="Farz+ home">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] signal-glow">
        <ShieldCheck className="h-5 w-5 text-[#A0E7B4]" aria-hidden="true" />
        <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#4CD364] text-sm font-black leading-none text-[#050410]">
          +
        </span>
      </span>
      <span className="text-xl font-semibold tracking-tight text-white">
        Farz<span className="text-[#4CD364]">+</span>
      </span>
    </Link>
  );
}
