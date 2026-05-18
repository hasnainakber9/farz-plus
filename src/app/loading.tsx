export default function Loading() {
  return (
    <div className="mx-auto grid min-h-[60vh] w-full max-w-7xl gap-4 px-5 py-20 sm:px-6 lg:px-8">
      <div className="h-8 w-48 animate-pulse rounded-full bg-white/[0.08]" />
      <div className="h-20 max-w-2xl animate-pulse rounded-[24px] bg-white/[0.08]" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-40 animate-pulse rounded-[24px] bg-white/[0.08]" />
        <div className="h-40 animate-pulse rounded-[24px] bg-white/[0.08]" />
        <div className="h-40 animate-pulse rounded-[24px] bg-white/[0.08]" />
      </div>
    </div>
  );
}
