import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  Check,
  ClipboardCheck,
  FileCheck2,
  HeartPulse,
  LayoutDashboard,
  MessageCircle,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserRoundCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { StaticImageData } from "next/image";

type PersonaRole = "families" | "care-teams" | "doctors";

interface PersonaConfig {
  role: PersonaRole;
  eyebrow: string;
  title: string;
  intro: string;
  image: { src: string | StaticImageData; alt: string; credit: string; href: string };
  dashboardHref: string;
  dashboardLabel: string;
  outcomes: string[];
  features: { title: string; detail: string; icon: typeof Activity }[];
  workflow: { step: string; title: string; detail: string }[];
}

const previewData = {
  families: {
    label: "Family care feed",
    status: "All updates synchronized",
    items: [
      ["08:10", "Morning check-in complete", "Breakfast, mood, and BP documented."],
      ["08:35", "Medication confirmed", "Lisinopril marked taken by Ayesha."],
      ["09:18", "Family question held for review", "Possible duplicate dose flagged."],
    ],
    action: "Request care-manager escalation",
  },
  "care-teams": {
    label: "Safety handoff queue",
    status: "2 cases need a human",
    items: [
      ["09:18", "Family message received", "Possible duplicate medication dose."],
      ["09:19", "AI safety layer", "Autonomous response stopped."],
      ["09:21", "Corti context ready", "Sources attributable for Ayesha."],
    ],
    action: "Approve, edit, or escalate",
  },
  doctors: {
    label: "Clinical escalation inbox",
    status: "1 priority review",
    items: [
      ["09:28", "Saeeda Khan Â· 81", "Elevated BP trend and breathlessness."],
      ["09:29", "Clinical summary assembled", "Vitals, allergies, and care log attached."],
      ["09:31", "Care manager standing by", "Family communication remains with Ayesha."],
    ],
    action: "Record a clinical plan",
  },
} as const;

