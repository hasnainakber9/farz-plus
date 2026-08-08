import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function FarzGlyph({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <Image
      src="/icons/farz-icon.svg"
      alt=""
      width={40}
      height={40}
      className={cn("object-contain", className)}
      aria-hidden="true"
    />
  );
}

export function BrandMark({
  inverse = false,
  className,
}: {
  inverse?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Farz+ home"
    >
      <FarzGlyph />
      <span
        className={cn(
          "text-[22px] font-extrabold leading-none tracking-[0]",
          inverse ? "text-white" : "text-[var(--site-text,#123A35)]",
        )}
      >
        Farz<span className="text-[#08A98A]">+</span>
      </span>
    </Link>
  );
}
