create extension if not exists pgcrypto;

create type user_role as enum ('FAMILY','ELDER','CARE_MANAGER','CLINICIAN','ADMIN','PARTNER','EMPLOYER');
create type risk_status as enum ('ROUTINE','ATTENTION','URGENT_REVIEW');
create type visibility as enum ('FAMILY_VISIBLE','INTERNAL','CLINICIAN');
create type review_state as enum ('NO_REVIEW_REQUIRED','PENDING_HUMAN_REVIEW','APPROVED','EDITED','ESCALATED');
create type operational_priority as enum ('ROUTINE','STANDARD','HIGH','URGENT');
create type case_status as enum ('OPEN','IN_PROGRESS','AWAITING_FAMILY','AWAITING_PROVIDER','ESCALATED','RESOLVED');
create type request_status as enum ('OPEN','COORDINATING','ESCALATED','COMPLETED');

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization_type text,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid,
  name text not null,
  email text not null unique,
  role user_role not null,
  avatar text,
  phone text,
  organization_id uuid references organizations(id),
  created_at timestamptz not null default now()
);

create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  profile_id uuid not null references profiles(id),
  role user_role not null,
  created_at timestamptz not null default now()
);

create table if not exists households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  created_at timestamptz not null default now()
);

create table if not exists household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id),
  profile_id uuid references profiles(id),
  name text not null,
  relation text not null,
  role user_role not null,
  consent_scope text not null,
  created_at timestamptz not null default now()
);

create table if not exists elder_profiles (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id),
  name text not null,
  date_of_birth date,
  age integer,
  city text not null,
  preferred_language text not null,
  risk_status risk_status not null default 'ROUTINE',
  accessibility_preferences text[] default array[]::text[],
  assigned_care_manager uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists consent_records (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references elder_profiles(id),
  household_id uuid not null references households(id),
  granted_by uuid not null references profiles(id),
  scope text not null,
  active boolean not null default true,
  captured_at timestamptz not null default now()
);

create table if not exists emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references elder_profiles(id),
  name text not null,
  relationship text not null,
  phone text not null,
  preferred_channel text not null default 'CALL',
  created_at timestamptz not null default now()
);

create table if not exists medications (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references elder_profiles(id),
  name text not null,
  dosage_as_recorded text not null,
  schedule_as_recorded text not null,
  prescribing_clinician_name text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists medication_events (
  id uuid primary key default gen_random_uuid(),
  medication_id uuid not null references medications(id),
  elder_id uuid not null references elder_profiles(id),
  event_type text not null,
  reported_at timestamptz,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists allergies (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references elder_profiles(id),
  name text not null,
  severity text,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists conditions (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references elder_profiles(id),
  name text not null,
  status text,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists treating_clinicians (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references elder_profiles(id),
  name text not null,
  specialty text,
  organization_name text,
  created_at timestamptz not null default now()
);

create table if not exists care_plans (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references elder_profiles(id),
  template_name text not null,
  status text not null default 'DRAFT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id),
  tier text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists care_manager_assignments (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references elder_profiles(id),
  care_manager_id uuid not null references profiles(id),
  household_id uuid not null references households(id),
  assigned_at timestamptz not null default now(),
  status text not null default 'ACTIVE'
);

create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references elder_profiles(id),
  household_id uuid not null references households(id),
  created_by uuid not null references profiles(id),
  category text not null,
  description text not null,
  operational_priority operational_priority not null default 'ROUTINE',
  status case_status not null default 'OPEN',
  assigned_care_manager uuid references profiles(id),
  escalation_status text not null default 'NONE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists case_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id),
  actor_id uuid references profiles(id),
  event_type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists case_notes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id),
  author_id uuid not null references profiles(id),
  body text not null,
  visibility visibility not null default 'INTERNAL',
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id),
  title text not null,
  owner_id uuid references profiles(id),
  due_date timestamptz,
  priority text not null,
  status text not null default 'OPEN',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists check_ins (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references elder_profiles(id),
  scheduled_at timestamptz,
  completed_at timestamptz,
  contacted_by uuid references profiles(id),
  wellbeing_as_reported text,
  meals_hydration_text text,
  mobility_observation text,
  medication_adherence text,
  follow_up_required boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references elder_profiles(id),
  household_id uuid not null references households(id),
  title text not null,
  appointment_type text not null,
  provider_name text,
  provider_location text,
  appointment_date timestamptz not null,
  status text not null default 'SCHEDULED',
  created_at timestamptz not null default now()
);

create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references elder_profiles(id),
  household_id uuid not null references households(id),
  created_by uuid not null references profiles(id),
  provider_id uuid,
  title text not null,
  category text not null,
  status request_status not null default 'OPEN',
  created_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id),
  household_id uuid references households(id),
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id),
  sender_id uuid not null references profiles(id),
  sender_role user_role not null,
  text text not null,
  visibility visibility not null,
  risk_flag boolean not null default false,
  risk_reason text,
  review_state review_state not null default 'NO_REVIEW_REQUIRED',
  timestamp timestamptz not null default now()
);

create table if not exists escalations (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id),
  elder_id uuid not null references elder_profiles(id),
  clinician_id uuid references profiles(id),
  reason text not null,
  status text not null default 'OPEN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clinical_reviews (
  id uuid primary key default gen_random_uuid(),
  escalation_id uuid not null references escalations(id),
  clinician_id uuid not null references profiles(id),
  notes text not null,
  recommended_action text,
  status text not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references elder_profiles(id),
  case_id uuid references cases(id),
  uploader_id uuid not null references profiles(id),
  url text not null,
  document_type text not null,
  uploaded_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  title text not null,
  body text not null,
  unread boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization_type text not null,
  city text not null,
  status text not null default 'ACTIVE'
);

create table if not exists partner_referrals (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id),
  elder_id uuid not null references elder_profiles(id),
  case_id uuid references cases(id),
  service_type text not null,
  status text not null default 'OPEN'
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  family_location text not null,
  parent_city text not null,
  urgency text not null,
  needs text not null,
  consent boolean not null default false,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists consultation_requests (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  requested_at timestamptz not null default now(),
  status text not null default 'REQUESTED'
);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references profiles(id),
  actor_role user_role not null,
  action text not null,
  entity text not null,
  created_at timestamptz not null default now(),
  metadata jsonb
);

create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_profiles_organization on profiles(organization_id);
create index if not exists idx_cases_status on cases(status);
create index if not exists idx_cases_assigned_manager on cases(assigned_care_manager);
create index if not exists idx_messages_conversation on messages(conversation_id);
create index if not exists idx_messages_visibility on messages(visibility);
create index if not exists idx_documents_elder on documents(elder_id);
create index if not exists idx_notifications_user on notifications(user_id);
create index if not exists idx_leads_status on leads(status);
