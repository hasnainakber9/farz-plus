import type { ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07111F]">
      <aside className="fixed left-0 top-0 hidden h-screen w-80 border-r border-white/10 bg-[#091724] p-6 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#38D6B0]/40 bg-[#38D6B0]/10 text-[#38D6B0] font-bold">F+</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8C0C8]">Farz+</p>
            <h2 className="mt-1 text-xl font-bold text-white">Care Operations</h2>
          </div>
        </div>

        <nav className="mt-12 grid gap-2">
          <Link className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white" href="/dashboard/family">Home</Link>
          <Link className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-[#B8C0C8]" href="/dashboard/family">Parent</Link>
          <Link className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-[#B8C0C8]" href="/dashboard/family">Timeline</Link>
          <Link className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-[#B8C0C8]" href="/dashboard/family">Requests</Link>
          <Link className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-[#B8C0C8]" href="/dashboard/care-manager">Cases</Link>
          <Link className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-[#B8C0C8]" href="/dashboard/clinician">Escalations</Link>
          <Link className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-[#B8C0C8]" href="/dashboard/admin">Admin</Link>
        </nav>

        <div className="mt-10 rounded-3xl border border-[#38D6B0]/30 bg-[#38D6B0]/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6FAF3]">Operational status</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#38D6B0]" />
            <span className="text-sm font-semibold text-white">Human-led care coordination</span>
          </div>
        </div>
      </aside>

      <div className="lg:pl-80">
        <div className="border-b border-white/10 bg-[#07111F]/90 px-5 py-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7F8A96]">Farz+ workspace</p>
              <p className="mt-1 text-sm font-semibold text-white">Care operations</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-[#E6FAF3]">Zainab Malik · London</span>
              <a className="rounded-full bg-[#38D6B0] px-4 py-2 text-xs font-bold text-[#07111F]" href="/login">Log out</a>
            </div>
          </div>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
