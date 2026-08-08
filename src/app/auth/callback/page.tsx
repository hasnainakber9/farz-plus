export default function AuthCallbackPage() {
  return (
    <section className="relative overflow-hidden py-14">
      <div className="mx-auto max-w-2xl rounded-[28px] border border-white/10 bg-[#07111F]/90 p-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#80C3DC]">Farz+ Auth</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Secure sign-in complete</h1>
        <p className="mt-5 text-sm leading-7 text-[#B8C0C8]">You’re being returned to your Farz+ workspace.</p>
        <a href="/dashboard" className="mt-8 inline-flex rounded-full bg-[#38D6B0] px-6 py-3 text-sm font-bold text-[#07111F]">Open my dashboard</a>
      </div>
    </section>
  );
}
