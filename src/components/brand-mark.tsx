import Link from "next/link";

export function FarzGlyph({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="farz-glyph-gradient" x1="15" y1="10" x2="78" y2="86" gradientUnits="userSpaceOnUse">
          <stop stopColor="#78E6A1" />
          <stop offset="0.55" stopColor="#38D6B0" />
          <stop offset="1" stopColor="#05B696" />
        </linearGradient>
      </defs>
      <path
        d="M64 12C42 9 22 23 17 45c-5 24 10 45 33 49 18 3 34-5 42-20-13 6-29 5-41-3l22-2c10-1 17-9 17-19V36c-13 1-25 2-36 12-7 6-10 14-12 23-9-7-13-19-10-31 4-16 18-26 34-25 5 .3 8-2 8-2z"
        fill="url(#farz-glyph-gradient)"
      />
    </svg>
  );
}

export function BrandMark() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="Farz+ home">
      <FarzGlyph />
      <span className="text-2xl font-extrabold tracking-tight text-white">
        Farz<span className="text-[#38D6B0]">+</span>
      </span>
    </Link>
  );
}
