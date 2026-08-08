import type {
  CorporateAccount,
  ElderProfile,
  Partner,
  MonthlyReport,
} from "./types";

export const navItems = [
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Care Plans", href: "/care-plans" },
  { label: "Overseas Families", href: "/for-overseas-pakistanis" },
  { label: "Employers", href: "/for-employers" },
  { label: "Dashboard", href: "/dashboard" },
];

export const cityPhases = [
  {
    phase: "Core coverage",
    cities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi"],
    note: "Digital access is available nationwide; physical coordination is confirmed case by case.",
  },
  {
    phase: "Extended coverage",
    cities: ["Karachi", "Lahore", "Faisalabad", "Multan", "Hyderabad", "Peshawar", "Quetta", "Sialkot", "Gujranwala"],
    note: "Availability of any in-person service is confirmed with the family before it is promised.",
  },
];

export const problemCards = [
  "Missed medicines",
  "No daily visibility",
  "Emergency uncertainty",
  "Loneliness",
  "Hospital coordination stress",
  "Unverified caregivers",
  "Scattered reports",
  "Family guilt",
];

export const pillars = [
  "Health Coordination",
  "Emergency Readiness",
  "Companionship",
  "Family Visibility",
  "Care Intelligence",
  "Verified Partner Network",
];

export const comparisonRows = [
  ["Dedicated care manager", "Limited", "No", "No", "Yes"],
  ["Emergency protocol", "Limited", "No", "No", "Yes"],
  ["Family dashboard", "No", "Limited", "No", "Yes"],
  ["AI risk alerts", "No", "No", "No", "Yes"],
  ["Partner verification", "Maybe", "Limited", "Family burden", "Yes"],
  ["Companionship", "No", "No", "Maybe", "Yes"],
  ["Monthly reports", "No", "No", "No", "Yes"],
  ["Overseas-family focus", "No", "No", "No", "Yes"],
  ["WhatsApp-first elder support", "Maybe", "Maybe", "No", "Yes"],
];

export const services = [
  "Care manager assignment",
  "Weekly check-ins",
  "Daily medicine reminders",
  "Doctor visit coordination",
  "Lab test booking",
  "Pharmacy coordination",
  "Home nursing support",
  "Physiotherapy support",
  "Hospital appointment support",
  "Ambulance coordination",
  "Emergency response protocol",
  "Monthly family reports",
  "Home safety checks",
  "Fall-risk assessment",
  "Mental wellness calls",
  "Companionship visits",
  "Errand assistance",
  "Digital safety training",
  "Scam-awareness support",
  "Family video call setup",
  "Nutrition guidance",
  "Chronic condition tracking",
  "Medical equipment coordination",
  "Post-hospital recovery support",
];

export const howItWorks = [
  {
    title: "Book a care call",
    detail: "Tell us about your parent, city, health needs, and family situation.",
  },
  {
    title: "Create elder profile",
    detail: "Add medicines, doctors, emergency contacts, hospitals, and preferences.",
  },
  {
    title: "Choose a care plan",
    detail: "Select Basic, Plus, Premium, or custom employer support.",
  },
  {
    title: "Meet your care manager",
    detail: "A named Farz+ care manager contacts the family and parent.",
  },
  {
    title: "Activate care system",
    detail: "Check-ins, reminders, partner coordination, and emergency plan begin.",
  },
  {
    title: "Track everything",
    detail: "Family dashboard, WhatsApp updates, and monthly reports keep everyone informed.",
  },
];

export const careScoreInputs = [
  "Check-ins",
  "Medicines",
  "Appointments",
  "Mood",
  "Activity",
  "Meals and hydration",
  "Emergency readiness",
  "Care-manager notes",
  "Risk alerts",
];

export const emergencyTimeline = [
  "SOS received",
  "Family notified",
  "Ambulance contacted",
  "Hospital routed",
  "Care manager assigned",
  "Report generated",
];

