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
import { CareScoreRing } from "@/components/care-score-ring";
import { GlassCard, MetricCard, StatusPill } from "@/components/ui";
import { corporateAccounts, demoElder, demoPartners, monthlyReport } from "@/lib/content";

export function FamilyDashboardPreview() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <GlassCard className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <StatusPill>Parent status: Stable</StatusPill>
            <h3 className="mt-4 text-2xl font-semibold text-white">Ammi - Lahore</h3>
            <p className="mt-2 text-sm leading-6 text-[#B8C0C8]">Care manager Ayesha. Emergency plan active.</p>
          </div>
          <CareScoreRing score={88} size="sm" />
        </div>
        <div className="mt-5 grid gap-3">
          <InfoLine icon={Pill} label="Medicine" value="Morning dose completed" />
          <InfoLine icon={CalendarCheck} label="Appointment" value="Cardiology follow-up on Thursday" />
          <InfoLine icon={ShieldCheck} label="Emergency readiness" value="Contacts and hospital preferences verified" />
        </div>
      </GlassCard>
      <GlassCard className="p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-white">Family Care Timeline</h3>
          <StatusPill tone="info">Proof-based</StatusPill>
        </div>
        <div className="mt-5 space-y-4">
          {demoElder.timeline.map((event) => (
            <div key={event.id} className="grid gap-1 rounded-3xl border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{event.title}</p>
                <span className="font-mono text-xs text-[#A0E7B4]">{event.time}</span>
              </div>
              <p className="text-sm leading-6 text-[#B8C0C8]">{event.detail}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-[#7F8A96]">Proof: {event.proof}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export function CareManagerDashboardPreview() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <MetricCard label="Assigned elders" value="18" detail="Ayesha's Islamabad pilot caseload." />
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Active elders" value="42" detail="Islamabad pilot accounts." />
        <MetricCard label="Emergency cases" value="3" detail="Two closed, one under follow-up." />
        <MetricCard label="Partner SLA" value="91%" detail="On-time completion this week." />
        <MetricCard label="Care Score avg" value="82" detail="Stable, with hydration watch flags." />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard>
          <h3 className="text-xl font-semibold text-white">Partner Network OS</h3>
          <div className="mt-5 grid gap-3">
            {demoPartners.map((partner) => (
              <div key={partner.id} className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{partner.name}</p>
                    <p className="mt-1 text-sm text-[#B8C0C8]">{partner.category} - {partner.city}</p>
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
          <h3 className="text-xl font-semibold text-white">Corporate accounts</h3>
          <div className="mt-5 space-y-4">
            {corporateAccounts.map((account) => (
              <div key={account.id} className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
                <p className="font-semibold text-white">{account.company}</p>
                <p className="mt-2 text-sm text-[#B8C0C8]">
                  {account.employeesCovered} employees covered. {account.activeParents} active parents.
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
    <div className="mx-auto max-w-sm rounded-[36px] border border-white/10 bg-[#050410] p-4 shadow-[0_30px_120px_rgba(14,75,130,0.35)]">
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
              <Icon className={label === "Emergency SOS" ? "h-5 w-5 text-[#FF9BA3]" : "h-5 w-5 text-[#A0E7B4]"} />
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
        <ClipboardCheck className="h-6 w-6 text-[#4CD364]" aria-hidden="true" />
        <div>
          <h3 className="text-xl font-semibold text-white">Monthly care report</h3>
          <p className="text-sm text-[#B8C0C8]">{monthlyReport.month}</p>
        </div>
      </div>
      <div className="mt-5 flex items-end gap-2">
        {monthlyReport.careScoreTrend.map((score, index) => (
          <div key={`${score}-${index}`} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-2xl bg-gradient-to-t from-[#126379] to-[#4CD364]"
              style={{ height: `${score}px` }}
            />
            <span className="font-mono text-xs text-[#A0E7B4]">{score}</span>
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
      <Icon className="h-5 w-5 flex-none text-[#4CD364]" aria-hidden="true" />
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
        <Icon className="mt-0.5 h-5 w-5 flex-none text-[#4CD364]" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold text-white">{title}</p>
            <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-xs text-[#A0E7B4]">{status}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#B8C0C8]">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function MiniScore({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#050410]/60 p-3">
      <p className="font-mono text-xl font-semibold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.14em] text-[#7F8A96]">{label}</p>
    </div>
  );
}
