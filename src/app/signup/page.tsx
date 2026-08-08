export default function SignupPage() {
  return (
    <section className="relative overflow-hidden py-14">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-[#07111F]/90 p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#80C3DC]">Farz+ onboarding</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Create your secure account</h1>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8C0C8]">Your name</span>
            <input className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white" />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8C0C8]">Email</span>
            <input className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white" type="email" />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8C0C8]">Password</span>
            <input className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white" type="password" />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8C0C8]">Role</span>
            <select className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white">
              <option className="text-black">Family member</option>
              <option className="text-black">Care manager</option>
              <option className="text-black">Clinician</option>
            </select>
          </label>
        </div>
        <button type="button" className="mt-8 rounded-full bg-[#38D6B0] px-6 py-3 text-sm font-bold text-[#07111F]">Continue</button>
      </div>
    </section>
  );
}