export const saathiServices = [
  "Friendly calls",
  "Walk companionship",
  "Reading and conversation",
  "Family video call setup",
  "Errand support",
  "Appointment accompaniment",
  "Mosque and community visit support",
  "Hobby sessions",
  "Digital help",
  "Loneliness check-ins",
];

export const dashboardWidgets = [
  "Care Score",
  "Last check-in",
  "Medicine status",
  "Mood trend",
  "Upcoming appointment",
  "Emergency readiness",
  "Care-manager note",
  "Open service requests",
  "Recent activity timeline",
  "Monthly report download",
  "Partner bills",
  "Family contacts",
  "Consent settings",
];

export const localization = [
  "Urdu + English-ready content",
  "WhatsApp-first support",
  "Regional language support",
  "Female care-manager option",
  "City-specific partner network",
  "Overseas payment support",
  "Family consent hierarchy",
  "Ramadan and Eid reminders",
  "Local pharmacy and lab coordination",
  "Hospital navigation",
  "Respectful elder communication",
  "No forced app usage for parents",
];

export const plans = [
  {
    tier: "basic",
    name: "Farz Basic",
    audience: "For families who need visibility and light support.",
    price: "Rs 5,000 /mo",
    cta: "Start Basic",
    features: [
      "Elder profile",
      "Emergency contact setup",
      "Weekly check-in call",
      "Medicine reminders",
      "WhatsApp support",
      "Monthly summary",
      "Family dashboard access",
    ],
  },
  {
    tier: "plus",
    name: "Farz Plus",
    audience: "For families who need active care coordination.",
    price: "Rs 15,000 /mo",
    cta: "Choose Plus",
    badge: "Most Popular",
    features: [
      "Everything in Basic",
      "Assigned care manager",
      "Bi-weekly check-ins",
      "Doctor appointment coordination",
      "Lab and pharmacy coordination",
      "Emergency protocol",
      "Care Score",
      "Family timeline",
      "Monthly care report",
    ],
  },
  {
    tier: "premium",
    name: "Farz Premium",
    audience: "For families who need full support.",
    price: "Rs 35,000 /mo",
    cta: "Talk to Care Advisor",
    features: [
      "Everything in Plus",
      "Weekly care calls",
      "Priority care manager",
      "Home visit coordination",
      "Physiotherapy and nursing coordination",
      "Hospital support",
      "Saathi companionship sessions",
      "Advanced care reports",
      "Priority emergency coordination",
    ],
  },
  {
    tier: "corporate",
    name: "Farz Corporate",
    audience: "For employers supporting parent-care needs.",
    price: "Custom pricing",
    cta: "Contact Sales",
    features: [
      "Employee parent-care benefit",
      "Care hotline",
      "Discounted family plans",
      "HR dashboard",
      "Parent-care webinars",
      "Emergency membership",
      "Monthly anonymized wellbeing insights",
    ],
  },
];

export const trustCards = [
  "Verified partners",
  "Background-checked care staff",
  "Consent-based records",
  "Transparent service logs",
  "Family access control",
  "Emergency protocols",
  "Care-manager supervision",
  "Complaint escalation",
  "No hidden charges",
  "Data privacy",
];

export const testimonials = [
  {
    person: "Overseas son in Dubai",
    quote:
      "Farz+ helped me stop guessing. I now know when my mother's medicines are done and who is coordinating her appointments.",
  },
  {
    person: "Daughter in Karachi",
    quote:
      "The care manager became our single point of contact. It made everything easier.",
  },
  {
    person: "Senior parent in Lahore",
    quote:
      "They speak with respect. I do not feel monitored. I feel supported.",
  },
];

