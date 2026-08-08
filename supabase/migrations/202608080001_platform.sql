create extension if not exists pgcrypto;

create type public.app_role as enum ('FAMILY', 'ELDER', 'CARE_MANAGER', 'CLINICIAN', 'ADMIN', 'PARTNER', 'EMPLOYER');
create type public.household_member_role as enum ('OWNER', 'COORDINATOR', 'VIEWER', 'ELDER');
create type public.consent_state as enum ('PENDING', 'ATTESTED', 'VERIFIED', 'REVOKED');
create type public.care_request_status as enum ('NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'WAITING_ON_FAMILY', 'WAITING_ON_PROVIDER', 'ESCALATED', 'RESOLVED', 'CLOSED');
create type public.care_request_type as enum ('REGULAR_CHECK_IN', 'APPOINTMENT_COORDINATION', 'LAB_COORDINATION', 'PHARMACY_COORDINATION', 'HOME_CARE', 'PHYSIOTHERAPY', 'TRANSPORT', 'DOCUMENT_FOLLOW_UP', 'MEDICATION_CONCERN', 'GENERAL_CONCERN', 'OTHER');
create type public.risk_level as enum ('STABLE', 'ATTENTION', 'CRITICAL');
create type public.subscription_status as enum ('REQUESTED', 'PENDING_ACTIVATION', 'ACTIVE', 'PAUSED', 'CANCELLED');
create type public.lead_status as enum ('NEW', 'CONTACTED', 'CALL_BOOKED', 'QUALIFIED', 'CONVERTED', 'CLOSED');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  display_name text not null default '',
  email text not null default '',
  phone text,
  country text,
  city text,
  role public.app_role not null default 'FAMILY',
  avatar_url text,
  onboarding_completed boolean not null default false,
  active boolean not null default true,
  mfa_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references public.profiles(id),
  country text default 'Pakistan',
  city text,
  preferred_language text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  member_role public.household_member_role not null default 'VIEWER',
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade,
  email text not null,
  role public.app_role not null default 'FAMILY',
  member_role public.household_member_role,
  invited_by uuid not null references public.profiles(id),
  token_hash text not null unique,
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.elders (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  name text not null,
  date_of_birth date,
  approximate_age integer,
  relationship text,
  city text,
  preferred_language text default 'en',
  phone text,
  living_arrangement text,
  preferred_hospital text,
  treating_physician text,
  support_needs text,
  risk_level public.risk_level not null default 'STABLE',
  consent_state public.consent_state not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.elders(id) on delete cascade,
  name text not null,
  relationship text,
  phone text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.conditions (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.elders(id) on delete cascade,
  name text not null,
  recorded_source text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.allergies (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.elders(id) on delete cascade,
  name text not null,
  reaction text,
  recorded_source text,
  created_at timestamptz not null default now()
);

create table public.medications (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.elders(id) on delete cascade,
  name text not null,
  dosage text,
  schedule text,
  time text,
  recorded_source text,
  prescribing_clinician text,
  start_date date,
  status text not null default 'PENDING',
  notes text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.elders(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id),
  name text not null,
  category text not null default 'OTHER',
  storage_path text not null unique,
  mime_type text not null,
  size_bytes bigint not null,
  extracted_text text,
  consent_state public.consent_state not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.care_requests (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  elder_id uuid not null references public.elders(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  type public.care_request_type not null,
  title text not null,
  description text not null,
  status public.care_request_status not null default 'NEW',
  risk_level public.risk_level not null default 'STABLE',
  assigned_care_manager_id uuid references public.profiles(id),
  assigned_clinician_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade,
  elder_id uuid references public.elders(id) on delete cascade,
  care_request_id uuid references public.care_requests(id) on delete cascade,
  staff_id uuid not null references public.profiles(id),
  assigned_by uuid not null references public.profiles(id),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint assignment_target check (household_id is not null or elder_id is not null or care_request_id is not null)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  care_request_id uuid not null references public.care_requests(id) on delete cascade,
  assigned_to uuid references public.profiles(id),
  created_by uuid not null references public.profiles(id),
  title text not null,
  description text,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.case_events (
  id uuid primary key default gen_random_uuid(),
  care_request_id uuid not null references public.care_requests(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  event_type text not null,
  detail text,
  visible_to_family boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.internal_notes (
  id uuid primary key default gen_random_uuid(),
  care_request_id uuid not null references public.care_requests(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  note text not null,
  created_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  elder_id uuid references public.elders(id) on delete set null,
  subject text not null default 'Farz+ care conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null,
  visibility text not null default 'FAMILY',
  risk_level public.risk_level not null default 'STABLE',
  ai_job_id uuid,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.clinical_escalations (
  id uuid primary key default gen_random_uuid(),
  care_request_id uuid not null references public.care_requests(id) on delete cascade,
  elder_id uuid not null references public.elders(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  clinician_id uuid references public.profiles(id),
  status text not null default 'OPEN',
  reason text not null,
  clinician_observation text,
  clarification_request text,
  external_evaluation_recommended boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  plan_key text not null,
  status public.subscription_status not null default 'REQUESTED',
  requested_by uuid not null references public.profiles(id),
  activated_by uuid references public.profiles(id),
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  source text not null,
  message text,
  status public.lead_status not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.elders(id) on delete cascade,
  granted_by uuid not null references public.profiles(id),
  consent_type text not null,
  purpose text not null,
  processor text,
  transfer_region text,
  policy_version text not null,
  evidence_url text,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table public.deletion_requests (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid not null references public.profiles(id),
  household_id uuid references public.households(id) on delete set null,
  status text not null default 'REQUESTED',
  admin_decision text,
  legal_hold boolean not null default false,
  decided_by uuid references public.profiles(id),
  decided_at timestamptz,
  purged_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references public.messages(id) on delete cascade,
  care_request_id uuid references public.care_requests(id) on delete cascade,
  status text not null default 'QUEUED',
  provider text not null default 'CORTI',
  request_payload jsonb,
  response_payload jsonb,
  risk_level public.risk_level,
  risk_reason text,
  context_summary text,
  drafted_response text,
  error_class text,
  attempts integer not null default 0,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.messages add constraint messages_ai_job_fk foreign key (ai_job_id) references public.ai_jobs(id) on delete set null;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['profiles','households','elders','medications','documents','care_requests','conversations','clinical_escalations','subscriptions','leads'] loop
    execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()', 'touch_' || t, t);
  end loop;
end $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare first_name text := coalesce(new.raw_user_meta_data ->> 'first_name', '');
declare last_name text := coalesce(new.raw_user_meta_data ->> 'last_name', '');
begin
  insert into public.profiles (auth_user_id, first_name, last_name, display_name, email, phone, country, city, role)
  values (new.id, first_name, last_name, trim(first_name || ' ' || last_name), coalesce(new.email, ''), new.raw_user_meta_data ->> 'phone', new.raw_user_meta_data ->> 'country', new.raw_user_meta_data ->> 'city', case when lower(coalesce(new.email, '')) = 'hasnainakber9@gmail.com' then 'ADMIN'::public.app_role else 'FAMILY'::public.app_role end);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.current_profile_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.profiles where auth_user_id = auth.uid() and active = true limit 1;
$$;

create or replace function public.current_app_role()
returns public.app_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where auth_user_id = auth.uid() and active = true limit 1;
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_app_role() = 'ADMIN', false);
$$;

create or replace function public.is_household_member(target_household uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists (select 1 from public.household_members where household_id = target_household and user_id = public.current_profile_id());
$$;

create or replace function public.can_access_elder(target_elder uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists (
    select 1 from public.elders e
    join public.household_members hm on hm.household_id = e.household_id
    where e.id = target_elder and hm.user_id = public.current_profile_id()
  ) or exists (
    select 1 from public.assignments a
    where a.elder_id = target_elder and a.staff_id = public.current_profile_id() and a.active = true
  );
$$;

create or replace function public.can_access_request(target_request uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists (
    select 1 from public.care_requests r where r.id = target_request and public.is_household_member(r.household_id)
  ) or exists (
    select 1 from public.care_requests r where r.id = target_request and (r.assigned_care_manager_id = public.current_profile_id() or r.assigned_clinician_id = public.current_profile_id())
  );
$$;

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.invitations enable row level security;
alter table public.elders enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.conditions enable row level security;
alter table public.allergies enable row level security;
alter table public.medications enable row level security;
alter table public.documents enable row level security;
alter table public.care_requests enable row level security;
alter table public.assignments enable row level security;
alter table public.tasks enable row level security;
alter table public.case_events enable row level security;
alter table public.internal_notes enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.clinical_escalations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.leads enable row level security;
alter table public.consent_records enable row level security;
alter table public.deletion_requests enable row level security;
alter table public.ai_jobs enable row level security;
alter table public.audit_events enable row level security;

create policy profiles_self_or_admin on public.profiles for select using (auth_user_id = auth.uid() or public.is_admin());
create policy profiles_self_update on public.profiles for update using (auth_user_id = auth.uid() or public.is_admin()) with check (auth_user_id = auth.uid() or public.is_admin());
create policy profiles_admin_insert on public.profiles for insert with check (public.is_admin() or auth_user_id = auth.uid());

create policy households_member_select on public.households for select using (public.is_household_member(id));
create policy households_owner_insert on public.households for insert with check (created_by = public.current_profile_id());
create policy households_admin_update on public.households for update using (public.is_admin() or created_by = public.current_profile_id()) with check (public.is_admin() or created_by = public.current_profile_id());
create policy household_members_member_select on public.household_members for select using (public.is_household_member(household_id));
create policy household_members_owner_write on public.household_members for all using (public.is_admin() or exists (select 1 from public.households h where h.id = household_id and h.created_by = public.current_profile_id())) with check (public.is_admin() or exists (select 1 from public.households h where h.id = household_id and h.created_by = public.current_profile_id()));

create policy elders_access on public.elders for select using (public.can_access_elder(id));
create policy elders_member_insert on public.elders for insert with check (public.is_household_member(household_id) and created_by = public.current_profile_id());
create policy elders_member_update on public.elders for update using (public.can_access_elder(id)) with check (public.can_access_elder(id));

create policy emergency_access on public.emergency_contacts for all using (public.can_access_elder(elder_id)) with check (public.can_access_elder(elder_id));
create policy conditions_access on public.conditions for all using (public.can_access_elder(elder_id)) with check (public.can_access_elder(elder_id));
create policy allergies_access on public.allergies for all using (public.can_access_elder(elder_id)) with check (public.can_access_elder(elder_id));
create policy medications_access on public.medications for all using (public.can_access_elder(elder_id)) with check (public.can_access_elder(elder_id));
create policy documents_access on public.documents for all using (public.can_access_elder(elder_id) and (consent_state <> 'PENDING' or public.is_admin())) with check (public.can_access_elder(elder_id));

create policy requests_access on public.care_requests for select using (public.can_access_request(id));
create policy requests_member_insert on public.care_requests for insert with check (public.is_household_member(household_id) and created_by = public.current_profile_id());
create policy requests_staff_update on public.care_requests for update using (public.can_access_request(id)) with check (public.can_access_request(id));
create policy assignments_access on public.assignments for select using (public.is_admin() or staff_id = public.current_profile_id() or (household_id is not null and public.is_household_member(household_id)) or (elder_id is not null and public.can_access_elder(elder_id)));
create policy assignments_admin_write on public.assignments for all using (public.is_admin()) with check (public.is_admin());
create policy tasks_access on public.tasks for all using (public.can_access_request(care_request_id)) with check (public.can_access_request(care_request_id));
create policy events_access on public.case_events for select using (public.can_access_request(care_request_id) and (visible_to_family or public.current_app_role() <> 'FAMILY'));
create policy events_staff_insert on public.case_events for insert with check (public.can_access_request(care_request_id));
create policy notes_staff_access on public.internal_notes for all using (public.current_app_role() in ('ADMIN','CARE_MANAGER','CLINICIAN') and public.can_access_request(care_request_id)) with check (public.current_app_role() in ('ADMIN','CARE_MANAGER','CLINICIAN') and public.can_access_request(care_request_id));

create policy conversations_access on public.conversations for all using (public.can_access_elder(elder_id)) with check (public.can_access_elder(elder_id));
create policy messages_access on public.messages for all using (exists (select 1 from public.conversations c where c.id = conversation_id and public.can_access_elder(c.elder_id))) with check (sender_id = public.current_profile_id() or public.is_admin());
create policy notifications_self on public.notifications for all using (recipient_id = public.current_profile_id() or public.is_admin()) with check (recipient_id = public.current_profile_id() or public.is_admin());
create policy escalations_access on public.clinical_escalations for all using (public.is_admin() or created_by = public.current_profile_id() or clinician_id = public.current_profile_id() or public.can_access_request(care_request_id)) with check (public.is_admin() or created_by = public.current_profile_id() or clinician_id = public.current_profile_id());
create policy subscriptions_access on public.subscriptions for select using (public.is_household_member(household_id) or public.is_admin());
create policy subscriptions_member_request on public.subscriptions for insert with check (public.is_household_member(household_id) and requested_by = public.current_profile_id());
create policy subscriptions_admin_update on public.subscriptions for update using (public.is_admin()) with check (public.is_admin());
create policy leads_public_insert on public.leads for insert with check (true);
create policy leads_admin_access on public.leads for all using (public.is_admin()) with check (public.is_admin());
create policy consent_access on public.consent_records for select using (public.can_access_elder(elder_id));
create policy consent_member_insert on public.consent_records for insert with check (public.can_access_elder(elder_id) and granted_by = public.current_profile_id());
create policy consent_admin_update on public.consent_records for update using (public.is_admin()) with check (public.is_admin());
create policy deletion_self_request on public.deletion_requests for insert with check (requested_by = public.current_profile_id());
create policy deletion_self_read on public.deletion_requests for select using (requested_by = public.current_profile_id() or public.is_admin());
create policy deletion_admin_update on public.deletion_requests for update using (public.is_admin()) with check (public.is_admin());
create policy ai_staff_access on public.ai_jobs for select using (public.is_admin() or exists (select 1 from public.messages m join public.conversations c on c.id = m.conversation_id where m.ai_job_id = ai_jobs.id and public.can_access_elder(c.elder_id)));
create policy audit_admin_read on public.audit_events for select using (public.is_admin());
create policy audit_authenticated_insert on public.audit_events for insert with check (actor_id = public.current_profile_id() or public.is_admin());

create index elders_household_idx on public.elders(household_id);
create index requests_status_idx on public.care_requests(status, risk_level, updated_at desc);
create index messages_conversation_idx on public.messages(conversation_id, created_at);
create index notifications_recipient_idx on public.notifications(recipient_id, read_at, created_at desc);
create index ai_jobs_queue_idx on public.ai_jobs(status, created_at);

insert into storage.buckets (id, name, public) values ('care-documents', 'care-documents', false) on conflict (id) do nothing;
create policy care_documents_select on storage.objects for select using (bucket_id = 'care-documents' and public.can_access_elder((storage.foldername(name))[2]::uuid));
create policy care_documents_insert on storage.objects for insert with check (bucket_id = 'care-documents' and public.can_access_elder((storage.foldername(name))[2]::uuid));
create policy care_documents_delete on storage.objects for delete using (bucket_id = 'care-documents' and public.can_access_elder((storage.foldername(name))[2]::uuid));