function PersonaPreview({ role }: { role: PersonaRole }) {
  const preview = previewData[role];
  return (
    <div className="overflow-hidden rounded-md border site-border bg-[var(--site-surface)] shadow-[0_20px_70px_rgba(20,58,53,0.12)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b site-border bg-[var(--site-surface-soft)] px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase text-[#08A98A]">{preview.label}</p>
          <p className="site-muted mt-1 text-xs">Hassan family demo tenant</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded border border-[#AFCFC7] bg-[#EAF8F4] px-2 py-1 text-[10px] font-bold text-[#08705F]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#08A98A]" />
          {preview.status}
        </span>
      </div>
      <div className="divide-y divide-[var(--site-line)]">
        {preview.items.map(([time, title, detail], index) => (
          <div key={title} className="grid grid-cols-[50px_34px_minmax(0,1fr)] gap-3 px-5 py-4">
            <span className="site-muted text-xs font-semibold">{time}</span>
            <span className="grid h-8 w-8 place-items-center rounded-md bg-[#EAF8F4] text-[#087B69]">
              {index === 0 ? <MessageCircle className="h-4 w-4" /> : index === 1 ? <ShieldCheck className="h-4 w-4" /> : <UserRoundCheck className="h-4 w-4" />}
            </span>
            <div>
              <p className="site-text text-sm font-bold">{title}</p>
              <p className="site-muted mt-1 text-xs leading-5">{detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t site-border bg-[#073D35] p-4 text-center text-sm font-bold text-white">
        {preview.action}
      </div>
    </div>
  );
}

export function PersonaLanding({ config }: { config: PersonaConfig }) {
  return (
    <div className="site-shell">
      <section className="relative flex min-h-[660px] items-end overflow-hidden bg-[#073D35]">
        <Image
          src={config.image.src}
          alt={config.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#073D35]/76" />
        <a
          href={config.image.href}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-3 right-4 z-20 text-[10px] font-semibold text-white/65 transition hover:text-white"
        >
          Photo: {config.image.credit}
        </a>
        <div className="relative z-10 mx-auto w-full max-w-[1540px] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8">
          <p className="text-xs font-bold uppercase text-[#78E3CA]">{config.eyebrow}</p>
          <h1 className="mt-4 max-w-[900px] text-4xl font-extrabold leading-[1.04] text-white sm:text-6xl">
            {config.title}
          </h1>
          <p className="mt-5 max-w-[720px] text-base leading-7 text-[#C0DCD5] sm:text-lg">{config.intro}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={config.dashboardHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#78E3CA] px-5 text-sm font-bold text-[#073D35] hover:bg-[#9AF0DC]"
            >
              <LayoutDashboard className="h-4 w-4" />
              {config.dashboardLabel}
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/30 px-5 text-sm font-bold text-white hover:bg-white/8"
            >
              Talk to Farz+ <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#C0DCD5]">
            {config.outcomes.map((outcome) => (
              <span key={outcome} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#78E3CA]" />
                {outcome}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="site-surface site-border border-b py-18 sm:py-22">
        <div className="mx-auto grid max-w-[1540px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase text-[#08A98A]">The working view</p>
            <h2 className="site-text mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              Designed around the decision in front of you.
            </h2>
            <p className="site-muted mt-4 text-base leading-7">
              Farz+ separates family visibility, operational responsibility, and clinical authority without breaking
              the shared record between them.
            </p>
          </div>
          <PersonaPreview role={config.role} />
        </div>
      </section>

      <section className="site-soft site-border border-b py-18 sm:py-22">
        <div className="mx-auto max-w-[1540px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-px overflow-hidden rounded-md border site-border bg-[var(--site-line)] sm:grid-cols-2 lg:grid-cols-4">
            {config.features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="site-surface min-h-52 p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-[#EAF8F4] text-[#087B69]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="site-text mt-5 text-base font-bold">{feature.title}</h3>
                  <p className="site-muted mt-2 text-sm leading-6">{feature.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="site-surface py-18 sm:py-22">
        <div className="mx-auto max-w-[1540px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase text-[#08A98A]">From signal to follow-through</p>
            <h2 className="site-text mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              A workflow people can explain and trust.
            </h2>
          </div>
          <div className="mt-9 grid gap-4 lg:grid-cols-4">
            {config.workflow.map((item) => (
              <article key={item.step} className="border-l-2 border-[#08A98A] pl-5">
                <p className="text-xs font-bold text-[#08A98A]">{item.step}</p>
                <h3 className="site-text mt-3 text-lg font-bold">{item.title}</h3>
                <p className="site-muted mt-2 text-sm leading-6">{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t site-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="site-text text-xl font-bold">Open the real prototype workspace.</h3>
              <p className="site-muted mt-1 text-sm">Demo credentials are prefilled for this role.</p>
            </div>
            <Link
              href={config.dashboardHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#006E5B] px-5 text-sm font-bold text-white hover:bg-[#005B4C]"
            >
              {config.dashboardLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export const familyPersona: PersonaConfig = {
  role: "families",
  eyebrow: "For overseas Pakistani families",
  title: "Stay close to your parents without managing care from another country.",
  intro:
    "Farz+ gives siblings one clear record of check-ins, medicines, appointments, bills, and decisions, with a named care manager on the ground in Pakistan.",
  image: {
    src: "/images/farz-family-elder.jpg",
    alt: "An elderly Pakistani woman in traditional clothing.",
    credit: "Fakhar Imam on Pexels",
    href: "https://www.pexels.com/photo/elderly-woman-in-traditional-clothing-15735460/",
  },
  dashboardHref: "/login?role=family",
  dashboardLabel: "Open family dashboard",
  outcomes: ["In-app family updates", "Multi-sibling synchronization", "Medication visibility", "Transparent care record"],
  features: [
    { title: "WhatsApp care feed", detail: "Care-manager updates, photo check-ins, vitals, and handoffs in one chronological view.", icon: MessageCircle },
    { title: "Sibling sync", detail: "Decision-makers and viewers see the same approved facts without repeating calls across time zones.", icon: Users },
    { title: "Medication tracker", detail: "See taken, missed, and pending medications with accountable status changes.", icon: Pill },
    { title: "Urgent escalation", detail: "Request a named care-manager response while retaining clear emergency-service boundaries.", icon: AlertTriangle },
  ],
  workflow: [
    { step: "01", title: "Create the family record", detail: "Add the parent, family roles, care manager, medications, and emergency plan." },
    { step: "02", title: "Receive daily proof", detail: "Check-ins and medicine events appear in the same live family timeline." },
    { step: "03", title: "Ask through WhatsApp", detail: "Questions attach to the correct patient and care context automatically." },
    { step: "04", title: "See human follow-through", detail: "Every consequential reply shows who reviewed it and what happens next." },
  ],
};

export const careTeamPersona: PersonaConfig = {
  role: "care-teams",
  eyebrow: "For care managers and Saathis",
  title: "A calm operations room for the care decisions that cannot get lost.",
  intro:
    "Prioritize elders by risk, document home visits, assemble Corti context, and keep high-risk messages behind a named human approval gate.",
  image: {
    src: "/images/farz-care-team.jpg",
    alt: "Two healthcare professionals coordinating care in a clinic.",
    credit: "Nadezhda Moryak on Pexels",
    href: "https://www.pexels.com/photo/medical-professionals-in-a-clinic-7800532/",
  },
  dashboardHref: "/login?role=care-manager",
  dashboardLabel: "Open care operations",
  outcomes: ["Prioritized patient queue", "Structured daily MAR", "AI-assisted risk triage", "Human approval ledger"],
  features: [
    { title: "Risk-based queue", detail: "Stable, attention, and critical states keep the next human action visible.", icon: AlertTriangle },
    { title: "Safety handoff workspace", detail: "Original message, AI analysis, context, editable response, and escalation in one view.", icon: ShieldCheck },
    { title: "Daily MAR", detail: "Record taken or missed medication and make the update visible across roles immediately.", icon: ClipboardCheck },
    { title: "Escalation ownership", detail: "Route clinical questions to a licensed doctor without losing family or care-team context.", icon: UserRoundCheck },
  ],
  workflow: [
    { step: "01", title: "Receive the family signal", detail: "The verified WhatsApp message enters the assigned patient record." },
    { step: "02", title: "Review risk and sources", detail: "Safety rules and Corti context prepare evidence, not a clinical decision." },
    { step: "03", title: "Make the human decision", detail: "Approve, edit, or escalate with an attributable note." },
    { step: "04", title: "Close the loop", detail: "The family feed, MAR, and audit trail update from the same action." },
  ],
};

export const doctorPersona: PersonaConfig = {
  role: "doctors",
  eyebrow: "For doctors and clinics",
  title: "Receive the clinical question with the context already attached.",
  intro:
    "Farz+ converts scattered care-manager messages into a structured escalation with recent vitals, conditions, allergies, care logs, and a clear liability boundary.",
  image: {
    src: "/images/farz-doctor.jpg",
    alt: "A doctor in a modern clinical environment.",
    credit: "Dr. Haror's Wellness on Pexels",
    href: "https://www.pexels.com/photo/professional-female-doctor-portrait-in-clinic-32428850/",
  },
  dashboardHref: "/login?role=doctor",
  dashboardLabel: "Open doctor portal",
  outcomes: ["Priority escalation inbox", "Clinical summary sheet", "Vitals trends", "Attributed clinical observations"],
  features: [
    { title: "Escalation inbox", detail: "Only cases requiring licensed clinical review arrive in the doctor workspace.", icon: Stethoscope },
    { title: "Clinical summary", detail: "Conditions, allergies, recent readings, and the care-manager question are organized together.", icon: FileCheck2 },
    { title: "Vitals telemetry", detail: "Recent blood pressure, blood sugar, and heart-rate trends support faster review.", icon: HeartPulse },
    { title: "Action record", detail: "Document a clinical plan or schedule a tele-consult with an attributable audit entry.", icon: CalendarCheck },
  ],
  workflow: [
    { step: "01", title: "Receive a qualified escalation", detail: "Care managers route clinical questions after the Farz+ safety gate." },
    { step: "02", title: "Review the clinical summary", detail: "The doctor sees source context and recent care evidence, not model-generated certainty." },
    { step: "03", title: "Record the professional plan", detail: "Observations remain authored and attributable to the licensed clinician." },
    { step: "04", title: "Return responsibility", detail: "The care manager receives the plan and remains accountable for family communication." },
  ],
};
