import {
  AlertTriangle,
  Ambulance,
  CalendarCheck,
  ClipboardCheck,
  Clock,
  FileText,
  HeartHandshake,
  MessageSquareText,
  Pill,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { CareScoreRing } from "@/components/care-score-ring";
import { CountingBar } from "@/components/stitch-motion";
import { GlassCard, MetricCard, StatusPill } from "@/components/ui";
import { realImages } from "@/lib/assets";
import { corporateAccounts, demoElder, demoPartners, monthlyReport } from "@/lib/content";

export function FamilyDashboardPreview() {
  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <GlassCard className="overflow-hidden p-0 lg:col-span-4">
        <div className="relative h-72">
          <Image
            alt={realImages.elderKarachi.alt}
            src={realImages.elderKarachi.src}
            fill
            sizes="(min-width: 1024px) 380px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061422] via-[#061422]/45 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <StatusPill>Parent status: Stable</StatusPill>
            <h3 className="mt-4 text-2xl font-semibold text-white">Ammi - Lahore</h3>
            <p className="mt-2 text-sm leading-6 text-[#D6E4F7]">Care manager Ayesha. Emergency plan active.</p>
          </div>
        </div>
        <div className="grid gap-3 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#E6FAF3]">Overall care score</p>
              <p className="mt-2 text-sm text-[#B8C0C8]">Updated after today&apos;s check-in.</p>
            </div>
            <CareScoreRing score={88} size="sm" />
          </div>
          <InfoLine icon={Pill} label="Medicine" value="Morning dose completed" />
          <InfoLine icon={CalendarCheck} label="Appointment" value="Cardiology follow-up on Thursday" />
          <InfoLine icon={ShieldCheck} label="Emergency readiness" value="Contacts and hospital preferences verified" />
        </div>
      </GlassCard>
      <GlassCard className="p-5 lg:col-span-4">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <h3 className="text-xl font-semibold text-white">Medicine Adherence</h3>
          <StatusPill>Completed</StatusPill>
        </div>
        <div className="mt-5 grid gap-3">
          <MedicineRow name="Lisinopril (Blood Pressure)" dose="10mg - Morning" />
          <MedicineRow name="Vitamin D3" dose="5000 IU - After Breakfast" />
        </div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-lg font-semibold text-white">Last Check-in</h4>
              <p className="mt-1 font-mono text-xs text-[#E6FAF3]">Today, 9:30 AM</p>
            </div>
            <MessageSquareText className="h-5 w-5 text-[#80C3DC]" />
          </div>
          <p className="mt-4 text-sm leading-7 text-[#D6E4F7]">
            &quot;Ammi reported feeling well after breakfast. Blood pressure is normal. She plans to take a short walk in the garden later.&quot;
          </p>
          <button className="mt-4 flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-[#A2C9FF]">
            Play Audio Recording
          </button>
        </div>
      </GlassCard>
      <GlassCard className="p-5 lg:col-span-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-white">Family Care Timeline</h3>
          <StatusPill tone="info">Proof-based</StatusPill>
        </div>
        <div className="mt-5 space-y-4">
          {demoElder.timeline.map((event) => (
            <div key={event.id} className="grid gap-1 rounded-3xl border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{event.title}</p>
                <span className="font-mono text-xs text-[#E6FAF3]">{event.time}</span>
              </div>
              <p className="text-sm leading-6 text-[#B8C0C8]">{event.detail}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-[#7F8A96]">Proof: {event.proof}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-[#80C3DC]/20 bg-[#80C3DC]/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#9CDFF9]">Partner SLA</span>
            <span className="font-mono text-sm text-white">91%</span>
          </div>
          <div className="mt-3">
            <CountingBar width="91%" />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function MedicineRow({ name, dose }: { name: string; dose: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
      <div>
        <p className="font-semibold text-white">{name}</p>
        <p className="mt-1 font-mono text-xs text-[#B8C0C8]">{dose}</p>
      </div>
      <span className="grid h-8 w-8 place-items-center rounded-full border border-[#38D6B0]/35 bg-[#38D6B0]/10 text-[#38D6B0]">
        <Pill className="h-4 w-4" />
      </span>
    </div>
  );
}

export function CareManagerDashboardPreview() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <MetricCard label="Assigned elders" value="18" detail="Ayesha's active care-manager panel." />
      <MetricCard label="SLA tasks" value="7" detail="Open check-ins, partner bookings, and updates." />
      <MetricCard label="Risk flags" value="2" detail="Missed medicine and mood-watch follow-ups." />
      <GlassCard className="lg:col-span-2">
        <h3 className="text-xl font-semibold text-white">Today&apos;s care-manager queue</h3>
        <div className="mt-5 grid gap-3">
          <TaskLine icon={MessageSquareText} title="Check-in script" detail="Call Ammi, confirm mood, meals, medicines, and appointment readiness." status="Due 9:30 AM" />
          <TaskLine icon={Pill} title="Medicine adherence" detail="Confirm afternoon Vitamin D reminder and add proof to timeline." status="Due 2:00 PM" />
          <TaskLine icon={Ambulance} title="Emergency drill" detail="Review family call tree and preferred hospital details." status="Due Friday" />
          <TaskLine icon={FileText} title="Family update composer" detail="Draft weekly summary for Dubai and Karachi family members." status="Draft" />
        </div>
      </GlassCard>
      <GlassCard>
        <h3 className="text-xl font-semibold text-white">Supervisor review</h3>
        <p className="mt-3 text-sm leading-7 text-[#B8C0C8]">
          A supervisor checks high-risk cases, unresolved complaints, emergency events, and care-manager workload before weekly reports go out.
        </p>
      </GlassCard>
    </div>
  );
}

export function AdminDashboardPreview() {
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#D5E4E0] bg-[#F8FBF9] px-4 py-3">
        <p className="text-sm font-bold text-[#143A35]">Illustrative operations workspace</p>
        <StatusPill tone="neutral">Sample data</StatusPill>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Partner workflow" value="4" detail="Verification, booking, proof, and review." />
        <MetricCard label="Documentation" value="Required" detail="Every completed service needs a proof record." />
        <MetricCard label="SLA tracking" value="Enabled" detail="Response and completion windows are recorded." />
        <MetricCard label="Review model" value="Human" detail="Care managers own partner decisions." />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard>
          <h3 className="text-xl font-semibold text-[#143A35]">Partner Network OS</h3>
          <div className="mt-5 grid gap-3">
            {demoPartners.map((partner) => (
              <div key={partner.id} className="rounded-md border border-[#D5E4E0] bg-[#F8FBF9] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#143A35]">{partner.name}</p>
                    <p className="mt-1 text-sm text-[#60756F]">{partner.category} - {partner.city}</p>
                  </div>
                  <StatusPill>{partner.status}</StatusPill>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <MiniScore label="Response" value={partner.score.responseTime} />
                  <MiniScore label="Quality" value={partner.score.quality} />
                  <MiniScore label="Docs" value={partner.score.documentationQuality} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-xl font-semibold text-[#143A35]">Employer programme scenarios</h3>
          <div className="mt-5 space-y-4">
            {corporateAccounts.map((account) => (
              <div key={account.id} className="rounded-md border border-[#D5E4E0] bg-[#F8FBF9] p-4">
                <p className="font-semibold text-[#143A35]">{account.company}</p>
                <p className="mt-2 text-sm text-[#60756F]">
                  Sample configuration: {account.employeesCovered} eligible employees and {account.activeParents} parent profiles.
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export function ElderMobilePreview() {
  const actions = [
    ["Call Farz+", HeartHandshake],
    ["Call family", UsersRound],
    ["Emergency SOS", AlertTriangle],
    ["Today appointment", Clock],
  ] as const;

  return (
    <div className="mx-auto max-w-sm rounded-[36px] border border-white/10 bg-[#07111F] p-4 shadow-[0_30px_120px_rgba(14,75,130,0.35)]">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-white">Ammi</p>
          <StatusPill>Urdu / English</StatusPill>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#B8C0C8]">Large-button elder screen. Parent app is optional.</p>
        <div className="mt-5 grid gap-3">
          {actions.map(([label, Icon]) => (
            <button
              key={label}
              type="button"
              className={`flex min-h-16 items-center gap-3 rounded-3xl border px-4 text-left text-base font-semibold ${
                label === "Emergency SOS"
                  ? "border-[#FF4D5A]/40 bg-[#FF4D5A]/15 text-white"
                  : "border-white/10 bg-white/[0.06] text-white"
              }`}
            >
              <Icon className={label === "Emergency SOS" ? "h-5 w-5 text-[#FF9BA3]" : "h-5 w-5 text-[#E6FAF3]"} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MonthlyReportCard() {
  return (
    <GlassCard>
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6 text-[#38D6B0]" aria-hidden="true" />
        <div>
          <h3 className="text-xl font-semibold text-white">Monthly care report</h3>
          <p className="text-sm text-[#B8C0C8]">{monthlyReport.month}</p>
        </div>
      </div>
      <div className="mt-5 flex items-end gap-2">
        {monthlyReport.careScoreTrend.map((score, index) => (
          <div key={`${score}-${index}`} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-2xl bg-gradient-to-t from-[#126379] to-[#38D6B0]"
              style={{ height: `${score}px` }}
            />
            <span className="font-mono text-xs text-[#E6FAF3]">{score}</span>
          </div>
        ))}
      </div>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-[#B8C0C8]">
        {monthlyReport.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </GlassCard>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Pill;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.05] p-4">
      <Icon className="h-5 w-5 flex-none text-[#38D6B0]" aria-hidden="true" />
      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-[#7F8A96]">{label}</p>
        <p className="mt-1 text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function TaskLine({
  icon: Icon,
  title,
  detail,
  status,
}: {
  icon: typeof Pill;
  title: string;
  detail: string;
  status: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 flex-none text-[#38D6B0]" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold text-white">{title}</p>
            <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-xs text-[#E6FAF3]">{status}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#B8C0C8]">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function MiniScore({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-[#D5E4E0] bg-white p-3">
      <p className="text-xl font-semibold text-[#143A35]">{value}</p>
      <p className="text-[10px] font-bold uppercase text-[#70847E]">{label}</p>
    </div>
  );
}
