import { careScoreLabel, cn } from "@/lib/utils";

export function CareScoreRing({
  score,
  size = "lg",
  label,
}: {
  score: number;
  size?: "sm" | "lg";
  label?: string;
}) {
  const status = label ?? careScoreLabel(score);
  const sizeClass = size === "lg" ? "h-48 w-48" : "h-28 w-28";
  const textClass = size === "lg" ? "text-5xl" : "text-3xl";
  const angle = Math.max(0, Math.min(100, score)) * 3.6;

  return (
    <div
      className={cn("relative grid place-items-center rounded-full signal-glow", sizeClass)}
      style={{
        background: `radial-gradient(circle at center, #070817 58%, transparent 59%), conic-gradient(from -90deg, #38D6B0 0deg, #43B0C1 ${angle}deg, rgba(255,255,255,0.08) ${angle}deg)`,
      }}
      aria-label={`Care Score ${score}, ${status}`}
    >
      <div className="text-center">
        <div className={cn("font-mono font-semibold text-white", textClass)}>{score}</div>
        <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#E6FAF3]">{status}</div>
      </div>
    </div>
  );
}
