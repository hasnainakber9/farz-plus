export default function ForgotPasswordPage() {
  return (
    <section className="relative overflow-hidden py-14">
      <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-[#07111F]/90 p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#80C3DC]">Farz+ access</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Reset your password</h1>
        <p className="mt-5 text-sm leading-7 text-[#B8C0C8]">Enter the email address connected to your Farz+ account and we’ll send an account recovery link.</p>
        <label className="mt-7 grid gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8C0C8]">Email address</span>
          <input className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white" type="email" placeholder="you@example.com" />
        </label>
        <button type="button" className="mt-7 rounded-full bg-[#38D6B0] px-6 py-3 text-sm font-bold text-[#07111F]">Send recovery link</button>
      </div>
    </section>
  );
}