export const faqs = [
  ["Is Farz+ an old-age home?", "No. Farz+ supports elders aging at home through care coordination, check-ins, emergency planning, and verified partner support."],
  ["Does my parent need a smartphone?", "No. Families can use the dashboard while the care team confirms the best available communication channel."],
  ["Can I subscribe from abroad?", "Yes. Farz+ is designed for overseas Pakistanis and supports international family communication workflows."],
  ["What happens during an emergency?", "Farz+ shows an urgent routing notice, helps the family call local emergency services or a recorded contact, creates an urgent case, and keeps a human-owned timeline."],
  ["Do you provide doctors directly?", "Farz+ coordinates with verified doctors and partners. It does not replace licensed medical providers."],
  ["Are caregivers verified?", "Partner verification, background checks, documentation, scoring, and complaint escalation are core operating requirements."],
  ["Which cities do you support?", "Farz+ provides nationwide digital access. Any physical coordination is confirmed case by case based on current availability."],
  ["Can I choose a female care manager?", "Yes. Female care-manager preference is part of the Pakistan-first localization model."],
  ["Is my parent's data private?", "Records are consent-based with family roles, limited staff access, and privacy-first defaults."],
  ["Can I customize a plan?", "Yes. Premium and employer plans can be configured around family needs, city support, and partner availability."],
  ["Do you provide 24/7 nursing?", "Farz+ does not promise 24/7 nursing. A care manager can confirm whether a suitable local service is available for the specific case."],
  ["Is Farz+ a hospital or medical provider?", "No. Farz+ is a care coordination and family-support platform."],
  ["Can siblings share access?", "Yes. The family dashboard supports role-based sibling and family access."],
  ["How are partner charges handled?", "Partner costs are shown transparently with receipts, invoices, and timeline proof where appropriate."],
  ["What if my parent refuses app usage?", "The elder app is optional. Families can use the dashboard while the care team agrees the most respectful communication route."],
];

export const operationsCards = [
  {
    phase: "Care operations",
    title: "Managed support",
    detail:
      "Care managers coordinate check-ins, medicines, appointments, family updates, and emergency profiles.",
  },
  {
    phase: "Partner network",
    title: "Verified services",
    detail:
      "Doctors, labs, pharmacies, nurses, companions, and ambulance desks are verified, scored, and monitored.",
  },
  {
    phase: "Family visibility",
    title: "Transparent care",
    detail:
      "Families see care scores, updates, bills, requests, reports, and proof of completed actions.",
  },
];

export const sops = [
  "New family onboarding",
  "Elder consent",
  "Medicine reminder",
  "Missed check-in",
  "Doctor appointment",
  "Lab test booking",
  "Emergency escalation",
  "Hospital visit",
  "Companion visit",
  "Complaint handling",
  "Partner verification",
  "Monthly reporting",
  "Care manager handover",
  "Data privacy",
  "Refunds and cancellations",
];

export const metrics = [
  "Active elders",
  "New family leads",
  "Lead-to-care-call conversion",
  "Care-call-to-plan conversion",
  "Check-in completion rate",
  "Medicine adherence rate",
  "Emergency response time",
  "Partner SLA",
  "Complaint rate",
  "Churn",
  "Monthly recurring revenue",
  "Average revenue per elder",
  "Care Score trend",
  "Family satisfaction",
  "Elder satisfaction",
  "Care-manager workload",
];

export const partnerCategories = [
  "Doctors",
  "Nurses",
  "Physiotherapists",
  "Labs",
  "Pharmacies",
  "Ambulance providers",
  "Hospitals",
  "Mental-health professionals",
  "Medical-equipment providers",
  "Home-safety vendors",
  "Companions",
  "Attendants",
  "Nutritionists",
];

