export default function ClinicianDashboardPage() {
  return (
    <section className="relative overflow-hidden py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#80C3DC]">Clinical review</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Escalation Workspace</h1>
          </div>
          <span className="rounded-full border border-[#DCCB85]/30 bg-[#DCCB85]/10 px-4 py-2 text-sm font-bold text-[#FBEFDC]">Doctor portal</span>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8C0C8]">Open escalations</p>
            <p className="mt-3 text-4xl font-bold text-white">02</p>
            <p className="mt-2 text-sm leading-7 text-[#B8C0C8]">Medication and symptom context awaiting clinician review.</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 lg:col-span-2">
            <p className="text-sm font-bold text-white">Current escalation</p>
            <div className="mt-4 space-y-3 text-sm text-[#B8C0C8]">
              <p><span className="text-white">Case:</span> FARZ-2429 — Bilquis Begum</p>
              <p><span className="text-white">Reason:</span> Medication-related concern detected. Route to human review.</p>
              <p><span className="text-white">Context:</span> Amlodipine 5mg recorded; family concern about duplicate dose and symptom follow-up.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
