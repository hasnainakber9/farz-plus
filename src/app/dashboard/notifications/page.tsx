import { requireUser } from "@/lib/auth";

export default async function NotificationsPage() {
  const { supabase } = await requireUser();
  const { data: notifications } = await supabase.from("notifications").select("id,title,body,href,read_at,created_at").order("created_at", { ascending: false }).limit(50);
  return <main className="min-h-screen bg-[#F3F7F5] px-5 py-10 text-[#143A35] sm:px-8"><div className="mx-auto max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#087B69]">Farz+ account</p><h1 className="mt-3 text-3xl font-extrabold">Notifications</h1><div className="mt-6 overflow-hidden rounded-md border border-[#D5E4E0] bg-white">{notifications?.length ? notifications.map((notification: { id: string; title: string; body: string; created_at: string }) => <article key={notification.id} className="border-b border-[#E3ECE9] p-5 last:border-b-0"><div className="flex items-start justify-between gap-4"><h2 className="font-bold">{notification.title}</h2><time className="text-xs text-[#80948F]">{new Date(notification.created_at).toLocaleString("en-PK")}</time></div><p className="mt-2 text-sm leading-6 text-[#60756F]">{notification.body}</p></article>) : <div className="p-8 text-center text-sm text-[#70847E]">No notifications yet.</div>}</div></div></main>;
}
