import { AdminDashboardPreview } from "@/components/dashboard-panels";

export default function AdminDashboardPage() {
  return (
    <section className="relative overflow-hidden py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#80C3DC]">Farz+ Admin</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Operations Console</h1>
          </div>
          <span className="rounded-full border border-[#38D6B0]/30 bg-[#38D6B0]/10 px-4 py-2 text-sm font-bold text-[#E6FAF3]">Governance</span>
        </div>
        <AdminDashboardPreview />
      </div>
    </section>
  );
}