export const demoElder: ElderProfile = {
  id: "elder_ammi_lahore",
  name: "Ammi",
  city: "Lahore",
  age: 68,
  status: "Stable",
  careScore: {
    value: 88,
    label: "Stable",
    inputs: careScoreInputs,
  },
  careManager: {
    id: "cm_ayesha",
    name: "Ayesha",
    city: "Lahore",
    languages: ["English", "Urdu", "Punjabi"],
    caseload: 18,
    supervisor: "Nadia",
  },
  familyMembers: [
    {
      id: "fam_dubai",
      name: "Hamza",
      relation: "Son",
      location: "Dubai",
      phone: "+971 50 000 0000",
      role: "primary_decision_maker",
      notificationPreference: "whatsapp",
    },
    {
      id: "fam_karachi",
      name: "Sana",
      relation: "Daughter",
      location: "Karachi",
      phone: "+92 300 000 0000",
      role: "secondary_contact",
      notificationPreference: "whatsapp",
    },
  ],
  medications: [
    { id: "med_1", name: "Blood pressure medicine", dosage: "1 tablet", schedule: "9:00 AM", adherence: "completed" },
    { id: "med_2", name: "Vitamin D", dosage: "1 capsule", schedule: "After lunch", adherence: "pending" },
  ],
  appointments: [
    { id: "apt_1", provider: "Cardiology follow-up", type: "Hospital visit", date: "Thursday", status: "scheduled" },
    { id: "apt_2", provider: "Lab sample collection", type: "Home lab", date: "Next Monday", status: "scheduled" },
  ],
  emergencyPlan: {
    preferredHospital: "Shifa International Hospital",
    nearestHospital: "Ali Medical Centre",
    ambulanceProvider: "Verified local ambulance desk",
    primaryDecisionMaker: "Hamza - Dubai",
    secondaryContact: "Sana - Karachi",
    doctorContact: "Dr. Rahman",
    allergies: ["Penicillin"],
    chronicConditions: ["Hypertension"],
    bloodGroup: "B+",
    homeAccessInstructions: "Gate key with neighbor Mrs. Khan.",
    neighborBackup: "Mrs. Khan, next door",
    status: "active",
  },
  timeline: [
    {
      id: "tl_1",
      type: "check_in",
      title: "Care call completed",
      detail: "Mood stable. Breakfast taken. Walk planned after Asr.",
      proof: "Call log and care-manager note",
      time: "Today, 9:30 AM",
    },
    {
      id: "tl_2",
      type: "medicine",
      title: "Medicine confirmed",
      detail: "Morning blood pressure medicine marked complete.",
      proof: "WhatsApp confirmation",
      time: "Today, 9:45 AM",
    },
    {
      id: "tl_3",
      type: "family_update",
      title: "Family update sent",
      detail: "Summary delivered to Dubai and Karachi family members.",
      proof: "Notification delivered",
      time: "Today, 9:52 AM",
    },
  ],
  serviceRequests: [
    { id: "sr_1", title: "Book cardiology appointment", category: "Doctor", status: "coordinating", sla: "Due in 3 hours" },
    { id: "sr_2", title: "Monthly report review", category: "Report", status: "open", sla: "Due Friday" },
  ],
};

export const demoPartners: Partner[] = [
  {
    id: "partner_lab",
    name: "Home Lab Partner Network",
    category: "Labs",
    city: "Pakistan",
    status: "verified",
    score: {
      responseTime: 92,
      quality: 88,
      complaintRate: 96,
      pricingTransparency: 90,
      documentationQuality: 94,
      familyRating: 89,
      careManagerRating: 91,
      onTimeCompletion: 87,
      emergencyReliability: 84,
    },
  },
  {
    id: "partner_physio",
    name: "Physio Partner Network",
    category: "Physiotherapy",
    city: "Pakistan",
    status: "verified",
    score: {
      responseTime: 86,
      quality: 91,
      complaintRate: 93,
      pricingTransparency: 88,
      documentationQuality: 86,
      familyRating: 92,
      careManagerRating: 90,
      onTimeCompletion: 85,
      emergencyReliability: 79,
    },
  },
];

export const corporateAccounts: CorporateAccount[] = [
  { id: "corp_1", company: "Pakistan SaaS Co.", employeesCovered: 120, activeParents: 18, plan: "standard" },
  { id: "corp_2", company: "Gulf Remote Team", employeesCovered: 80, activeParents: 11, plan: "standard" },
];

