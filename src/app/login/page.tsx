import { LockKeyhole, LogIn, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <section className="relative overflow-hidden py-14">
      <div className="absolute inset-0 grid-texture opacity-35" />
      <div className="relative mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-[#07111F]/90 shadow-[0_30px_120px_rgba(0,0,0,0.40)] lg:grid-cols-[1fr_0.92fr]">
        <div className="relative min-h-[560px] overflow-hidden bg-gradient-to-br from-[#174B4F] to-[#081A2A] p-10 sm:p-14">
          <div className="absolute right-[-80px] top-[-100px] h-72 w-72 rounded-full border border-white/20" />
          <div className="absolute left-[-90px] bottom-[-110px] h-80 w-80 rounded-full border border-[#38D6B0]/50" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6FAF3]">Farz+</p>
            <h1 className="mt-5 max-w-xl text-5xl font-bold leading-tight tracking-tight text-white">Care for every family moment.</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#B8C0C8]">
              A safer, calmer way for families to stay connected to loved ones, care managers, and the services around them.
            </p>
            <div className="mt-10 grid gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <ShieldCheck className="h-5 w-5 text-[#38D6B0]" />
                <span className="text-sm text-white">Human-led care coordination</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <ShieldCheck className="h-5 w-5 text-[#38D6B0]" />
                <span className="text-sm text-white">Sensitive requests reviewed by the right team</span>
              </div>
            </div>
            <div className="mt-12 rounded-[28px] border border-white/20 bg-white/[0.06] p-5">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full border border-[#38D6B0]/40 bg-[#38D6B0]/12 text-[#E6FAF3]">
                  <span className="font-mono text-sm">01</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Zainab Malik — London</p>
                  <p className="mt-1 text-sm text-[#B8C0C8]">Family updates and appointment visibility</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#092134] p-10 sm:p-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#38D6B0]/12 text-[#38D6B0]">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                  <p className="mt-1 text-sm text-[#B8C0C8]">Enter your Farz+ workspace</p>
                </div>
              </div>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E6FAF3]">Secure</span>
          </div>

          <form className="mt-10 grid gap-5">
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8C0C8]">Email address</span>
              <input className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none focus:border-[#38D6B0]" type="email" placeholder="family@farzplus.pk" />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8C0C8]">Password</span>
              <input className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none focus:border-[#38D6B0]" type="password" placeholder="••••••••" />
            </label>
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-[#B8C0C8]">
                <input type="checkbox" className="accent-[#38D6B0]" />
                Remember this device
              </label>
              <a href="/forgot-password" className="font-semibold text-[#E6FAF3] hover:text-white">Forgot password?</a>
            </div>
            <button type="button" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#38D6B0] px-6 py-3 text-sm font-extrabold text-[#07111F]">
              <LogIn className="h-4 w-4" />
              Sign in
            </button>
            <a className="text-center text-sm font-semibold text-[#B8C0C8] hover:text-white" href="/signup">Create an account</a>
          </form>

          <div className="mt-8 rounded-2xl border border-[#8DDBB4]/25 bg-[#38D6B0]/7 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E6FAF3]">Demo accounts</p>
            <ul className="mt-3 space-y-2 text-sm text-[#B8C0C8]">
              <li><span className="font-semibold text-white">Overseas Family:</span> zainab@farzplus.demo</li>
              <li><span className="font-semibold text-white">Care Manager:</span> hamza@farzplus.demo</li>
              <li><span className="font-semibold text-white">Clinical Reviewer:</span> dr.farooq@farzplus.demo</li>
              <li><span className="font-semibold text-white">Admin:</span> admin@farzplus.demo</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
