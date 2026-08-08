import type { Metadata } from "next";
import { Activity, FileText, HeartHandshake, ShieldCheck, Users, UserRound } from "lucide-react";
import { AdminInviteForm } from "@/components/admin-invite-form";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin operations", description: "Farz+ administrator operations dashboard." };

type AuditRow = { id: string; action: string; entity_type: string; created_at: string };

export default async function AdminDashboardPage() {
  const { supabase, profile } = await requireRole("ADMIN");
  const [{ count: users }, { count: households }, { count: elders }, { count: requests }, { count: leads }, { data: auditRows }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("households").select("id", { count: "exact", head: true }),
    supabase.from("elders").select("id", { count: "exact", head: true }),
    supabase.from("care_requests").select("id", { count: "exact", head: true }).not("status", "in", "(RESOLVED,CLOSED)"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "NEW"),
    supabase.from("audit_events").select("id,action,entity_type,created_at").order("created_at", { ascending: false }).limit(8),
  ]);
  const recentAudit = (auditRows ?? []) as unknown as AuditRow[];
  const metrics = [
    { label: "Accounts", value: users ?? 0, icon: Users },
    { label: "Households", value: households ?? 0, icon: HeartHandshake },
    { label: "Parents", value: elders ?? 0, icon: UserRound },
    { label: "Open cases", value: requests ?? 0, icon: Activity },
    { label: "New leads", value: leads ?? 0, icon: FileText },
  ];

  return (
    <main className="min-h-screen bg-[#F3F7F5] text-[#143A35]">
      <header className="border-b border-[#D8E5E1] bg-white"><div className="mx-auto flex min-h-17 max-w-[1500px] items-center justify-between gap-4 px-5 sm:px-7"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#087B69]">Farz+ operations</p><h1 className="mt-1 text-xl font-extrabold">Administrator console</h1></div><div className="flex items-center gap-3 text-sm font-semibold text-[#60756F]"><span>{profile.display_name}</span><form action="/api/auth/logout" method="post"><button className="rounded-md border border-[#D5E4E0] px-3 py-2 text-xs font-bold">Sign out</button></form></div></div></header>
      <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-7">
        <nav className="flex flex-wrap gap-2 text-sm font-semibold text-[#536B66]" aria-label="Admin navigation">{["Overview", "Users", "Families", "Parents", "Care Managers", "Clinicians", "Cases", "Tasks", "Partners", "Leads", "Subscriptions", "Audit", "Settings"].map((item) => <span key={item} className={item === "Overview" ? "rounded-md bg-[#E8F5F1] px-3 py-2 text-[#087B69]" : "rounded-md border border-[#DCE8E4] bg-white px-3 py-2"}>{item}</span>)}</nav>
        <section className="mt-6 grid gap-px overflow-hidden rounded-md border border-[#D5E4E0] bg-[#DCE9E5] sm:grid-cols-2 lg:grid-cols-5">{metrics.map((metric) => { const Icon = metric.icon; return <div key={metric.label} className="bg-white p-5"><Icon className="h-5 w-5 text-[#087B69]" /><p className="mt-4 text-3xl font-extrabold">{metric.value}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#70847E]">{metric.label}</p></div>; })}</section>
        <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><div className="rounded-md border border-[#D5E4E0] bg-white"><div className="flex items-center justify-between border-b border-[#DCE9E5] px-5 py-4"><div><h2 className="font-bold">Recent audit activity</h2><p className="mt-1 text-xs text-[#70847E]">Safe identifiers only. Clinical narrative is excluded.</p></div><ShieldCheck className="h-5 w-5 text-[#087B69]" /></div><div className="divide-y divide-[#E3ECE9]">{recentAudit.map((event) => <div key={event.id} className="flex items-center justify-between gap-4 px-5 py-4"><div><p className="text-sm font-bold">{event.action}</p><p className="mt-1 text-xs text-[#70847E]">{event.entity_type} · {event.id}</p></div><time className="text-xs text-[#80948F]">{new Date(event.created_at).toLocaleString("en-PK")}</time></div>)}{!recentAudit.length ? <p className="p-5 text-sm text-[#70847E]">No audit events yet.</p> : null}</div></div><div className="grid content-start gap-4"><AdminInviteForm /><div className="rounded-md border border-[#D5E4E0] bg-white p-5"><h2 className="font-bold">Integration controls</h2><dl className="mt-4 grid gap-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-[#70847E]">Supabase</dt><dd className="font-bold text-[#08705F]">Connected by runtime</dd></div><div className="flex justify-between gap-4"><dt className="text-[#70847E]">Corti PHI</dt><dd className="font-bold text-[#876618]">Disabled until approved</dd></div><div className="flex justify-between gap-4"><dt className="text-[#70847E]">WhatsApp</dt><dd className="font-bold text-[#876618]">In-app messaging only</dd></div><div className="flex justify-between gap-4"><dt className="text-[#70847E]">Initial admin</dt><dd className="max-w-[190px] truncate font-bold">hasnainakber9@gmail.com</dd></div></dl></div><div className="rounded-md border border-[#D5E4E0] bg-white p-5"><h2 className="font-bold">Launch boundary</h2><p className="mt-3 text-sm leading-6 text-[#60756F]">Nationwide digital access is available. Physical coordination remains case-by-case and must be confirmed by the care team.</p></div></div></section>
      </div>
    </main>
  );
}