export const monthlyReport: MonthlyReport = {
  id: "report_1",
  elderId: demoElder.id,
  month: "May 2026",
  careScoreTrend: [81, 84, 86, 88],
  notes: [
    "Medicine adherence improved after WhatsApp reminders.",
    "Emergency profile is complete and family contacts are verified.",
    "Next focus: physiotherapy partner selection and hydration routine.",
  ],
};

export const secondaryPages = {
  services: {
    eyebrow: "Services",
    title: "Everything your parents may need, coordinated in one place.",
    intro:
      "Farz+ manages the care layer between families, elders, doctors, labs, pharmacies, companions, and emergency contacts.",
    bullets: services,
  },
  howItWorks: {
    eyebrow: "How It Works",
    title: "Simple for families. Respectful for parents.",
    intro:
      "Create a parent profile, assign a care manager, and keep the family connected from day one.",
    bullets: howItWorks.map((step) => `${step.title}: ${step.detail}`),
  },
  overseas: {
    eyebrow: "For Overseas Pakistanis",
    title: "You may be abroad, but your parents are not alone.",
    intro:
      "Farz+ gives overseas families a trusted operating system for check-ins, care coordination, emergency planning, and transparent updates.",
    bullets: [
      "WhatsApp-first family communication",
      "Care timeline visible across countries",
      "Emergency call tree for decision-makers",
      "Partner coordination without random searching",
      "Monthly reports for peace of mind",
      "Remittance-friendly payment support",
    ],
  },
  localFamilies: {
    eyebrow: "For Families in Pakistan",
    title: "When life gets busy, Farz+ keeps care consistent.",
    intro:
      "For professionals, siblings, and out-of-city families who need a reliable backup layer around parents at home.",
    bullets: [
      "Care-manager operations across major cities",
      "Doctor, lab, pharmacy, and hospital appointment coordination",
      "Check-ins that respect elders and family hierarchy",
      "Emergency profile readiness",
      "Sibling access and role-based updates",
    ],
  },
  employers: {
    eyebrow: "Farz+ for Employers",
    title: "A benefit for the people your employees worry about most.",
    intro:
      "Parent-care support helps teams reduce stress, improve retention, and support employees with aging parents in Pakistan.",
    bullets: [
      "Employee parent-care plans",
      "Emergency support membership",
      "Care hotline",
      "Monthly parent-care webinars",
      "Discounted family plans",
      "HR dashboard and anonymized wellbeing insights",
    ],
  },
  emergency: {
    eyebrow: "Emergency Support",
    title: "When something happens, everyone knows what to do.",
    intro:
      "Farz+ creates emergency readiness before the emergency, then coordinates family updates and approved partner support during an incident.",
    bullets: emergencyTimeline,
  },
  saathi: {
    eyebrow: "Farz+ Saathi",
    title: "Because health is not only medical.",
    intro:
      "Farz+ Saathi adds supervised companionship and practical support for elders who want dignity, connection, and independence at home.",
    bullets: saathiServices,
  },
  partners: {
    eyebrow: "Partner Network OS",
    title: "Verified care partners, scored by operations quality.",
    intro:
      "Farz+ does not ask families to search blindly. Partners are verified, assigned, monitored, scored, and escalated when service quality slips.",
    bullets: partnerCategories,
  },
  about: {
    eyebrow: "About Farz+",
    title: "The Responsible Guardian plus the Intelligent Companion.",
    intro:
      "Farz+ is built for Pakistani families who believe caring for parents is Farz, but need a modern operating system to make that care consistent.",
    bullets: [
      "Pakistan-first localization",
      "Human care managers with AI copilots",
      "Transparent proof-based family updates",
      "Managed care, not a marketplace",
      "Trust, privacy, and dignity by design",
    ],
  },
};
