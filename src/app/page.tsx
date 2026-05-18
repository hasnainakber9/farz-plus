import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { CareScoreRing } from "@/components/care-score-ring";
import {
  ElderMobilePreview,
  FamilyDashboardPreview,
  MonthlyReportCard,
} from "@/components/dashboard-panels";
import { EmergencyButton } from "@/components/emergency-button";
import { FaqAccordion } from "@/components/faq-accordion";
import { HeroDashboard, PakistanSignalMap } from "@/components/hero-dashboard";
import { LeadForm } from "@/components/lead-form";
import {
  CheckRow,
  DisclaimerBox,
  GlassCard,
  PrimaryButton,
  SecondaryButton,
  SectionHeading,
  Shell,
  StatusPill,
} from "@/components/ui";
import {
  careScoreInputs,
  cityPhases,
  comparisonRows,
  dashboardWidgets,
  emergencyTimeline,
  faqs,
  howItWorks,
  launchPlan,
  localization,
  metrics,
  pillars,
  plans,
  problemCards,
  saathiServices,
  services,
  testimonials,
  trustCards,
} from "@/lib/content";

const solutionIcons = [Stethoscope, ShieldCheck, HeartHandshake, UsersRound, BrainCircuit, ClipboardList];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-16 sm:pb-24 sm:pt-24">
        <div className="absolute inset-0 grid-texture opacity-60" />
        <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#0E4B82]/20 blur-3xl" />
        <Shell className="relative grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="min-w-0">
            <StatusPill tone="info">Pakistan-first parent care OS</StatusPill>
            <h1 className="mt-6 max-w-[22rem] text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:max-w-2xl sm:text-6xl lg:text-7xl">
              Care for your parents, even when you&apos;re away.
            </h1>
            <p className="mt-6 max-w-[22rem] text-lg leading-8 text-[#D7DEE6] sm:max-w-2xl">
              Farz+ helps Pakistani families support aging parents with check-ins, health coordination,
              emergency response, companionship, and transparent family updates, all managed through a trusted care platform.
            </p>
            <p className="mt-5 max-w-[22rem] text-sm font-medium text-[#A0E7B4] sm:max-w-2xl">
              Built for overseas Pakistanis, busy families, and elders who deserve dignity at home.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/contact" className="w-full max-w-[22rem] sm:w-auto">Book a Free Care Call</PrimaryButton>
              <SecondaryButton href="/care-plans" className="w-full max-w-[22rem] sm:w-auto">View Care Plans</SecondaryButton>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <MiniTrust label="Managed care" value="Not a marketplace" />
              <MiniTrust label="Launch city" value="Islamabad first" />
              <MiniTrust label="Parent app" value="Optional" />
            </div>
          </div>
          <HeroDashboard />
        </Shell>
      </section>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <SectionHeading eyebrow="The problem" title="Distance turns small worries into daily stress.">
            <p>
              When parents live alone or away from you, care becomes a chain of phone calls, favors, uncertainty,
              and late-night anxiety.
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {problemCards.map((problem) => (
              <GlassCard key={problem} className="min-h-32 p-5">
                <AlertTriangle className="h-5 w-5 text-[#FFC857]" aria-hidden="true" />
                <p className="mt-4 text-lg font-semibold text-white">{problem}</p>
              </GlassCard>
            ))}
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading eyebrow="The Farz+ solution" title="One care manager. One emergency plan. One family dashboard.">
              <p>
                Farz+ combines human care managers, verified partners, AI-assisted alerts, and transparent family updates into
                one managed system.
              </p>
            </SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              {pillars.map((pillar, index) => {
                const Icon = solutionIcons[index];
                return (
                  <GlassCard key={pillar} className="p-5">
                    <Icon className="h-6 w-6 text-[#4CD364]" aria-hidden="true" />
                    <p className="mt-4 text-lg font-semibold text-white">{pillar}</p>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <SectionHeading
            eyebrow="Differentiation"
            title="Not a marketplace. Not just home healthcare. A complete care operating system."
          />
          <div className="mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-white/[0.06] text-xs uppercase tracking-[0.18em] text-[#A0E7B4]">
                  <tr>
                    {["Feature", "Nursing agency", "Doctor app", "Marketplace", "Farz+"].map((heading) => (
                      <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-[#D7DEE6]">
                  {comparisonRows.map((row) => (
                    <tr key={row[0]} className="transition hover:bg-white/[0.035]">
                      {row.map((cell, index) => (
                        <td key={`${row[0]}-${index}`} className={index === 4 ? "px-5 py-4 font-semibold text-[#A0E7B4]" : "px-5 py-4"}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <SectionHeading eyebrow="Services" title="Everything your parents may need, coordinated in one place." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <GlassCard key={service} className="p-5">
                <CheckCircle2 className="h-5 w-5 text-[#4CD364]" aria-hidden="true" />
                <p className="mt-4 text-sm font-semibold leading-6 text-white">{service}</p>
              </GlassCard>
            ))}
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <SectionHeading eyebrow="How it works" title="Simple for families. Respectful for parents." />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((step, index) => (
              <GlassCard key={step.title} className="p-6">
                <span className="font-mono text-sm text-[#A0E7B4]">0{index + 1}</span>
                <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#B8C0C8]">{step.detail}</p>
              </GlassCard>
            ))}
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <SectionHeading eyebrow="Farz+ Care Score" title="Know how your parent is doing without calling ten people.">
                <p>
                  Care Score is not a medical diagnosis. It is a simple family visibility tool that helps identify when support may be needed.
                </p>
              </SectionHeading>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[["88", "Stable"], ["73", "Watch"], ["61", "Needs Attention"], ["42", "High Risk"]].map(([score, label]) => (
                  <div key={score} className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 text-center">
                    <p className="font-mono text-3xl font-semibold text-white">{score}</p>
                    <p className="mt-1 text-xs text-[#B8C0C8]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <GlassCard className="p-6">
              <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr]">
                <CareScoreRing score={88} />
                <ul className="grid gap-3 sm:grid-cols-2">
                  {careScoreInputs.map((input) => (
                    <CheckRow key={input}>{input}</CheckRow>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeading eyebrow="Emergency support" title="When something happens, everyone knows what to do.">
                <p>
                  Every parent profile includes contacts, preferred hospitals, nearest hospital, ambulance provider, doctor,
                  allergies, medicines, chronic conditions, blood group, home access notes, and neighbor backup.
                </p>
              </SectionHeading>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <EmergencyButton />
                <SecondaryButton href="/emergency-support">View Protocol</SecondaryButton>
              </div>
            </div>
            <GlassCard className="p-6">
              <div className="grid gap-4">
                {emergencyTimeline.map((item, index) => (
                  <div key={item} className="flex items-center gap-4">
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-full border border-[#4CD364]/30 bg-[#4CD364]/10 font-mono text-sm text-[#A0E7B4]">
                      {index + 1}
                    </span>
                    <p className="text-base font-semibold text-white">{item}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <SectionHeading eyebrow="Farz+ Saathi" title="Because health is not only medical.">
                <p>
                  Farz+ Saathi provides supervised companionship and practical support. Aging at home should not mean aging alone.
                </p>
              </SectionHeading>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {saathiServices.map((service) => (
                  <GlassCard key={service} className="p-4">
                    <CheckRow>{service}</CheckRow>
                  </GlassCard>
                ))}
              </div>
            </div>
            <ElderMobilePreview />
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <SectionHeading eyebrow="Family dashboard" title="Your parent's care, visible in one place." />
          <div className="mt-10">
            <FamilyDashboardPreview />
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardWidgets.map((widget) => (
              <div key={widget} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#D7DEE6]">
                {widget}
              </div>
            ))}
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <SectionHeading eyebrow="Pakistan localization" title="Built for Pakistani families, not imported care models.">
                <p>
                  Islamabad launches first, with Rawalpindi treated as operational adjacency. The roadmap then expands city by city after partner quality is proven.
                </p>
              </SectionHeading>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {localization.map((item) => (
                  <GlassCard key={item} className="p-4">
                    <CheckRow>{item}</CheckRow>
                  </GlassCard>
                ))}
              </div>
            </div>
            <div className="grid gap-5">
              <PakistanSignalMap />
              {cityPhases.map((phase) => (
                <GlassCard key={phase.phase} className="p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A0E7B4]">{phase.phase}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{phase.cities.join(", ")}</p>
                  <p className="mt-2 text-sm leading-6 text-[#B8C0C8]">{phase.note}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <SectionHeading eyebrow="Plans and pricing" title="Start with the right level of support.">
            <p>Pricing remains placeholder until Islamabad partner rates, operations cost, and care-manager capacity are validated.</p>
          </SectionHeading>
          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            {plans.map((plan) => (
              <GlassCard key={plan.name} className={plan.badge ? "relative p-5 ring-1 ring-[#4CD364]/50" : "p-5"}>
                {plan.badge ? (
                  <span className="absolute right-5 top-5 rounded-full bg-[#4CD364] px-3 py-1 text-xs font-bold text-[#050410]">
                    {plan.badge}
                  </span>
                ) : null}
                <h3 className="pr-24 text-xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[#B8C0C8]">{plan.audience}</p>
                <p className="mt-5 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-[#A0E7B4]">{plan.price}</p>
                <ul className="mt-5 space-y-3">
                  {plan.features.map((feature) => (
                    <CheckRow key={feature}>{feature}</CheckRow>
                  ))}
                </ul>
                <PrimaryButton href="/contact" className="mt-6 w-full">{plan.cta}</PrimaryButton>
              </GlassCard>
            ))}
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <SectionHeading eyebrow="Trust and safety" title="Care needs proof, not promises.">
                <p>
                  Trust is designed into records, consent, roles, partner verification, complaint handling, and proof-based timeline events.
                </p>
              </SectionHeading>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {trustCards.map((card) => (
                  <GlassCard key={card} className="p-4">
                    <CheckRow>{card}</CheckRow>
                  </GlassCard>
                ))}
              </div>
            </div>
            <div className="grid gap-5">
              <MonthlyReportCard />
              <DisclaimerBox />
            </div>
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <SectionHeading eyebrow="Launch plan" title="Prove trust manually, then automate.">
            <p>
              The MVP starts with a concierge Islamabad pilot: landing page, WhatsApp lead capture, care consultations,
              parent profile forms, manual dashboard operations, and monthly family reports.
            </p>
          </SectionHeading>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {launchPlan.map((phase) => (
              <GlassCard key={phase.phase} className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A0E7B4]">{phase.phase}</p>
                <h3 className="mt-4 text-xl font-semibold text-white">{phase.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#B8C0C8]">{phase.detail}</p>
              </GlassCard>
            ))}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.slice(0, 8).map((metric) => (
              <div key={metric} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#D7DEE6]">
                {metric}
              </div>
            ))}
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <SectionHeading eyebrow="Testimonials" title="Realistic pilot feedback placeholders." />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((item) => (
              <GlassCard key={item.person} className="p-6">
                <Sparkles className="h-5 w-5 text-[#A0E7B4]" aria-hidden="true" />
                <p className="mt-5 text-base leading-8 text-white">&quot;{item.quote}&quot;</p>
                <p className="mt-5 text-sm font-semibold text-[#A0E7B4]">{item.person}</p>
              </GlassCard>
            ))}
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <Shell>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <SectionHeading eyebrow="FAQ" title="Questions families ask before trusting a care system." />
            <FaqAccordion items={faqs} />
          </div>
        </Shell>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-24">
        <Shell>
          <div className="grid gap-10 rounded-[36px] border border-white/10 bg-white/[0.06] p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <StatusPill>Final CTA</StatusPill>
              <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Your parents cared for you. Now let Farz+ help you care for them.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#B8C0C8]">
                Start with one parent profile, one care manager, and one simple care plan.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href="/contact">Book a Free Care Call</PrimaryButton>
                <SecondaryButton href="/care-plans">View Care Plans</SecondaryButton>
              </div>
            </div>
            <LeadForm compact />
          </div>
        </Shell>
      </AnimatedSection>
    </>
  );
}

function MiniTrust({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[#7F8A96]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
