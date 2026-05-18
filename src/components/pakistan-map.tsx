import { pakistanBoundaryPath, pakistanCityPins } from "@/lib/pakistan-map";

export function PakistanCoverageMap({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#07111F]/90 p-5 shadow-[0_24px_90px_rgba(56,214,176,0.12)]">
      <div className="absolute inset-0 grid-texture opacity-45" />
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(56,214,176,0.12),transparent_42%),radial-gradient(circle_at_70%_24%,rgba(230,250,243,0.14),transparent_28%)]" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#38D6B0]">Pakistan coverage</p>
          <h3 className="mt-2 max-w-56 text-xl font-extrabold text-white">
            Care signals across the country
          </h3>
        </div>
        <span className="rounded-full border border-[#38D6B0]/30 bg-[#38D6B0]/10 px-3 py-1 text-xs font-extrabold text-[#E6FAF3]">
          Live
        </span>
      </div>
      <div className={compact ? "relative z-10 mx-auto mt-2 aspect-[0.84] max-h-[24rem]" : "relative z-10 mx-auto mt-4 aspect-[0.84] max-h-[34rem]"}>
        <svg viewBox="0 0 440 520" className="h-full w-full drop-shadow-[0_26px_28px_rgba(0,0,0,0.28)]" role="img" aria-label="Map of Pakistan with Farz+ city coverage pins">
          <defs>
            <linearGradient id="pakistan-map-fill" x1="72" y1="60" x2="360" y2="470" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E6FAF3" stopOpacity="0.86" />
              <stop offset="0.42" stopColor="#38D6B0" stopOpacity="0.78" />
              <stop offset="1" stopColor="#06AA91" stopOpacity="0.92" />
            </linearGradient>
            <filter id="pakistan-map-depth" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="18" stdDeviation="12" floodColor="#020811" floodOpacity="0.55" />
            </filter>
          </defs>
          <path d={pakistanBoundaryPath} fill="#03101D" opacity="0.78" transform="translate(10 16)" />
          <path d={pakistanBoundaryPath} fill="url(#pakistan-map-fill)" stroke="#E6FAF3" strokeOpacity="0.72" strokeWidth="1.3" filter="url(#pakistan-map-depth)" />
          <path d={pakistanBoundaryPath} fill="none" stroke="#07111F" strokeOpacity="0.45" strokeWidth="5" transform="translate(4 7)" />
          {pakistanCityPins.map((pin, index) => (
            <g key={pin.city} transform={`translate(${pin.x} ${pin.y})`}>
              <circle r={compact && index > 5 ? 6 : 8} fill="#07111F" opacity="0.8" />
              <circle r={compact && index > 5 ? 4 : 5} fill="#38D6B0" />
              <circle r={compact && index > 5 ? 9 : 12} fill="none" stroke="#38D6B0" strokeOpacity="0.36">
                <animate attributeName="r" values="8;18;8" dur="3.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur="3.6s" repeatCount="indefinite" />
              </circle>
              {!compact || index < 7 ? (
                <text x="12" y="-8" fill="#FFFFFF" fontSize="12" fontWeight="800" paintOrder="stroke" stroke="#07111F" strokeWidth="4">
                  {pin.city}
                </text>
              ) : null}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
